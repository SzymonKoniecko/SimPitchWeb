<template>
  <section class="team">
    <h1>Team {{ id }}</h1>
    <p v-if="loading">Loading team...</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <div v-else>
      <p><strong>Name:</strong> {{ team?.name ?? 'Unknown' }}</p>
      <p><strong>League:</strong> {{ team?.league?.name ?? 'N/A' }}</p>
    </div>
    <TeamCard :id="props.id" variant="mini"/>
    <TeamCard :id="props.id" variant="large"/>
  </section>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from "vue";
import { useSportsDataStore } from "../stores/SportsDataStore";
import TeamCard from "./TeamCard.vue";
type Props = {
  id: string; // from /team/:id via props: true
};

const props = defineProps<Props>();

const store = useSportsDataStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);
const team = computed(() => store.teams.find((t: { id: string; }) => t.id === props.id));

const ensureData = async () => {
  if (store.leagues.length === 0) {
    await store.loadLeagues();
  }
  if (store.teams.length === 0) {
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
  }
);
</script>

<style scoped>
.team { padding: 1rem; }
.error { color: #b00020; }
</style>
