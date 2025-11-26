<template>
  <div v-for="([roundId, matchRounds]) in simulatedMatchRoundsEntries">
    <details class="custom-chart-details" close :id="`round:${roundId}`">
    <summary class="custom-chart-summary"><div class="summary-content"><span class="summary-title">{{ getTitle(roundId) }}</span class="summary-subtitle"> {{ getSubTitle(matchRounds.length, roundId) }}<span></span></div></summary>
      <div v-for="matchRound in matchRounds">
        <MatchResultItem
          :match-round="matchRound"
          :teams="teams"
          :home-team-strength="
            teamStrengths?.find(
              (t) =>
                t.teamId === matchRound.homeTeamId &&
                t.roundId === matchRound.roundId
            )
          "
          :away-team-strength="
            teamStrengths?.find(
              (t) =>
                t.teamId === matchRound.awayTeamId &&
                t.roundId === matchRound.roundId
            )
          "
        />
      </div>
    </details>
  </div>
  <hr />
</template>

<script setup lang="ts">
import MatchResultItem from "./MatchResultItem.vue";
import { computed } from "vue";
import type { MatchRound } from "../../models/SportsDataModels/matchRound";
import type { Team } from "../../models/SportsDataModels/team";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import type { LeagueRound } from "../../models/SportsDataModels/leagueRound";
import { MapNumberToTextUpper } from "../../models/Consts/textHelper";
defineOptions({ name: "MatchResultItemList" });

type Props = {
  simulatedMatchRounds: MatchRound[];
  teams: Team[];
  teamStrengths: TeamStrength[];
  leagueRounds: LeagueRound[];
};

const props = defineProps<Props>();

const simulatedMatchRounds = computed(() => {
  const simMatchRounds = props.simulatedMatchRounds;
  const groupedByRounds: Record<string, MatchRound[]> = {};
  for (const mr of simMatchRounds) {
    if (mr.roundId !== null && mr.roundId !== undefined) {
      if (!groupedByRounds[mr.roundId]) groupedByRounds[mr.roundId] = [];
      groupedByRounds[mr.roundId]!.push(mr);
    }
  }
  return groupedByRounds;
});
const simulatedMatchRoundsEntries = computed(() =>
  Object.entries(simulatedMatchRounds.value)
);

const teamStrengths = computed(() => props.teamStrengths);
const teams = computed(() => props.teams);
const leagueRounds = computed(() => props.leagueRounds);
function getTitle(id?: string): string {
  if (id === null) {
    return "Unknown round";
  }
  return `${MapNumberToTextUpper(leagueRounds.value.find((lr) => lr.id === id)?.round ?? 0)} round`;
}
function getSubTitle(length: number, id?: string): string {
  if (id === null) {
    return "Unknown round";
  }
  return `${length } of 9 simulated`;
}
</script>

<style scoped></style>
