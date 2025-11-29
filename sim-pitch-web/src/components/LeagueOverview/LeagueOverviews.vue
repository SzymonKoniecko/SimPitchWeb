<template>
  <div>
    <div v-if="loading" class="info">Loading..., please wait…</div>
    <ErrorEndpoint v-else-if="error" :error="error" />
  </div>
  <section>
    <div class="field">
      <label for="leagueId">Choose league</label>
      <select
        id="leagueId"
        v-model="selectedleague"
        selenium-id="league-select"
        name="league"
      >
        <option value="" disabled>Select a league</option>
        <option
          v-for="league in leagues"
          :key="league.id"
          :value="league.id"
          :selenium-id="`${league.name.replace(/\s+/g, '-').toLowerCase()}`"
        >
          {{ league.name }}
        </option>
      </select>
    </div>
    <div class="field">
      <label for="season">Choose season</label>
      <select
        id="season"
        v-model="selectedSeason"
        selenium-id="season-select"
        name="season"
      >
        <option value="" disabled>Select a season</option>
        <option
          v-for="season in seasonYearsOptions"
          :key="season"
          :value="season"
          :selenium-id="`${season}`"
        >
          <span v-if="season === CURRENT_SEASON">
            {{ season }} (Current season)
          </span>
          <span v-else>
            {{ season }}
          </span>
        </option>
      </select>
    </div>
    <div v-if="selectedSeason && selectedSeason !== CURRENT_SEASON" class="info-notice">
      ℹ️ These matches have already been played. Only final season stats are available.
    </div>
    <div v-if="leagueRounds[0]?.leagueId === selectedleague && selectedSeason">
      <MatchResultItemList
        :simulated-match-rounds="[]"
        :teams="teams"
        :team-strengths="[]"
        :league-rounds="leagueRounds"
        :only-played-matches="false"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useSportsDataStore } from "../../stores/SportsDataStore";
import {
  CURRENT_SEASON,
  seasonYearsOptions,
} from "../../models/Consts/seasonYear";
import ErrorEndpoint from "../Other/ErrorEndpoint.vue";
import MatchResultItemList from "./MatchResultItemList.vue";


const store = useSportsDataStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);


const teams = computed(() => store.teams);
const leagues = computed(() => store.leagues);
const selectedleague = ref<string>("");
const selectedSeason = ref<string>(CURRENT_SEASON);
const leagueRounds = computed(() =>
  store.leagueRounds.filter((x) => x.leagueId === selectedleague.value)
);


const ensureData = async () => {
  if (!leagues.value || leagues.value.length === 0) {
    await store.loadLeagues();
  }
  if (!teams.value || teams.value.length === 0) {
    await store.loadTeams();
  }
  if (selectedleague.value && selectedSeason.value !== CURRENT_SEASON) {
    await store.loadLeagueRounds(selectedSeason.value, selectedleague.value);
  }
  else {
    await store.loadLeagueRounds(selectedSeason.value, selectedleague.value);
  }
};


onMounted(async () => {
  await ensureData();
});


watch([selectedleague, selectedSeason], async () => {
  await ensureData();
});
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.field label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-main);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.field select {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  background-color: var(--color-surface);
  color: var(--color-text-main);
  border: 1px solid var(--color-grid);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23f3f4f6' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 16px;
  padding-right: 2.5rem;
}

.field select:hover {
  border-color: var(--color-accent-blue);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.field select:focus {
  outline: none;
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px var(--color-focus-outline);
}

.field select option {
  background-color: var(--color-surface);
  color: var(--color-text-main);
  padding: 0.5rem;
}

.info-notice {
  background: linear-gradient(135deg, 
    var(--color-surface-sections) 0%, 
    var(--color-surface) 100%);
  border: 1px solid var(--color-grid);
  border-left: 4px solid var(--color-accent-yellow);
  color: var(--color-text-secondary);
  padding: 1rem 1.25rem;
  border-radius: 6px;
  margin: 1rem 0;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.info-notice:hover {
  border-color: var(--color-accent-yellow);
  background: linear-gradient(135deg, 
    var(--color-surface) 0%, 
    var(--color-surface-sections) 100%);
  box-shadow: 0 2px 8px rgba(251, 191, 36, 0.1);
}

section {
  display: grid;
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .field {
    margin-bottom: 1rem;
  }

  .field select {
    padding: 0.6rem 0.75rem;
    font-size: 0.9rem;
  }

  .info-notice {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
