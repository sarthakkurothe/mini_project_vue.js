<template>
  <div class="space-y-10 p-6">
    <!-- Not Found -->
    <div v-if="!portfolio" class="space-y-6">
      <div class="flex items-center gap-4">
        <button class="border rounded-md p-2" @click="goBack">
          <ArrowLeft class="h-4 w-4" />
        </button>
        <h1 class="text-3xl font-bold text-foreground">Portfolio Not Found</h1>
      </div>
      <Card>
        <div class="py-8 text-center">
          <p class="text-muted-foreground">
            The requested portfolio could not be found.
          </p>
        </div>
      </Card>
    </div>

    <!-- Portfolio Details -->
    <div v-else>
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <button class="border rounded-md p-2" @click="goBack">
            <ArrowLeft class="h-4 w-4" />
          </button>
          <div>
            <h1 class="text-3xl font-bold text-foreground">{{ portfolio.name }}</h1>
            <p class="text-muted-foreground">{{ portfolio.clientName }}</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span
            :class="badgeClass(portfolio.status)"
            class="px-3 py-1 rounded-md text-sm font-medium"
          >
            {{ portfolio.status }}
          </span>

          <!-- Edit Portfolio Button (rectangular like Create Portfolio) -->
          <GradientButton
            @click="editPortfolio"
            class="px-3 py-2 rounded-md font-semibold flex items-center gap-2"
          >
            <Edit class="h-4 w-4" />
            Edit Portfolio
          </GradientButton>
        </div>
      </div>

      <!-- Overview Cards -->
      <div class="grid gap-8 md:grid-cols-4 mb-10">
        <Card class="bg-gradient-to-br from-violet-50 to-white shadow-sm rounded-xl p-4">
          <div class="flex items-center justify-between pb-2">
            <h3 class="text-sm font-medium">Current Value</h3>
            <DollarSign class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="text-2xl font-bold">{{ formatCurrency(portfolio.totalValue) }}</div>
          <p class="text-xs text-muted-foreground">Total portfolio value</p>
        </Card>

        <Card class="bg-gradient-to-br from-violet-50 to-white shadow-sm rounded-xl p-4">
          <div class="flex items-center justify-between pb-2">
            <h3 class="text-sm font-medium">Initial Investment</h3>
            <Calendar class="h-4 w-4 text-muted-foreground" />
          </div>
          <div class="text-2xl font-bold">{{ formatCurrency(portfolio.initialInvestment) }}</div>
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
            {{ formatCurrency(portfolio.currentReturn) }}
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
        <div class="p-4 border-b">
          <h3 class="text-lg font-semibold">Holdings</h3>
          <p class="text-sm text-muted-foreground">Current positions in this portfolio</p>
        </div>

        <div v-if="holdings.length > 0" class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b text-gray-600">
                <th class="py-3 px-4 text-left font-medium">Symbol</th>
                <th class="py-3 px-4 text-left font-medium">Name</th>
                <th class="py-3 px-4 text-right font-medium">Quantity</th>
                <th class="py-3 px-4 text-right font-medium">Price</th>
                <th class="py-3 px-4 text-right font-medium">Value</th>
                <th class="py-3 px-4 text-right font-medium">Allocation</th>
                <th class="py-3 px-4 text-right font-medium">Day Change</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="holding in holdings"
                :key="holding.id"
                class="border-b last:border-0 hover:bg-gray-50"
              >
                <td class="py-3 px-4 font-semibold">{{ holding.symbol }}</td>
                <td class="py-3 px-4">{{ holding.name }}</td>
                <td class="py-3 px-4 text-right">{{ holding.quantity.toLocaleString() }}</td>
                <td class="py-3 px-4 text-right">{{ formatCurrency(holding.currentPrice) }}</td>
                <td class="py-3 px-4 text-right font-medium">{{ formatCurrency(holding.totalValue) }}</td>
                <td class="py-3 px-4 text-right">{{ holding.allocation.toFixed(1) }}%</td>
                <td class="py-3 px-4 text-right">
                  <span
                    :class="holding.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'"
                    class="font-medium"
                  >
                    {{ holding.dayChange > 0 ? '+' : '' }}{{ formatCurrency(holding.dayChange) }}
                    ({{ holding.dayChangePercent >= 0 ? '+' : '' }}{{ holding.dayChangePercent.toFixed(2) }}%)
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
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft, Edit, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-vue-next";
import Card from "../../components/Card.vue";
import GradientButton from "../../components/GradientButton.vue";
import { samplePortfolios } from "../../data/PortfolioData";
import { mockHoldings } from "../../data/mockHoldings";

const route = useRoute();
const router = useRouter();

const id = route.params.id as string;
const portfolio = samplePortfolios.find((p) => p.id === id);
const holdings = mockHoldings.filter((h) => h.portfolioId === id);

const goBack = () => router.push("/portfolios");

const editPortfolio = () => {
  console.log("Edit portfolio clicked");
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

const badgeClass = (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "bg-green-500 text-white";
    case "UPCOMING":
      return "bg-blue-500 text-white";
    case "CLOSED":
      return "bg-gray-300 text-gray-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};
</script>
