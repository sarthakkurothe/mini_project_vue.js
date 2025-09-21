<template>
  <div class="p-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold">Portfolios</h1>
        <p class="text-gray-600 mt-1">Manage investment portfolios</p>
      </div>

      <GradientButton
        @click="goToAddPortfolio"
        class="px-3 py-2 rounded-md font-semibold flex items-center gap-2"
      >
        <span class="text-lg font-bold">+</span> Create Portfolio
      </GradientButton>
    </div>

    <!-- Search -->
    <div class="mb-6 bg-white shadow-md border border-gray-100 rounded-xl">
      <div class="relative p-4">
        <Search class="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search portfolios by name or client..."
          v-model="searchQuery"
          class="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-0 border-0"
        />
      </div>

      <!-- Tabs Component -->
      <PortfolioTabs :activeTab="activeTab" @update:activeTab="setActiveTab" />
    </div>

    <!-- Portfolio Grid -->
    <div v-if="filteredPortfolios.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="portfolio in filteredPortfolios"
        :key="portfolio.id"
        class="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
      >
        <!-- Header -->
        <div class="flex items-start justify-between mb-4">
          <div>
            <h2 class="text-lg font-semibold">{{ portfolio.name }}</h2>
            <p class="text-sm text-gray-500">{{ portfolio.clientName }}</p>
            <span
              class="inline-block mt-2 px-2 py-1 rounded text-xs font-semibold"
              :class="statusClasses(portfolio.status)"
            >
              {{ portfolio.status }}
            </span>
          </div>
          <div class="text-right" :class="statusIconColor(portfolio.status)">
            <TrendingUp v-if="portfolio.status === 'ACTIVE'" class="h-4 w-4" />
            <TrendingDown v-if="portfolio.status === 'CLOSED'" class="h-4 w-4" />
          </div>
        </div>

        <!-- Content -->
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-2xl font-bold text-purple-600">
                {{ formatCurrency(portfolio.totalValue) }}
              </p>
              <p class="text-xs text-gray-500">Current Value</p>
            </div>
            <div>
              <p
                class="text-2xl font-bold"
                :class="portfolio.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                {{ portfolio.returnPercentage >= 0 ? '+' : '' }}{{ portfolio.returnPercentage.toFixed(1) }}%
              </p>
              <p class="text-xs text-gray-500">Return</p>
            </div>
          </div>

          <div class="text-sm text-gray-500">
            <p>Initial: {{ formatCurrency(portfolio.initialInvestment) }}</p>
            <p>P&amp;L: {{ formatCurrency(portfolio.currentReturn) }}</p>
          </div>

          <div class="pt-3">
            <button
              @click="goToPortfolio(portfolio.id)"
              class="w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm transition-colors
                     bg-white hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-600
                     hover:text-white"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white shadow-md rounded-xl py-10 text-center">
      <p class="text-gray-500">No portfolios found matching your criteria.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import GradientButton from "../../components/GradientButton.vue";
import PortfolioTabs from "../../components/PortfolioTabs.vue";
import { Search, TrendingUp, TrendingDown } from "lucide-vue-next";
import { samplePortfolios } from "../../data/PortfolioData"

const router = useRouter();
const searchQuery = ref("");
const activeTab = ref("all");
const portfolios = ref([]);

const goToAddPortfolio = () => router.push("/portfolios/new");
const goToPortfolio = (id) => {
  router.push(`/portfolios/${id}`);
};

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem("portfolios")) || [];
  portfolios.value = saved.length ? saved : samplePortfolios;
  if (!saved.length) localStorage.setItem("portfolios", JSON.stringify(portfolios.value));
});

const setActiveTab = (tab) => (activeTab.value = tab);

const filteredPortfolios = computed(() => {
  return portfolios.value.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.clientName.toLowerCase().includes(searchQuery.value.toLowerCase());
    if (activeTab.value === "all") return matchesSearch;
    return matchesSearch && p.status.toLowerCase() === activeTab.value;
  });
});

const formatCurrency = (amt) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amt);

const statusClasses = (status) => {
  switch (status) {
    case "ACTIVE": return "bg-green-100 text-green-700";
    case "UPCOMING": return "bg-yellow-100 text-yellow-700";
    case "CLOSED": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-500";
  }
};
const statusIconColor = (status) => {
  switch (status) {
    case "ACTIVE": return "text-green-600";
    case "UPCOMING": return "text-yellow-600";
    case "CLOSED": return "text-gray-400";
    default: return "text-gray-400";
  }
};
</script>
