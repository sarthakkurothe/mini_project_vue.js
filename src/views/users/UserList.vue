<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 class="text-3xl font-bold">Clients</h1>
        <p class="text-gray-600 mt-1">Manage your client portfolio</p>
      </div>

      <GradientButton
        @click="goToAddClient"
        class="px-3 py-2 rounded-md font-semibold flex items-center gap-2 cursor-pointer"
      >
        <span class="text-lg font-bold">+</span> Add Client
      </GradientButton>
    </div>

    <!-- Search -->
    <div class="mb-6 bg-white shadow-md border border-gray-100 rounded-xl">
      <div class="relative p-4">
        <Search class="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search clients by name or email..."
          v-model="searchQuery"
          class="w-full pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-0 border-0 cursor-pointer"
        />
      </div>
    </div>

    <!-- Clients Table -->
    <div v-if="filteredUsers.length > 0" class="overflow-x-auto">
      <table class="w-full text-sm border border-gray-200 rounded-xl shadow-md overflow-hidden">
        <thead class="bg-gradient-to-r from-violet-50 to-white border-b border-gray-200">
          <tr>
            <th class="py-3 px-4 text-left font-medium border-r border-gray-200">Name</th>
            <th class="py-3 px-4 text-left font-medium border-r border-gray-200">Email</th>
            <th class="py-3 px-4 text-left font-medium border-r border-gray-200">Phone</th>
            <th class="py-3 px-4 text-center font-medium border-r border-gray-200">Risk Tolerance</th>
            <th class="py-3 px-4 text-right font-medium border-r border-gray-200">Portfolio Value</th>
            <th class="py-3 px-4 text-center font-medium">Joined</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            class="cursor-pointer hover:bg-purple-50 transition-colors border-b border-gray-100"
            @click="openModal(user)"
          >
            <td class="py-3 px-4 font-semibold border-r border-gray-100">{{ user.fullName }}</td>
            <td class="py-3 px-4 border-r border-gray-100">{{ user.email }}</td>
            <td class="py-3 px-4 border-r border-gray-100">{{ user.phone }}</td>
            <td class="py-3 px-4 text-center border-r border-gray-100">
              <Badge :risk="formatRisk(user.riskTolerance)" />
            </td>
            <td class="py-3 px-4 text-right text-purple-600 font-bold border-r border-gray-100">
              ₹{{ user.initialInvestment?.toLocaleString() || 0 }}
            </td>
            <td class="py-3 px-4 text-center">
              {{ new Date(user.joinedDate || user.id).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white shadow-md rounded-xl py-10 text-center">
      <p class="text-gray-500">No clients found matching your search.</p>
    </div>

    <!-- Modal -->
    <div
      v-if="selectedUser"
      class="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg relative">
        <h2 class="text-2xl font-bold mb-4">{{ selectedUser.fullName }}</h2>
        <Badge :risk="formatRisk(selectedUser.riskTolerance)" class="mb-4" />
        <div class="space-y-3 text-gray-700">
          <p><strong>Email:</strong> {{ selectedUser.email }}</p>
          <p><strong>Phone:</strong> {{ selectedUser.phone }}</p>
          <p><strong>Risk Tolerance:</strong> {{ formatRisk(selectedUser.riskTolerance) }}</p>
          <p><strong>Initial Investment:</strong> ₹{{ selectedUser.initialInvestment?.toLocaleString() || 0 }}</p>
          <p><strong>Joined:</strong> {{ new Date(selectedUser.joinedDate || selectedUser.id).toLocaleDateString() }}</p>
        </div>
        <div class="mt-6 text-right">
          <button
            @click="closeModal"
            class="cursor-pointer px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import GradientButton from "../../components/GradientButton.vue";
import Badge from "../../components/Badge.vue";
import { Search } from "lucide-vue-next";
import { sampleUsers } from "../../data/UserData.js";

const router = useRouter();
const searchQuery = ref("");
const users = ref([]);
const selectedUser = ref(null);

const goToAddClient = () => router.push("/users/add");
const openModal = (user) => (selectedUser.value = user);
const closeModal = () => (selectedUser.value = null);

onMounted(() => {
  const savedUsers = JSON.parse(localStorage.getItem("clients")) || [];
  users.value = savedUsers.length ? savedUsers : sampleUsers;
  if (!savedUsers.length) localStorage.setItem("clients", JSON.stringify(users.value));
});

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(
    (u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
});

const formatRisk = (risk) => {
  if (!risk) return "";
  switch (risk.toUpperCase()) {
    case "MODERATE": return "Moderate";
    case "AGGRESSIVE": return "Aggressive";
    case "CONSERVATIVE": return "Conservative";
    default: return risk;
  }
};
</script>
