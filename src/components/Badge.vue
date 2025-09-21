<template>
  <span
    :class="[
      'px-2 py-1 text-xs font-medium rounded-md',
      risk === 'Moderate'
        ? 'bg-green-100 text-green-700'
        : risk === 'Aggressive'
        ? 'bg-red-100 text-red-700'
        : risk === 'Conservative'
        ? 'bg-blue-100 text-blue-700'
        : '',
      !risk && type === 'green'
        ? 'bg-green-100 text-green-700'
        : !risk && type === 'yellow'
        ? 'bg-yellow-100 text-yellow-700'
        : !risk && type === 'gray'
        ? 'bg-gray-100 text-gray-700'
        : !risk
        ? 'bg-gray-200 text-gray-600'
        : ''
    ]"
  >
    {{ risk || label }}
  </span>
</template>

<script setup>
defineProps({
  risk: { type: String, default: "" },   
  label: { type: String, default: "" },  
  type: { type: String, default: "gray" }
});
</script>
