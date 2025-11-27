<template>
  <div v-for="[roundNumber, matchRounds] in simulatedMatchRoundsEntries" :key="roundNumber">
    <details class="custom-chart-details" close :id="`round:${roundNumber}`">
      <summary class="custom-chart-summary">
        <div class="summary-content">
          <span class="summary-title">{{
            getTitle(matchRounds[0]?.roundId)
          }}</span>
          <span class="summary-subtitle">
            {{ getSubTitle(matchRounds.length, allRealMatchRounds[roundNumber].length) }}</span
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
          :is-real="false"
        />
      </div>
      <div v-for="realMatchRound in allRealMatchRounds[roundNumber]" :key="realMatchRound.id">
        <MatchResultItem
          :match-round="realMatchRound"
          :teams="teams"
          :home-team-strength="
            getTeamStrength(realMatchRound.homeTeamId, realMatchRound.roundId)
          "
          :away-team-strength="
            getTeamStrength(realMatchRound.awayTeamId, realMatchRound.roundId)
          "
          :is-real="true"
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

const simulatedMatchRoundsEntries = computed(() => {
  const simMatchRounds = props.simulatedMatchRounds;
  const groupedByRounds: Record<number, MatchRound[]> = {};
  for (const mr of simMatchRounds) {
    if (mr.roundId) {
      if (!groupedByRounds[getLeagueRoundNumber(mr.roundId)])
        groupedByRounds[getLeagueRoundNumber(mr.roundId)] = [];
      groupedByRounds[getLeagueRoundNumber(mr.roundId)]!.push(mr);
    }
  }
  return Object.entries(groupedByRounds).sort(([keyA], [keyB]) => {
    return Number(keyA) - Number(keyB);
  });
});

const teamStrengths = computed(() => props.teamStrengths);
const teams = computed(() => props.teams);
const leagueRounds = computed(() => props.leagueRounds);
const allRealMatchRounds = computed(() => getRealMatches());

function getTitle(id?: string): string {
  if (!id) return "Unknown round";
  return `${MapNumberToTextUpper(
    leagueRounds.value.find((lr) => lr.id === id)?.round ?? 0
  )} round`;
}

function getSubTitle(lengthSimulated: number, lengthReal: number): string {
  return `${lengthSimulated} of ${lengthReal + lengthSimulated} simulated`;
}

function getTeamStrength(teamId: string, roundId: string | null | undefined) {
  if (!roundId) return undefined;
  return teamStrengths.value.find(
    (t) => t.teamId === teamId && t.roundId === roundId
  );
}
function getLeagueRoundNumber(roundId: string): number {
  if (!roundId) return 0;
  return leagueRounds.value.find((t) => t.id === roundId)?.round ?? 0;
}
function getRealMatches() {
  const realMatches = store.matchRounds;
  const groupedByRounds: Record<number, MatchRound[]> = {};
  let simulatedRound = null;
  let currentRoundId = "";
  for (const mr of realMatches) {
    if (mr.isPlayed === true) {
      if (currentRoundId !== mr.roundId) {
        currentRoundId = mr.roundId;
        simulatedRound = simulatedMatchRoundsEntries.value.find(
          ([roundId]) => roundId === mr.roundId
        );
      }
      if (
        mr.roundId &&
        simulatedRound &&
        simulatedRound[1].some((x) => x.id !== mr.id)
      ) {
        if (!groupedByRounds[getLeagueRoundNumber(mr.roundId)])
          groupedByRounds[getLeagueRoundNumber(mr.roundId)] = [];
        groupedByRounds[getLeagueRoundNumber(mr.roundId)]!.push(mr);
      }
    }
  }
  return Object.entries(groupedByRounds).sort(([keyA], [keyB]) => {
    return Number(keyA) - Number(keyB);
  });
}

const ensureData = async () => {
  const firstRound = props.leagueRounds?.[0];

  if (!firstRound || !firstRound.leagueId) {
    return;
  }

  await store.loadMatchRounds(firstRound.leagueId);
};

onMounted(async () => {
  await ensureData();
});

watch(
  () => props.leagueRounds,
  async () => {
    await ensureData();
  }
);
</script>
