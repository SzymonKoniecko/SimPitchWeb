<template>
  <table class="match-body" selenium-id="match">
    <colgroup>
      <col />
      <col />
      <col />
    </colgroup>
    <tbody>
      <tr>
        <td
          rowspan="5"
          class="team"
          :id="`round:${matchRound.roundId}^^team:${matchRound.homeTeamId}`"
        >
          <TeamCard :id="matchRound.homeTeamId" variant="normal" />
        </td>
        <td
          class="match-status"
          :class="{ played: matchRound.isPlayed, draw: matchRound.isDraw }"
        >
          {{ matchRound.isDraw ? "Draw" : "" }}
        </td>
        <td
          rowspan="5"
          class="team"
          :id="`round:${matchRound.roundId}^^team:${matchRound.awayTeamId}`"
        >
          <TeamCard :id="matchRound.awayTeamId" variant="normal" />
        </td>
      </tr>
      <tr>
        <td>{{ getStadiumNameByTeamId(matchRound.homeTeamId) }}</td>
      </tr>
      <tr>
        <td class="score">
          <span class="home-goals">{{ matchRound.homeGoals }}</span>
          <span class="separator">:</span>
          <span class="away-goals">{{ matchRound.awayGoals }}</span>
        </td>
      </tr>
      <tr>
        <td
          class="match-status"
          :class="{ isReal }"
        >
          {{ isReal ? "< Real result >" : "< Simulated result >" }}
        </td>
      </tr>
      <tr>
        <td></td>
      </tr>
      <tr>
        <td colspan="3" class="strengths-grid" v-if="matchRound.isPlayed">
          <TeamStrengthItem
            v-if="homeTeamStrength && awayTeamStrength"
            :homeTeamStrengthData="homeTeamStrength"
            :awayTeamStrengthData="awayTeamStrength"
          />
        </td>
      </tr>
    </tbody>
  </table>
  <hr />
  <hr />
</template>

<script setup lang="ts">
import { computed } from "vue";
import TeamCard from "../Team/TeamCard.vue";
import TeamStrengthItem from "../Team/TeamStrengthItem.vue";
import type { MatchRound } from "../../models/SportsDataModels/matchRound";
import type { Team } from "../../models/SportsDataModels/team";
import type { TeamStrength } from "../../models/Iterations/teamStrength";

type Props = {
  matchRound: MatchRound;
  teams: Team[];
  isReal: boolean;
  homeTeamStrength?: TeamStrength | null;
  awayTeamStrength?: TeamStrength | null;
};

const props = defineProps<Props>();

const matchRound = computed(() => props.matchRound);
const homeTeamStrength = computed(() => props.homeTeamStrength);
const awayTeamStrength = computed(() => props.awayTeamStrength);
const getStadiumNameByTeamId = (id: string) => {
  const stadiumName = props.teams.find((t) => t.id === id)?.stadium?.name;
  return stadiumName ? `${stadiumName}` : "Stadium";
};
const isReal = computed(() => props.isReal);
</script>

<style scoped>
table {
  border-collapse: collapse;
  border: none;
  width: 100%;
}
td,
th {
  border: none;
  padding: 8px;
}
col:nth-child(1),
col:nth-child(3) {
  width: 40%;
}
col:nth-child(2) {
  width: 20%;
}
.match-status {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}
.match-status.draw {
  color: var(--color-accent-blue);
}
.match-status.isReal {
  color: var(--color-text-secondary);
  font-weight: 500;
}

.match-body {
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.team {
  width: 40%;
  max-width: 40%;
}
.team:hover,
.score:hover {
  transform: scale(1.05);
}
.score {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: bold;
  color: var(--color-accent-green);
  min-width: 6rem;
}
.home-goals,
.away-goals {
  font-size: large;
}
.separator {
  color: var(--color-text-secondary);
  margin: 0 0.5rem;
}

.strengths-grid {
  width: 100%;
  margin-top: 1rem;
  gap: 1.5rem;
}
</style>
