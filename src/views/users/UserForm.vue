<template>
  <div class="bg-white flex justify-center px-4 py-8">
    <div class="w-full max-w-4xl">

      <!-- Header -->
      <div class="mb-8 flex items-center gap-4">
        <button
          @click="router.push('/users')"
          class="text-gray-700 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft class="w-6 h-6 cursor-pointer" />
        </button>
        <div>
          <h1 class="text-3xl font-bold">Add New Client</h1>
          <p class="text-gray-600 mt-1">Create a new client profile</p>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-xl font-semibold mb-6">Client Information</h2>

        <form @submit.prevent="submitForm" class="space-y-5">

          <!-- Row 1: Full Name & Email -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="font-medium block mb-1">
                Full Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="client.fullName"
                placeholder="Enter client's full name"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              />
              <p v-if="errors.fullName" class="text-red-500 text-sm mt-1">{{ errors.fullName }}</p>
            </div>

            <div>
              <label class="font-medium block mb-1">
                Email Address <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                v-model="client.email"
                placeholder="client@example.com"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              />
              <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
            </div>
          </div>

          <!-- Row 2: Phone & Risk Tolerance -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="font-medium block mb-1">
                Phone Number <span class="text-red-500">*</span>
              </label>
              <input
                type="tel"
                v-model="client.phone"
                placeholder="+91 98765 43210"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
              />
              <p v-if="errors.phone" class="text-red-500 text-sm mt-1">{{ errors.phone }}</p>
            </div>

            <div>
              <label class="font-medium block mb-1">
                Risk Tolerance <span class="text-red-500">*</span>
              </label>
              <Menu as="div" class="relative w-full">
                <MenuButton
                  class="w-full px-4 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center focus:outline-none focus:ring focus:ring-purple-300"
                >
                  <div class="flex items-center gap-2">
                    <Badge v-if="client.riskTolerance" :risk="formattedRisk(client.riskTolerance)" />
                  </div>
                  <ChevronDownIcon class="w-5 h-5 text-gray-500" />
                </MenuButton>

                <Transition
                  enter="transition ease-out duration-100"
                  enter-from="transform opacity-0 scale-95"
                  enter-to="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leave-from="transform opacity-100 scale-100"
                  leave-to="transform opacity-0 scale-95"
                >
                  <MenuItems class="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto">
                    <MenuItem v-for="option in riskOptions" :key="option">
                      <button
                        type="button"
                        @click="selectRisk(option)"
                        class="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      >
                        <Badge :risk="formattedRisk(option)" />
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>
              <p v-if="errors.riskTolerance" class="text-red-500 text-sm mt-1">{{ errors.riskTolerance }}</p>
            </div>
          </div>

          <!-- Row 3: Initial Investment -->
          <div>
            <label class="font-medium block mb-1">Initial Investment Amount (INR)</label>
            <input
              type="text"
              v-model="client.initialInvestment"
              @input="formatIndianNumber"
              placeholder="5,00,000"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-purple-300"
            />
            <p class="text-gray-400 text-sm mt-1">
              Optional: Enter the initial investment amount in INR
            </p>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-2 mt-6">
            <router-link
              to="/users"
              class="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </router-link>

            <button
              type="submit"
              class="cursor-pointer px-4 py-2 rounded-md text-white font-semibold bg-gradient-to-r from-purple-600 to-pink-500 flex items-center gap-2 hover:opacity-90"
            >
              <Save class="w-5 h-5" />
              Add Client
            </button>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { ArrowLeft, Save } from "lucide-vue-next";
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
import Badge from "../../components/Badge.vue";

const router = useRouter();

const client = reactive({
  fullName: "",
  email: "",
  phone: "",
  riskTolerance: "",
  initialInvestment: null,
});

const riskOptions = ["MODERATE", "AGGRESSIVE", "CONSERVATIVE"];

const errors = reactive({
  fullName: "",
  email: "",
  phone: "",
  riskTolerance: "",
});

const formattedRisk = (risk: string) => {
  switch (risk.toUpperCase()) {
    case "MODERATE":
      return "Moderate";
    case "AGGRESSIVE":
      return "Aggressive";
    case "CONSERVATIVE":
      return "Conservative";
    default:
      return risk;
  }
};

const selectRisk = (option: string) => {
  client.riskTolerance = option;
  errors.riskTolerance = "";
};

const formatIndianNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, "");
  if (!value) {
    client.initialInvestment = "";
    return;
  }
  const lastThree = value.slice(-3);
  const otherNumbers = value.slice(0, -3);
  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    (otherNumbers ? "," + lastThree : lastThree);
  client.initialInvestment = formatted;
  input.setSelectionRange(formatted.length, formatted.length);
};

const validateForm = () => {
  errors.fullName = client.fullName ? "" : "Full Name is required";
  errors.email = client.email ? "" : "Email is required";
  errors.phone = client.phone ? "" : "Phone number is required";
  errors.riskTolerance = client.riskTolerance ? "" : "Risk Tolerance is required";

  return client.fullName && client.email && client.phone && client.riskTolerance;
};

const submitForm = () => {
  if (!validateForm()) return;

  const newClient = { ...client, id: Date.now(), joinedDate: new Date().toISOString() };
  const savedClients = JSON.parse(localStorage.getItem("clients") || "[]");
  savedClients.push(newClient);
  localStorage.setItem("clients", JSON.stringify(savedClients));

  Object.keys(client).forEach((key) => (client[key] = key === "initialInvestment" ? null : ""));
  router.push("/users");
};
</script>

<style scoped>
input:focus,
select:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.3);
}
button:hover {
  cursor: pointer;
}
</style>
