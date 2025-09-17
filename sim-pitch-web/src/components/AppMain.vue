<script setup>
import { onMounted, computed } from "vue";
import { useSportsDataStore } from "@/stores/SportsDataStore";
import { useRoute } from "vue-router";

const store = useSportsDataStore();
const route = useRoute();

onMounted(() => {
  store.loadTeams();
});

// computed: jeśli jest leagueId w URL → filtrujemy drużyny
const filteredTeams = computed(() => {
  if (!store.teams.teams) return [];
  if (!route.params.id) return store.teams.teams;

  return store.teams.teams.filter(
    (team) => team.league.id === route.params.id
  );
});
</script>

<template>
  <main class="p-6">
    <h2 class="text-xl font-semibold mb-4">
      {{ route.params.id ? "Drużyny w lidze" : "Wszystkie drużyny" }}
    </h2>

    <div v-if="store.loading" class="text-gray-600">Ładowanie danych...</div>
    <div v-else-if="store.error" class="text-red-600">
      Błąd: {{ store.error }}
    </div>

    <ul v-else class="grid grid-cols-2 gap-4">
      <li
        v-for="team in filteredTeams"
        :key="team.id"
        class="border rounded-lg p-4 shadow-md hover:bg-gray-50"
      >
        <RouterLink
          :to="`/team/${team.id}`"
          class="flex items-center gap-3 block"
        >
          <img
            :src="team.logo_url"
            :alt="team.name"
            class="w-12 h-12 object-contain"
          />
          <div>
            <p class="font-bold">{{ team.name }}</p>
            <p class="text-sm text-gray-600">
              Stadion: {{ team.stadium.name }} ({{ team.stadium.capacity }})
            </p>
          </div>
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style scoped>
</style>
