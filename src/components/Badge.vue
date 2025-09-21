<template>
  <span
    :class="[
      'px-2 py-1 text-xs font-medium rounded-md',
      risk === 'Moderate'
        ? 'bg-green-100 text-green-700'
        : risk === 'Aggressive'
        ? 'bg-red-100 text-red-700'
        : 'bg-gray-100 text-gray-700'
    ]"
  >
    {{ risk }}
  </span>
</template>

<script setup>
defineProps({
  risk: {
    type: String,
    required: true,
  },
});
</script>
