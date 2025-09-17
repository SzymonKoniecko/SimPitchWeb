<script setup>
import { onMounted } from "vue";
import { useSportsDataStore } from "@/stores/SportsDataStore";

const store = useSportsDataStore();

onMounted(() => {
  store.loadLeagues();
});
</script>

<template>
  <header class="bg-blue-900 text-white p-4">
    <h1 class="text-2xl font-bold">⚽ Football App</h1>
    <nav v-if="store.leagues.leagues?.length" class="mt-2">
      <ul class="flex gap-4">
        <li v-for="league in store.leagues.leagues" :key="league.id">
          <RouterLink :to="`/league/${league.id}`" class="hover:underline">
            {{ league.name }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>
