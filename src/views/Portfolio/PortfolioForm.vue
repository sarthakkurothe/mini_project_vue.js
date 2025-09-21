<template>
  <div class="bg-white flex justify-center px-4 py-8">
    <div class="w-full max-w-4xl">
      <!-- Header -->
      <div class="mb-8 flex items-center gap-4">
        <button
          @click="navigateBack"
          class="cursor-pointer text-gray-700 hover:text-gray-900 transition-colors rounded-md p-2"
        >
          <ArrowLeft class="w-6 h-6" />
        </button>

        <div>
          <h1 class="text-3xl font-bold">
            {{ isEditing ? "Edit Portfolio" : "Create Portfolio" }}
          </h1>
          <p class="text-gray-600 mt-1">
            Set up a new investment portfolio
          </p>
        </div>
      </div>

      <!-- Form Card -->
      <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 class="text-xl font-semibold mb-6">Portfolio Details</h2>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Row 1: Name + Client -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Portfolio Name -->
            <div>
              <label class="font-medium block mb-1">
                Portfolio Name <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                v-model="formData.name"
                placeholder="Growth Portfolio"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-purple-300"
              />
              <p v-if="errors.name" class="text-red-500 text-sm mt-1">
                {{ errors.name }}
              </p>
            </div>

            <!-- Client Dropdown -->
            <div>
              <label class="font-medium block mb-1">
                Client <span class="text-red-500">*</span>
              </label>

              <Menu as="div" class="relative w-full">
                <MenuButton
                  class="w-full px-4 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center focus:ring focus:ring-purple-300"
                >
                  <span class="truncate">
                    {{ selectedClientDisplay || "Select a client" }}
                  </span>
                  <ChevronDownIcon class="w-5 h-5 text-gray-500" />
                </MenuButton>

                <Transition
                  enter="transition ease-out duration-100"
                  enter-from="transform opacity-0 scale-95"
                  enter-to="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-60 overflow-auto"
                  >
                    <MenuItem v-if="clients.length === 0" disabled>
                      <div class="px-4 py-2 text-sm text-gray-500">
                        No clients available
                      </div>
                    </MenuItem>

                    <MenuItem v-for="c in clients" :key="c.id">
                      <button
                        type="button"
                        @click="selectClient(c)"
                        class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center justify-between"
                      >
                        <span class="truncate">{{ c.name }}</span>
                        <span class="text-sm text-purple-600 font-medium">
                          ₹{{ c.amount }}
                        </span>
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>

              <p v-if="errors.clientId" class="text-red-500 text-sm mt-1">
                {{ errors.clientId }}
              </p>
              <p v-if="clients.length === 0" class="text-sm text-gray-500 mt-2">
                No clients found. Add clients from the Clients page.
              </p>
            </div>
          </div>

          <!-- Row 2: Status + Initial Investment -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Portfolio Status -->
            <div>
              <label class="font-medium block mb-1">
                Portfolio Status <span class="text-red-500">*</span>
              </label>

              <Menu as="div" class="relative w-full">
                <MenuButton
                  class="w-full px-4 py-2 border border-gray-300 rounded-md bg-white flex justify-between items-center focus:ring focus:ring-purple-300"
                >
                  <div class="flex items-center gap-2">
                    <Badge
                      v-if="formData.status"
                      :label="formData.status"
                      :type="statusColors[formData.status]"
                    />
                    <span v-else class="text-gray-500">Select status</span>
                  </div>
                  <ChevronDownIcon class="w-5 h-5 text-gray-500" />
                </MenuButton>

                <Transition
                  enter="transition ease-out duration-100"
                  enter-from="transform opacity-0 scale-95"
                  enter-to="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leave-from="opacity-100 scale-100"
                  leave-to="opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10"
                  >
                    <MenuItem v-for="s in statusOptions" :key="s">
                      <button
                        type="button"
                        @click="selectStatus(s)"
                        class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <Badge :label="s" :type="statusColors[s]" />
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Transition>
              </Menu>

              <p v-if="errors.status" class="text-red-500 text-sm mt-1">
                {{ errors.status }}
              </p>
            </div>

            <!-- Initial Investment -->
            <div>
              <label class="font-medium block mb-1">
                Initial Investment (INR)
                <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                v-model.number="formData.initialInvestment"
                placeholder="500000"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-purple-300"
              />
              <p
                v-if="errors.initialInvestment"
                class="text-red-500 text-sm mt-1"
              >
                {{ errors.initialInvestment }}
              </p>
            </div>
          </div>

          <!-- Row 3: Description -->
          <div>
            <label class="font-medium block mb-1">Portfolio Description</label>
            <textarea
              v-model="formData.description"
              rows="4"
              placeholder="Describe the investment strategy..."
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring focus:ring-purple-300"
            />
            <p class="text-sm text-gray-500 mt-1">
              Optional: provide details about strategy & objectives
            </p>
          </div>

          <!-- Live Summary -->
          <div class="bg-violet-50 p-4 rounded-md border border-violet-100">
            <h3 class="font-medium mb-2">Portfolio Summary</h3>
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-gray-500">Portfolio Name:</span>
                <p class="font-medium">
                  {{ formData.name || "Not specified" }}
                </p>
              </div>
              <div>
                <span class="text-gray-500">Status:</span>
                <p class="font-medium">
                  <Badge
                    v-if="formData.status"
                    :label="formData.status"
                    :type="statusColors[formData.status]"
                  />
                  <span v-else>Not selected</span>
                </p>
              </div>
              <div>
                <span class="text-gray-500">Client:</span>
                <p class="font-medium">
                  {{ selectedClientName || "Not selected" }}
                </p>
              </div>
              <div>
                <span class="text-gray-500">Initial Investment:</span>
                <p class="font-medium">{{ formattedInitialInvestment }}</p>
              </div>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-2 mt-2">
            <button
              type="button"
              @click="navigateBack"
              class="cursor-pointer px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>

            <GradientButton
              type="submit"
              class="px-6 py-2 flex items-center gap-2 cursor-pointer rounded-md"
            >
              <Save class="w-5 h-5" />
              <span>{{ isEditing ? "Save Changes" : "Create Portfolio" }}</span>
            </GradientButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import GradientButton from "../../components/GradientButton.vue";
import { ArrowLeft, Save } from "lucide-vue-next";
import {
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
  Transition,
} from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/24/solid";
import Badge from "../../components/Badge.vue";

const router = useRouter();
const route = useRoute();
const store = useStore();

/* -------------------- Form Data -------------------- */
const formData = reactive({
  id: "",
  name: "",
  clientId: "",
  status: "",
  initialInvestment: 0,
  description: "",
});

const errors = reactive({
  name: "",
  clientId: "",
  status: "",
  initialInvestment: "",
});

/* -------------------- Clients -------------------- */
type ClientRaw = Record<string, any>;
type ClientItem = { id: string; name: string; amount: string; raw: ClientRaw };
const clients = ref<ClientItem[]>([]);

const loadClients = () => {
  const saved = JSON.parse(localStorage.getItem("clients") || "[]") as ClientRaw[];
  if (saved && saved.length) {
    clients.value = saved.map((c: ClientRaw) => {
      const name = c.fullName || c.name || c.displayName || "Unnamed";

      let rawValue =
        c.totalPortfolioValue ??
        c.initialInvestment ??
        c.portfolioValue ??
        0;
      let value = isNaN(Number(rawValue)) ? 0 : Number(rawValue);

      return {
        id: String(c.id ?? c.clientId ?? Date.now()),
        name,
        amount: value.toLocaleString("en-IN"),
        raw: c,
      };
    });
  }
};


const selectClient = (c: ClientItem) => {
  formData.clientId = c.id;
  errors.clientId = "";
};

const selectedClientDisplay = computed(() => {
  const client = clients.value.find((c) => c.id === formData.clientId);
  return client ? `${client.name} - ₹${client.amount}` : "";
});

const selectedClientName = computed(() => {
  const client = clients.value.find((c) => c.id === formData.clientId);
  return client ? client.name : "";
});

/* -------------------- Status -------------------- */
const statusOptions = ["ACTIVE", "UPCOMING", "CLOSED"];
const statusColors: Record<string, string> = {
  ACTIVE: "green",
  UPCOMING: "yellow",
  CLOSED: "gray",
};

const selectStatus = (s: string) => {
  formData.status = s;
  errors.status = "";
};

/* -------------------- Computed -------------------- */
const formattedInitialInvestment = computed(() =>
  formData.initialInvestment
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(Number(formData.initialInvestment))
    : "Not specified"
);

const isEditing = computed(() => !!formData.id);

/* -------------------- Lifecycle -------------------- */
onMounted(() => {
  loadClients();
});

const navigateBack = () => router.push("/portfolios");

/* -------------------- Validation & Submit -------------------- */
const validate = () => {
  errors.name = formData.name ? "" : "Portfolio name is required";
  errors.clientId = formData.clientId ? "" : "Client is required";
  errors.status = formData.status ? "" : "Status is required";
  errors.initialInvestment =
    formData.initialInvestment > 0 ? "" : "Initial investment is required";

  return !errors.name && !errors.clientId && !errors.status && !errors.initialInvestment;
};

const handleSubmit = () => {
  if (!validate()) return;

  const saved = JSON.parse(localStorage.getItem("portfolios") || "[]");
  const payload = {
    id: formData.id || String(Date.now()),
    name: formData.name,
    clientId: formData.clientId,
    clientName: selectedClientName.value,
    status: formData.status,
    initialInvestment: Number(formData.initialInvestment),
    description: formData.description,
    createdAt: new Date().toISOString(),
  };

  if (isEditing.value) {
    const idx = saved.findIndex((p: any) => p.id === formData.id);
    if (idx !== -1) saved[idx] = { ...saved[idx], ...payload };
  } else {
    saved.push(payload);
  }

  localStorage.setItem("portfolios", JSON.stringify(saved));
  router.push("/portfolios");
};
</script>

<style scoped>
input:focus,
select:focus,
textarea:focus,
button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}
</style>
