<template>
  <div
    v-for="[roundId, matchRounds] in simulatedMatchRoundsEntries"
    :key="roundId"
  >
    <details class="custom-chart-details" close :id="`round:${roundId}`">
      <summary class="custom-chart-summary">
        <div class="summary-content">
          <span class="summary-title">{{ getTitle(roundId) }}</span>
          <span class="summary-subtitle">
            {{ getSubTitle(matchRounds.length, roundId) }}</span
          >
        </div>
      </summary>
      <div v-for="matchRound in matchRounds" :key="matchRound.id">
        <MatchResultItem
          :match-round="matchRound"
          :teams="teams"
          :home-team-strength="
            getTeamStrength(matchRound.homeTeamId, matchRound.roundId)
          "
          :away-team-strength="
            getTeamStrength(matchRound.awayTeamId, matchRound.roundId)
          "
        />
      </div>
    </details>
  </div>
  <hr />
</template>

<script setup lang="ts">
import MatchResultItem from "./MatchResultItem.vue";
import { computed, onMounted, watch } from "vue";
import type { MatchRound } from "../../models/SportsDataModels/matchRound";
import type { Team } from "../../models/SportsDataModels/team";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import type { LeagueRound } from "../../models/SportsDataModels/leagueRound";
import { MapNumberToTextUpper } from "../../models/Consts/textHelper";
import { useSportsDataStore } from "../../stores/SportsDataStore";

defineOptions({ name: "MatchResultItemList" });

type Props = {
  simulatedMatchRounds: MatchRound[];
  teams: Team[];
  teamStrengths: TeamStrength[];
  leagueRounds: LeagueRound[];
};

const props = defineProps<Props>();
const store = useSportsDataStore();

// --- COMPUTED ---
const simulatedMatchRoundsEntries = computed(() => {
  const simMatchRounds = props.simulatedMatchRounds;
  const groupedByRounds: Record<string, MatchRound[]> = {};
  for (const mr of simMatchRounds) {
    if (mr.roundId) {
      if (!groupedByRounds[mr.roundId]) groupedByRounds[mr.roundId] = [];
      groupedByRounds[mr.roundId]!.push(mr);
    }
  }
  return Object.entries(groupedByRounds);
});

const teamStrengths = computed(() => props.teamStrengths);
const teams = computed(() => props.teams);
const leagueRounds = computed(() => props.leagueRounds);
const allMatchRounds = computed(() => store.matchRounds);

// --- HELPERS ---
function getTitle(id?: string): string {
  if (!id) return "Unknown round";
  return `${MapNumberToTextUpper(
    leagueRounds.value.find((lr) => lr.id === id)?.round ?? 0
  )} round`;
}

function getSubTitle(length: number, id?: string): string {
  if (!id) return "Unknown round";
  return `${length} of 9 simulated`;
}

// Ułatwienie dla template
function getTeamStrength(teamId: string, roundId: string | null | undefined) {
  if (!roundId) return undefined;
  return teamStrengths.value.find(
    (t) => t.teamId === teamId && t.roundId === roundId
  );
}

// --- DATA LOADING ---
const ensureData = async () => {
  // Sprawdzamy czy mamy jakiekolwiek rundy ligowe, aby wyciągnąć leagueId
  const firstRound = props.leagueRounds?.[0];

  if (!firstRound || !firstRound.leagueId) {
    return;
  }

  // Wywołujemy tylko RAZ dla danego leagueId
  // Store sam zadba o cache i deduplikację requestów
  await store.loadMatchRounds(firstRound.leagueId);
};

onMounted(async () => {
  await ensureData();
  console.log(allMatchRounds.value)
});

// Opcjonalnie: jeśli zmienią się rundy (np. inna symulacja), załaduj ponownie
watch(
  () => props.leagueRounds,
  async () => {
    await ensureData();
  }
);
</script>
