<template>
  <div v-if="loading" class="loader-container">
    <div class="loader"></div>
    <p>Loading team details...</p>
  </div>

  <ErrorEndpoint v-else-if="error" :error="error" />

  <section v-else-if="team" class="team-details">
    <div class="team-header">
      <div class="logo-wrapper">
        <img
          :src="getLogo(team?.shortName)"
          :alt="team.name"
          class="team-logo"
        />
      </div>
      <div class="team-title">
        <span class="team-subtitle"
          >{{ team.country?.name }} ({{ team.country?.code }})</span
        >
        <h1>
          {{ team.name }}
          <span class="short-code">[{{ team.shortName }}]</span>
        </h1>
        <div class="league-badge">
          {{ team.league?.name ?? "Unknown League" }}
        </div>
      </div>
    </div>

    <hr />

    <div class="info-grid">
      <div class="info-card">
        <h4>🏟️ Stadium</h4>
        <p class="info-value">{{ team.stadium?.name ?? "Unknown" }}</p>
        <p class="info-sub">
          Capacity:
          <strong>{{
            team.stadium?.capacity?.toLocaleString() ?? "N/A"
          }}</strong>
          seats
        </p>
      </div>

      <div class="info-card">
        <h4>🏆 League Details</h4>
        <p class="info-value">{{ team.league?.name }}</p>
        <p class="info-sub" v-if="team.league?.maxRound">
          Max Rounds: {{ team.league.maxRound }}
        </p>
      </div>
      <div class="info-card" v-if="team.league?.strengths?.length">
        <h4>📊 Part of league Strength</h4>
        <div class="info-card" v-for="obj in team.league?.strengths">
          <p class="info-value">{{ GetLeagueName(obj.leagueId) }}</p>
          <p class="info-value">{{ obj.strength.toFixed(2) }}</p>
          <p class="info-sub">Avg goals per match</p>
        </div>
      </div>
    </div>

    <footer>
      <router-link to="/leagues" role="button" class="button-secondary">
        ← Back to Leagues
      </router-link>
    </footer>
  </section>

  <div v-else class="endpoint-error">⚠️ Team not found.</div>
</template>

<script setup lang="ts">
defineOptions({ name: "Team" });

import { onMounted, watch, computed } from "vue";
import { useSportsDataStore } from "../../stores/SportsDataStore";
import ErrorEndpoint from "../Other/ErrorEndpoint.vue";
import { getLogo } from "../../utils/logos";

type Props = {
  id: string; // /team/:id (via props: true)
};
const props = defineProps<Props>();

const store = useSportsDataStore();

const loading = computed(() => store.loading);
const error = computed(() => store.error);
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);
const team = computed(() => teams.value?.find((t) => t.id === props.id));

const ensureData = async () => {
  if (!leagues.value || leagues.value.length === 0) {
    await store.loadLeagues();
  }
  if (!teams.value || teams.value.length === 0) {
    await store.loadTeams();
  }
};
function GetLeagueName(id?: string): string {
  return leagues.value.find((x) => x.id === id)?.name ?? "Unknown league";
}
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
.team-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Header Styling */
.team-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.logo-wrapper {
  flex-shrink: 0;
  background-color: var(--color-surface-sections);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--color-grid);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.team-logo {
  width: 100px;
  height: 100px;
  object-fit: contain;
}

.team-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.team-title h1 {
  font-size: 2.5rem;
  margin: 0;
  line-height: 1.1;
  background: linear-gradient(
    135deg,
    var(--color-text-main) 0%,
    var(--color-text-secondary) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.short-code {
  font-size: 1.2rem;
  color: var(--color-accent-yellow);
  font-weight: normal;
  vertical-align: middle;
}

.team-subtitle {
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 1px;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.league-badge {
  display: inline-block;
  background-color: var(--color-accent-blue);
  color: #fff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  align-self: flex-start;
  margin-top: 0.5rem;
  box-shadow: 0 2px 4px var(--color-shadow-button);
}

/* Info Grid Styling (reusing global .info-grid concepts) */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background-color: var(--color-surface-sections);
  border: 1px solid var(--color-grid);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.info-card:hover {
  transform: translateY(-4px);
  border-color: var(--color-accent-blue);
  box-shadow: 0 4px 12px var(--color-shadow-app);
}

.info-card h4 {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--color-text-main);
  margin: 0;
}

.info-sub {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

/* Loader */
.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .team-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .league-badge {
    align-self: center;
  }

  .team-title h1 {
    font-size: 2rem;
  }
}
</style>
