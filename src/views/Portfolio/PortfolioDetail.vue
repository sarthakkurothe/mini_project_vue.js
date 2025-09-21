<template>
  <div class="space-y-10 p-6">
    <div v-if="!portfolio" class="space-y-6">
      <div class="flex items-center gap-4">
        <button @click="goBack" class="p-2 rounded-md hover:bg-gray-100 transition-colors">
          <ArrowLeft class="h-5 w-5 text-gray-700" />
        </button>

        <h1 class="text-3xl font-bold text-foreground">Portfolio Not Found</h1>
      </div>

      <Card>
        <div class="py-8 text-center">
          <p class="text-muted-foreground">The requested portfolio could not be found.</p>
        </div>
      </Card>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <button @click="goBack" class="p-2 rounded-md hover:bg-gray-100 transition-colors cursor-pointer">
            <ArrowLeft class="h-5 w-5 text-gray-700" />
          </button>

          <div>
            <h1 class="text-3xl font-bold text-foreground">{{ portfolio.name }}</h1>
            <p class="text-muted-foreground">{{ portfolio.clientName }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span :class="badgeClass(portfolio.status)" class="px-3 py-1 rounded-md text-sm font-medium">
            {{ portfolio.status }}
          </span>

          <GradientButton @click="editAndNavigate" class="cursor-pointer px-3 py-2 rounded-md font-semibold flex items-center gap-2">
            <Edit class="h-4 w-4" />
            Edit Portfolio
          </GradientButton>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="grid gap-8 md:grid-cols-4 mb-10">
        <Card class="bg-gradient-to-br from-violet-50 to-white shadow-sm rounded-xl p-4">
          <div class="flex items-center justify-between pb-2">
            <h3 class="text-sm font-medium">Current Value</h3>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="text-2xl font-bold">{{ formatCurrencyINR(portfolio.totalValue) }}</div>
          <p class="text-xs text-muted-foreground">Total portfolio value</p>
        </Card>

        <Card class="bg-gradient-to-br from-violet-50 to-white shadow-sm rounded-xl p-4">
          <div class="flex items-center justify-between pb-2">
            <h3 class="text-sm font-medium">Initial Investment</h3>
            <Calendar class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="text-2xl font-bold">{{ formatCurrencyINR(portfolio.initialInvestment) }}</div>
          <p class="text-xs text-muted-foreground">Original investment</p>
        </Card>

        <Card class="bg-gradient-to-br from-violet-50 to-white shadow-sm rounded-xl p-4">
          <div class="flex items-center justify-between pb-2">
            <h3 class="text-sm font-medium">Total Return</h3>
            <component
              :is="portfolio.returnPercentage >= 0 ? TrendingUp : TrendingDown"
              :class="portfolio.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'"
              class="h-4 w-4"
            />
          </div>
          <div
            :class="[
              'text-2xl font-bold',
              portfolio.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ formatCurrencyINR(portfolio.currentReturn) }}
          </div>
          <p class="text-xs text-muted-foreground">
            {{ portfolio.returnPercentage >= 0 ? '+' : '' }}{{ portfolio.returnPercentage.toFixed(2) }}%
          </p>
        </Card>

        <Card class="bg-gradient-to-br from-violet-50 to-white shadow-sm rounded-xl p-4">
          <div class="flex items-center justify-between pb-2">
            <h3 class="text-sm font-medium">Last Updated</h3>
            <Calendar class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="text-2xl font-bold">
            {{ new Date(portfolio.lastUpdated).toLocaleDateString() }}
          </div>
          <p class="text-xs text-muted-foreground">Portfolio data</p>
        </Card>
      </div>

      <!-- Holdings Table -->
      <Card class="bg-white shadow-sm rounded-xl">
        <div class="p-4 pb-6 border-b border-gray-200">
          <h3 class="text-lg font-semibold">Holdings</h3>
          <p class="text-sm text-muted-foreground">Current positions in this portfolio</p>
        </div>

        <div v-if="holdings.length > 0" class="overflow-x-auto mt-4">
          <table class="w-full text-sm border border-gray-200 rounded-xl shadow-md overflow-hidden">
            <thead class="bg-gradient-to-r from-violet-50 to-white border-b border-gray-200">
              <tr>
                <th class="py-3 px-4 text-left font-medium border-r border-gray-200">Symbol</th>
                <th class="py-3 px-4 text-left font-medium border-r border-gray-200">Name</th>
                <th class="py-3 px-4 text-right font-medium border-r border-gray-200">Quantity</th>
                <th class="py-3 px-4 text-right font-medium border-r border-gray-200">Price</th>
                <th class="py-3 px-4 text-right font-medium border-r border-gray-200">Value</th>
                <th class="py-3 px-4 text-right font-medium border-r border-gray-200">Allocation</th>
                <th class="py-3 px-4 text-center font-medium">Day Change</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="holding in holdings"
                :key="holding.id"
                class="transition-colors border-b border-gray-100 hover:bg-gray-50"
              >
                <td class="py-3 px-4 font-semibold border-r border-gray-100">
                  <div class="inline-flex items-center gap-3">
                    <span
                      class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-violet-100 text-violet-700 font-bold"
                    >
                      {{ holding.symbol[0] }}
                    </span>
                    <span class="font-medium ml-1">{{ holding.symbol }}</span>
                  </div>
                </td>

                <td class="py-3 px-4 border-r border-gray-100">{{ holding.name }}</td>

                <td class="py-3 px-4 text-right border-r border-gray-100">
                  {{ holding.quantity.toLocaleString() }}
                </td>

                <td class="py-3 px-4 text-right border-r border-gray-100">
                  {{ formatCurrencyINR(holding.currentPrice) }}
                </td>

                <td class="py-3 px-4 text-right font-medium border-r border-gray-100">
                  {{ formatCurrencyINR(holding.totalValue) }}
                </td>

                <td class="py-3 px-4 text-right border-r border-gray-100">
                  {{ holding.allocation.toFixed(1) }}%
                </td>

                <td class="py-3 px-4 text-center">
                  <span :class="holding.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'">
                    {{ holding.dayChange >= 0 ? '+' : '' }}{{ formatCurrencyINR(holding.dayChange) }}
                    <span class="text-xs ml-2">
                      {{ holding.dayChangePercent >= 0 ? '+' : '' }}{{ holding.dayChangePercent.toFixed(2) }}%
                    </span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else class="py-8 text-center text-muted-foreground">
          No holdings data available for this portfolio.
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ArrowLeft, Edit, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-vue-next';
import Card from '../../components/Card.vue';
import GradientButton from '../../components/GradientButton.vue';
import { samplePortfolios } from '../../data/PortfolioData';
import { mockHoldings } from '../../data/mockHoldings';

const route = useRoute();
const router = useRouter();
const store = useStore();

const id = String(route.params.id || '');
const portfolios = JSON.parse(localStorage.getItem('portfolios') || '[]');
const portfolio =
  (portfolios.length ? portfolios.find((p) => String(p.id) === id) : null) ??
  samplePortfolios.find((p) => p.id === id) ??
  null;

const holdings = mockHoldings.filter((h) => h.portfolioId === id);

const goBack = () => router.push('/portfolios');

const editAndNavigate = () => {
  if (!portfolio) return;
  store.commit('portfolio/setEditing', { ...portfolio });
  router.push(`/portfolios/${portfolio.id}/edit`);
};

const formatCurrencyINR = (amount: number) => {
  const value = Number(amount ?? 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(value);
};

const badgeClass = (status: string) => {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVE':
      return 'bg-green-500 text-white';
    case 'UPCOMING':
      return 'bg-blue-500 text-white';
    case 'CLOSED':
      return 'bg-gray-300 text-gray-700';
    default:
      return 'bg-gray-200 text-gray-700';
  }
};
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}
</style>
