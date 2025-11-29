<template>
  <div>
    <div v-if="loading" class="info">
      Loading..., please wait…
    </div>
    <ErrorEndpoint
      v-else-if="error"
      :error="error"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useSportsDataStore } from "../../stores/SportsDataStore";

const store = useSportsDataStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const selectedleague = ref('');
const selectedSeason = ref('');
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);



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
  [selectedleague, selectedSeason],
  async () => {
    await ensureData();
  },
);
</script>
<style scoped></style>
