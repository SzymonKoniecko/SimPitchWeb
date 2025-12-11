<template>
  <div class="match-list-container">
    <!-- Sekcja filtrów -->
    <div class="filter-controls">
      <button 
        @click="changeFilter('simulated')" 
        class="filter-btn"
        :class="{ active: filterMode === 'simulated' }"
        :disabled="isLoading"
      >
        Simulated
      </button>
      
      <button 
        @click="changeFilter('official')" 
        class="filter-btn"
        :class="{ active: filterMode === 'official' }"
        :disabled="isLoading"
      >
        Official Results
      </button>
      
      <button 
        @click="changeFilter('all')" 
        class="filter-btn btn-all"
        :class="{ active: filterMode === 'all' }"
        :disabled="isLoading"
      >
        <span v-if="isLoading && filterMode === 'all'" class="mini-loader"></span>
        <span v-else>All</span>
      </button>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="main-spinner"></div>
      <p>Processing data...</p>
    </div>

    <div v-else>
      <div v-for="roundData in allRoundsEntries" :key="roundData.roundNumber">
        <MatchResultItemRound
          v-if="shouldRenderRound(roundData)"
          :round-data="roundData"
          :teams="teams"
          :team-strengths="teamStrengths"
          :league-rounds="leagueRounds"
          :only-played-matches="onlyPlayedMatches"
        />
      </div>
    </div>
    
    <hr />
  </div>
</template>

<script setup lang="ts">
import MatchResultItemRound from "./MatchResultItemRound.vue";
import { computed, onMounted, watch, ref, nextTick } from "vue";
import type { MatchRound } from "../../models/SportsDataModels/matchRound";
import type { Team } from "../../models/SportsDataModels/team";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import type { LeagueRound } from "../../models/SportsDataModels/leagueRound";
import { useSportsDataStore } from "../../stores/SportsDataStore";
import type { RoundData } from "../../models/Iterations/roundData";

defineOptions({ name: "MatchResultItemList" });

type Props = {
  simulatedMatchRounds: MatchRound[];
  teams: Team[];
  teamStrengths: TeamStrength[];
  leagueRounds: LeagueRound[];
  onlyPlayedMatches: boolean;
};

type FilterMode = 'all' | 'simulated' | 'official';

const props = defineProps<Props>();
// Definiujemy zdarzenie, które przekaże tryb do rodzica
const emit = defineEmits<{
  (e: 'filter-change', mode: FilterMode): void
}>();

const store = useSportsDataStore();
const filterMode = ref<FilterMode>('all');
const isLoading = ref(false);

function shouldRenderRound(roundData: RoundData): boolean {
  if (filterMode.value === 'simulated') return roundData.simulatedMatches.length > 0;
  if (filterMode.value === 'official') return roundData.realMatches.length > 0;
  return roundData.simulatedMatches.length > 0 || roundData.realMatches.length > 0;
}

const changeFilter = async (mode: FilterMode) => {
  if (filterMode.value === mode) return;
  
  isLoading.value = true;
  filterMode.value = mode;
  
  emit('filter-change', mode);
  
  await nextTick();
  setTimeout(() => {
    isLoading.value = false;
  }, 100);
};

const teamStrengths = computed(() => props.teamStrengths);
const teams = computed(() => props.teams);
const leagueRounds = computed(() => props.leagueRounds);

function getLeagueRoundNumber(roundId: string): number {
  if (!roundId) return 0;
  return leagueRounds.value.find((t) => t.id === roundId)?.round ?? 0;
}

const allRoundsEntries = computed<RoundData[]>(() => {
  if (isLoading.value) return [];

  const mergedRounds: Record<number, RoundData> = {};

  for (const match of props.simulatedMatchRounds) {
    if (!match.roundId) continue;
    const roundNum = getLeagueRoundNumber(match.roundId);

    if (!mergedRounds[roundNum]) {
      mergedRounds[roundNum] = {
        roundNumber: roundNum,
        roundId: match.roundId,
        simulatedMatches: [],
        realMatches: [],
      };
    }
    mergedRounds[roundNum].simulatedMatches.push(match);
  }

  const simulatedMatchIds = new Set(props.simulatedMatchRounds.map((m) => m.id));

  if (store.matchRounds) {
    for (const match of store.matchRounds) {
      if (match.roundId && !simulatedMatchIds.has(match.id)) {
        const shouldIncludeMatch = props.onlyPlayedMatches ? match.isPlayed === true : true;
        if (shouldIncludeMatch) {
          const roundNum = getLeagueRoundNumber(match.roundId);
          if (!mergedRounds[roundNum]) {
            mergedRounds[roundNum] = {
              roundNumber: roundNum,
              roundId: match.roundId,
              simulatedMatches: [],
              realMatches: [],
            };
          }
          mergedRounds[roundNum].realMatches.push(match);
        }
      }
    }
  }

  let result = Object.values(mergedRounds);

  if (filterMode.value === 'simulated') {
    result.forEach(r => r.realMatches = []);
  } else if (filterMode.value === 'official') {
    result.forEach(r => r.simulatedMatches = []);
  }

  return result.sort((a, b) => a.roundNumber - b.roundNumber);
});

const ensureData = async () => {
  const firstRound = props.leagueRounds?.[0];
  if (!firstRound || !firstRound.leagueId) return;
  isLoading.value = true;
  await store.loadMatchRounds(firstRound.leagueId);
  isLoading.value = false;
};

onMounted(async () => {
  await ensureData();
});

watch(() => props.leagueRounds, async () => {
  await ensureData();
});
</script>

<style scoped>
.filter-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
  justify-content: center;
  align-items: center;
}

.filter-btn {
  padding: 8px 20px;
  min-width: 120px;
  background-color: var(--color-surface-sections);
  border: 1px solid var(--color-grid);
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s ease;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
}

.filter-btn:hover:not(.active) {
  background-color: var(--color-surface-contrast);
  color: var(--color-text-main);
  border-color: var(--color-border);
}

.filter-btn.active {
  background-color: var(--color-accent-blue);
  color: #ffffff;
  border-color: var(--color-accent-blue);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.filter-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.mini-loader {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-bottom-color: #ffffff;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}

.loading-overlay {
  text-align: center;
  padding: 40px;
  color: var(--color-text-secondary);
}

.main-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-surface-sections);
  border-top: 4px solid var(--color-accent-blue);
  border-radius: 50%;
  margin: 0 auto 10px;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
