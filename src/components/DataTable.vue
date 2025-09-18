<template>
  <table class="w-full border-collapse bg-white shadow rounded-lg">
    <thead>
      <tr class="bg-gray-100">
        <th v-for="col in columns" :key="col" class="p-3 text-left font-semibold text-gray-700">{{ col }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="row in rows" :key="row.ID" class="border-b hover:bg-gray-50">
        <td v-for="col in columns" :key="col" class="p-3">{{ row[col] }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  columns: Array,
  rows: Array,
})
</script>
