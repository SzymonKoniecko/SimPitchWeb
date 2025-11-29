<template>
  <details class="match-details" close :id="`round:${roundData.roundNumber}`">
    <summary class="match-summary">
      <div class="match-summary-content">
        <span class="match-summary-title">
          {{ getTitle(roundData.roundId) }}
        </span>

        <span class="match-summary-subtitle">
          {{
            getSubTitle(
              roundData.simulatedMatches.length,
              roundData.realMatches.length
            )
          }}
        </span>
      </div>
    </summary>

    <div v-for="matchRound in roundData.simulatedMatches" :key="matchRound.id">
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

    <div
      v-for="realMatchRound in roundData.realMatches"
      :key="realMatchRound.id"
    >
      <MatchResultItem
        :match-round="realMatchRound"
        :teams="teams"
        :home-team-strength="null"
        :away-team-strength="null"
        :is-real="true"
      />
    </div>
  </details>
</template>

<script setup lang="ts">
import MatchResultItem from "./MatchResultItem.vue";
import type { Team } from "../../models/SportsDataModels/team";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import type { LeagueRound } from "../../models/SportsDataModels/leagueRound";
import { MapNumberToTextUpper } from "../../models/Consts/textHelper";
import type { RoundData } from "../../models/Iterations/roundData";

type Props = {
  roundData: RoundData;
  teams: Team[];
  teamStrengths: TeamStrength[];
  leagueRounds: LeagueRound[];
  onlyPlayedMatches: boolean;
};

const props = defineProps<Props>();

function getTitle(id?: string): string {
  if (!id) return "Unknown round";
  return `${MapNumberToTextUpper(
    props.leagueRounds.find((lr) => lr.id === id)?.round ?? 0
  )} round`;
}

function getSubTitle(lengthSimulated: number, lengthReal: number): string {
  console.log(props.onlyPlayedMatches)
  if (!props.onlyPlayedMatches) {
    return `${lengthReal + lengthSimulated} matches`;
  }
  return `${lengthSimulated} of ${
    lengthReal + lengthSimulated
  } simulated matches`;
}
function getTeamStrength(teamId: string, roundId: string | null | undefined) {
  if (!roundId) return undefined;
  return props.teamStrengths.find(
    (t) => t.teamId === teamId && t.roundId === roundId
  );
}
</script>
