<template>
  <div class="min-h-screen bg-gray-50 text-gray-900">
    <Navbar />
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue';
</script>
