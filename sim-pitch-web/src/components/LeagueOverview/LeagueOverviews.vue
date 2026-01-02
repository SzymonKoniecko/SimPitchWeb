<template>
  <div>
    <div v-if="loading" class="info">Loading..., please wait…</div>
    <ErrorEndpoint v-else-if="error" :error="error" />
  </div>
  <section>
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
    <hr />
    <div v-if="oldSeasonsForConferenceLeague" class="info-notice">
      <span>Conference league has data since 2024/2025</span>
    </div>
    <div v-else>
      <div
        v-if="selectedSeason && selectedSeason !== CURRENT_SEASON"
        class="info-notice"
      >
        ℹ️ These matches have already been played. Only final season stats are
        available.
        <div v-if="scoreboardState.loading" class="info">
          Loading scoreboard..., please wait…
        </div>
        <ErrorEndpoint
          v-else-if="scoreboardState.error"
          :error="scoreboardState.error"
        />
      </div>
      <details open class="chart-details" v-if="scoreboardState.data">
        <summary class="chart-summary">
          <div class="chart-summary-content">
            <span class="chart-summary-title">-> Scoreboard</span>
          </div>
        </summary>
        <ScoreboardItem
          v-if="scoreboardState.data && !scoreboardState.loading"
          variant="complete_details"
          :teams="teams"
          :scoreboard="scoreboardState.data"
          :simulation-team-stats="null"
        />
      </details>
      <hr/>
      <div v-if="selectedSeason === CURRENT_SEASON && selectedleague">
        <div v-if="store.loading" class="info">Loading rounds...</div>
        <MatchResultItemList
          v-else
          :simulated-match-rounds="[]"
          :teams="teams"
          :team-strengths="[]"
          :league-rounds="leagueRounds"
          :only-played-matches="false"
          :is-league-overview="true"
        />
      </div>
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
import { fetchData, type ApiState } from "../../api/fetchData";
import type { Scoreboard } from "../../models/Scoreboards/scoreboard";
import { engineAPI } from "../../api/engine.api";
import ScoreboardItem from "../Iteration/ScoreboardItem.vue";

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
const oldSeasonsForConferenceLeague = computed(() => {
  if (
    GetLeagueNameById(selectedleague.value) === "UEFA Conference League" &&
    (selectedSeason.value === "2023/2024" ||
      selectedSeason.value === "2022/2023")
  ) {
    return true;
  }
  return false;
});
const scoreboardState = ref<ApiState<Scoreboard>>({
  loading: false,
  error: null,
  data: null,
});
const loadScoreboard = async () => {
  if (!selectedleague.value || !selectedSeason.value) return;

  scoreboardState.value.loading = true;
  scoreboardState.value = await fetchData<Scoreboard>(() =>
    engineAPI.ScoreboardController.getScoreboardByLeagueIdAndSeasonYear(
      selectedleague.value,
      selectedSeason.value
    )
  );
};
const GetLeagueNameById = (Id?: string) => {
  if (Id === undefined) {
    return "";
  }
  return leagues.value.find((x) => x.id === Id)?.name;
};
onMounted(async () => {
  if (!leagues.value || leagues.value.length === 0) {
    await store.loadLeagues();
  }
  if (!teams.value || teams.value.length === 0) {
    await store.loadTeams();
  }
});

watch(
  () => ({ season: selectedSeason.value, league: selectedleague.value }),
  async ({ season, league }) => {
    if (!season || !league) return;
    
    scoreboardState.value.data = null;
    scoreboardState.value.error = null;
    
    if (season === CURRENT_SEASON) {
      await store.loadLeagueRounds(season, league);
    }
    
    await loadScoreboard();
  },
  { deep: true } 
);
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
  background: linear-gradient(
    135deg,
    var(--color-surface-sections) 0%,
    var(--color-surface) 100%
  );
  border: 1px solid var(--color-grid);
  border-left: 4px solid var(--color-accent-yellow);
  color: var(--color-text-secondary);
  padding: 1rem 1.25rem;
  border-radius: 6px;
  margin: 1rem 0;
  font-size: 0.95rem;
  display: block;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.info-notice:hover {
  border-color: var(--color-accent-yellow);
  background: linear-gradient(
    135deg,
    var(--color-surface) 0%,
    var(--color-surface-sections) 100%
  );
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
