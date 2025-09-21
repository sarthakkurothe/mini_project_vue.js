<template>
  <div class="w-full">

    <!-- Tabs full width -->
    <div class="flex w-full h-10 items-center justify-between rounded-md bg-gray-100 p-1 text-gray-500">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        @click="$emit('update:activeTab', tab.value)"
        class="flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
          disabled:pointer-events-none disabled:opacity-50"
        :class="activeTab === tab.value
          ? 'bg-white text-gray-900 shadow-sm'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'"
      >
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  activeTab: {
    type: String,
    required: true,
  },
});

defineEmits(["update:activeTab"]);

const searchQuery = ref("");

const tabs = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "upcoming", label: "Upcoming" },
  { value: "closed", label: "Closed" },
];
</script>
