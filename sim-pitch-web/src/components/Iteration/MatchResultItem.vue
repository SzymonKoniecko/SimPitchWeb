<template>
  <table 
    class="match-body" 
    :class="{ 'simulation-mode': !isReal, 'real-mode': isReal }"
    selenium-id="match"
  >
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
        <td class="stadium-name">{{ getStadiumNameByTeamId(matchRound.homeTeamId) }}</td>
      </tr>
      <tr>
        <td class="score">
          <span class="home-goals">{{ matchRound.homeGoals }}</span>
          <span class="separator">:</span>
          <span class="away-goals">{{ matchRound.awayGoals }}</span>
        </td>
      </tr>
      <tr>
        <td class="result-type-cell">
          <span v-if="isReal" class="real-result-label" selenium-id="official">
            <i class="icon-check"></i> Official Result
          </span>
          <span v-else class="sim-result-label" selenium-id="simulated">
            <i class="icon-cpu"></i> Simulated
          </span>
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
  <hr class="divider" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import TeamCard from "../Team/TeamCard.vue";
import TeamStrengthItem from "../Team/TeamStrengthItem.vue";
import type { MatchRound } from "../../models/SportsDataModels/matchRound";
import type { Team } from "../../models/SportsDataModels/team";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import type { LeagueRound } from "../../models/SportsDataModels/leagueRound";

type Props = {
  matchRound: MatchRound;
  teams: Team[];
  isReal: boolean;
  homeTeamStrength?: TeamStrength | null;
  awayTeamStrength?: TeamStrength | null;
  leagueRounds: LeagueRound[];
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

td, th {
  border: none;
  padding: 8px;
  text-align: center;
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
}

.match-status.draw {
  color: var(--color-accent-blue);
}

.match-body {
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.result-type-cell {
  padding-top: 0;
  padding-bottom: 1rem;
}

.real-result-label {
  font-size: 0.85rem;
  color: var(--color-accent-green);
  background-color: rgba(0, 255, 0, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid var(--color-accent-green);
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.sim-result-label {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  background-color: rgba(128, 128, 128, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  border: 1px solid var(--color-text-secondary);
  font-style: italic;
}

.stadium-name {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.team {
  width: 40%;
  max-width: 40%;
  transition: transform 0.2s;
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
  color: var(--color-text-primary);
  min-width: 6rem;
}

.simulation-mode .score {
  color: var(--color-accent-blue); 
}

.real-mode .score {
  color: var(--color-accent-green);
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

.divider {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: 1rem 0;
  opacity: 0.3;
}
</style>
