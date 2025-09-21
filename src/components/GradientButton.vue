<template>
  <button
    class="gradient-button px-6 py-3 rounded-full font-bold text-white"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup></script>

<style scoped>
.gradient-button {
  background: linear-gradient(270deg, #7b5cf5, #ec4899); /* Purple-to-pink gradient like tab */
  background-size: 600% 600%;
  transition: background-position 0.5s ease;
}
.gradient-button:hover {
  background-position: 100% 0;
}
</style>
