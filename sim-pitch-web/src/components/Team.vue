<template>
  <section class="team">
    <h1>Team {{ id }}</h1>
    <div v-if="loading">⏳ Loading...</div>
    <div v-else-if="error">❌ {{ error }}</div>
    <div v-else-if="team">
      <p><strong>Name:</strong> {{ team?.name ?? 'Unknown' }}</p>
      <p><strong>League:</strong> {{ team?.league?.name ?? 'N/A' }}</p>
    </div>
    <div v-else>
      ⚠️ Team not found.
    </div>
    <TeamCard :id="props.id" variant="mini"/>
    <TeamCard :id="props.id" variant="large"/>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: "Team" });

import { onMounted, watch, computed } from "vue";
import { useSportsDataStore } from "../stores/SportsDataStore";
import TeamCard from "./TeamCard.vue";

type Props = {
  id: string; // /team/:id (via props: true)
};
const props = defineProps<Props>();

const store = useSportsDataStore();

const loading = computed(() => store.loading);
const error = computed(() => store.error);
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);
const team = computed(() => teams.value?.find(t => t.id === props.id));

const ensureData = async () => {
  if (!leagues.value || leagues.value.length === 0) {
    await store.loadLeagues();
  }
  if (!teams.value || teams.value.length === 0) {
    await store.loadTeams();
  }
};

onMounted(async () => {
  await ensureData();
});

watch(
  () => props.id,
  async () => {
    await ensureData();
  },
  { immediate: false }
);
</script>

<style scoped>
.team { padding: 1rem; }
.error { color: #b00020; }
</style>
