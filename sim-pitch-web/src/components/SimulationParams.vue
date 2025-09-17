<template>
  <section class="bg-gray-800 rounded-2xl p-4 flex-1 shadow-md">
    <h2 class="text-xl font-semibold mb-2">Parametry symulacji</h2>

    <label class="block mt-2">Liczba rund: {{ rounds }}</label>
    <input type="range" v-model="rounds" min="1" max="4" class="w-full">

    <label class="block mt-2">Przewaga gospodarza: {{ homeAdvantage }}</label>
    <input type="range" v-model="homeAdvantage" min="0" max="3" step="0.1" class="w-full">

    <label class="block mt-2">Losowość: {{ randomness }}</label>
    <input type="range" v-model="randomness" min="0" max="1" step="0.1" class="w-full">

    <button
      @click="$emit('start')"
      class="mt-4 w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 px-4 rounded-lg transition">
      Rozpocznij Symulację
    </button>
  </section>
</template>

<script setup>
defineProps({
  rounds: Number,
  homeAdvantage: Number,
  randomness: Number
});

defineEmits(["update:rounds", "update:homeAdvantage", "update:randomness", "start"]);
</script>
