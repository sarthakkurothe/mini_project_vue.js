<template>
  <nav class="bg-white shadow px-6 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Brand -->
      <div class="flex items-center gap-3">
        <ChartNoAxesCombined class="w-10 h-10 text-purple-600" />
        <h1 class="text-lg font-semibold">Investment Portfolio</h1>
      </div>

      <!-- Tabs -->
      <ul
        class="flex gap-2 items-center"
        role="tablist"
        aria-label="Main navigation"
        @keydown.prevent="onKeydown"
      >
        <li v-for="(tab, i) in tabs" :key="tab.to" class="list-none">
          <button
            :ref="el => (tabRefs[i] = el)"
            role="tab"
            :aria-selected="isActive(tab) ? 'true' : 'false'"
            :aria-current="isActive(tab) ? 'page' : undefined"
            @click="go(tab.to)"
            class="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition"
            :class="isActive(tab)
              ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-md'
              : 'bg-transparent text-gray-700 hover:bg-gray-100'"
            :title="tab.title"
          >
            <component v-if="tab.icon" :is="tab.icon" class="w-4 h-4" aria-hidden="true" />
            <span>{{ tab.title }}</span>
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ChartNoAxesCombined, Home, Users, Package } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();

const tabs = [
  { title: 'Dashboard', to: '/', icon: Home },
  { title: 'Clients', to: '/users', icon: Users },
  { title: 'Portfolios', to: '/portfolios', icon: Package },
];

const tabRefs = ref([]);

const go = (to) => {
  if (route.path !== to) router.push(to).catch(() => {});
};

const isActive = (tab) => route.path === tab.to || route.path.startsWith(tab.to + '/');

const onKeydown = (e) => {
  const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
  if (!keys.includes(e.key)) return;

  const enabled = tabRefs.value.filter(Boolean);
  if (!enabled.length) return;

  const activeIndex = enabled.findIndex(el => el === document.activeElement);
  let nextIndex = activeIndex;

  if (e.key === 'ArrowRight') nextIndex = activeIndex < enabled.length - 1 ? activeIndex + 1 : 0;
  else if (e.key === 'ArrowLeft') nextIndex = activeIndex > 0 ? activeIndex - 1 : enabled.length - 1;
  else if (e.key === 'Home') nextIndex = 0;
  else if (e.key === 'End') nextIndex = enabled.length - 1;

  enabled[nextIndex].focus();
};
</script>

<style scoped>
button[role="tab"]:focus {
  outline: 3px solid rgba(99, 102, 241, 0.15);
  outline-offset: 3px;
}
</style>
