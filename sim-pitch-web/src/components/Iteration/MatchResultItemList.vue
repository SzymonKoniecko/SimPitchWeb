<template>
  <div v-for="roundData in allRoundsEntries" :key="roundData.roundNumber">
    <MatchResultItemRound
      :round-data="roundData"
      :teams="teams"
      :team-strengths="teamStrengths"
      :league-rounds="leagueRounds"
    />
  </div>
  <hr />
</template>

<script setup lang="ts">
import MatchResultItemRound from "./MatchResultItemRound.vue"; // 👈 Import nowego komponentu
import { computed, onMounted, watch } from "vue";
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
};

const props = defineProps<Props>();
const store = useSportsDataStore();

const teamStrengths = computed(() => props.teamStrengths);
const teams = computed(() => props.teams);
const leagueRounds = computed(() => props.leagueRounds);

function getLeagueRoundNumber(roundId: string): number {
  if (!roundId) return 0;
  return leagueRounds.value.find((t) => t.id === roundId)?.round ?? 0;
}

const allRoundsEntries = computed<RoundData[]>(() => {
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

  const simulatedMatchIds = new Set(
    props.simulatedMatchRounds.map((m) => m.id)
  );

  if (store.matchRounds) {
    for (const match of store.matchRounds) {
      if (match.roundId && match.isPlayed && !simulatedMatchIds.has(match.id)) {
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

  return Object.values(mergedRounds).sort(
    (a, b) => a.roundNumber - b.roundNumber
  );
});


const ensureData = async () => {
  const firstRound = props.leagueRounds?.[0];
  if (!firstRound || !firstRound.leagueId) return;
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
