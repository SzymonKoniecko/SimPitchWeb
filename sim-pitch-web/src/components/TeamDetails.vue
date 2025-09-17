<script setup>
import { onMounted, computed } from "vue";
import { useSportsDataStore } from "@/stores/SportsDataStore";
import { useRoute, useRouter } from "vue-router";

const store = useSportsDataStore();
const route = useRoute();
const router = useRouter();

onMounted(() => {
  if (!store.teams.teams?.length) {
    store.loadTeams();
  }
});

const team = computed(() =>
  store.teams.teams?.find((t) => t.id === route.params.id)
);
</script>

<template>
  <div class="p-6">
    <button
      class="mb-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      @click="router.back()"
    >
      ← Wróć
    </button>

    <div v-if="store.loading">Ładowanie drużyny...</div>
    <div v-else-if="!team">Nie znaleziono drużyny.</div>
    <div v-else class="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6">
      <div class="flex items-center gap-4">
        <img
          :src="team.logo_url"
          :alt="team.name"
          class="w-20 h-20 object-contain"
        />
        <div>
          <h2 class="text-2xl font-bold">{{ team.name }}</h2>
          <p class="text-gray-600">Skrót: {{ team.short_name }}</p>
        </div>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold text-lg">Stadion</h3>
        <p>{{ team.stadium.name }} (pojemność: {{ team.stadium.capacity }})</p>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold text-lg">Liga</h3>
        <RouterLink
          :to="`/league/${team.league.id}`"
          class="text-blue-600 hover:underline"
        >
          {{ team.league.name }}
        </RouterLink>
      </div>

      <div class="mt-6">
        <h3 class="font-semibold text-lg">Kraj</h3>
        <p>{{ team.country.name }} ({{ team.country.code }})</p>
      </div>
    </div>
  </div>
</template>
