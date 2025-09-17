<script setup>
import { useSportsDataStore } from "@/stores/SportsDataStore";

const store = useSportsDataStore();
</script>

<template>
  <footer class="bg-gray-800 text-white text-center p-4 mt-6">
    <p>© 2025 Football App</p>
    <p v-if="store.teams.teams">Liczba drużyn: {{ store.teams.teams.length }}</p>
  </footer>
</template>
