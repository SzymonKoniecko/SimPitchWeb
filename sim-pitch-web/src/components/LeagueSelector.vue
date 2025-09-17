<template>
  <section class="bg-gray-800 rounded-2xl p-4 flex-1 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Wybierz ligę</h2>
    <select v-model="modelValue" class="w-full p-2 rounded bg-gray-700">
      <option disabled value="">-- wybierz ligę --</option>
      <option v-for="league in leagues" :key="league.id" :value="league">
        {{ league.name }} ({{ league.country }})
      </option>
    </select>

    <div v-if="modelValue" class="mt-4">
      <h3 class="text-lg font-semibold">Sezon: {{ modelValue.season }}</h3>
      <ul class="list-disc pl-4 mt-2">
        <li v-for="team in modelValue.teams" :key="team">{{ team }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
defineProps({
  leagues: Array,
  modelValue: Object
});

defineEmits(["update:modelValue"]);
</script>
