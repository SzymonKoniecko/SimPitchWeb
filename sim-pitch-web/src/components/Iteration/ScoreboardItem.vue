<template>
  <section>
    <table v-if="variant === 'preview'" class="preview-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="p in iteration_preview"
          :key="p.teamId + '-' + p.iterationIndex"
        >
          <td>{{ p.rank }}</td>
          <td>
            <TeamCard
              :id="p.teamId"
              :variant="'mini'"
              :team="GetTeamById(p.teamId)"
            />
          </td>
          <td>{{ p.points }}</td>
        </tr>
      </tbody>
    </table>
    <table
      v-else-if="variant === 'complete_details'"
      selenium-id="scoreboard_complete_details"
    >
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Match Played</th>
          <th>Wins</th>
          <th>Draws</th>
          <th>Losses</th>
          <th>Goals for</th>
          <th>Goals against</th>
          <th>Goals difference</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in scoreboard?.scoreboardTeams">
          <td>{{ s.rank }}</td>
          <td>
            <TeamCard
              :id="s.teamId"
              :variant="'mini'"
              :team="GetTeamById(s.teamId)"
            />
          </td>
          <td>{{ s.matchPlayed }}</td>
          <td>
            {{ s.wins }}
            <p class="avg-value" v-if="teamStats && teamStats.length > 0">
              ({{ GetTeamStatsById(s.teamId)?.averangeWins.toFixed(2) }})
            </p>
          </td>
          <td>
            {{ s.draws }}
            <p class="avg-value" v-if="teamStats && teamStats.length > 0">
              ({{ GetTeamStatsById(s.teamId)?.averangeDraws.toFixed(2) }})
            </p>
          </td>
          <td>
            {{ s.losses }}
            <p class="avg-value" v-if="teamStats && teamStats.length > 0">
              ({{ GetTeamStatsById(s.teamId)?.averangeLosses.toFixed(2) }})
            </p>
          </td>
          <td>
            {{ s.goalsFor }}
            <p class="avg-value" v-if="teamStats && teamStats.length > 0">
              ({{ GetTeamStatsById(s.teamId)?.averangeGoalsFor.toFixed(2) }})
            </p>
          </td>
          <td>
            {{ s.goalsAgainst }}
            <p class="avg-value" v-if="teamStats && teamStats.length > 0">
              ({{
                GetTeamStatsById(s.teamId)?.averangeGoalsAgainst.toFixed(2)
              }})
            </p>
          </td>
          <td>{{ s.goalsFor - s.goalsAgainst }}</td>
          <td>
            {{ s.points }}
            <p class="avg-value" v-if="teamStats && teamStats.length > 0">
              ({{ GetTeamStatsById(s.teamId)?.averangePoints.toFixed(2) }})
            </p>
          </td>
        </tr>
      </tbody>
    </table>
    <details
      class="default-details"
      close
      v-else-if="variant === 'simulation_averange' && simulationTeamStats"
    >
      <summary class="default-summary">
        <div class="default-summary-content">
          <span class="default-summary-title">Teams averange statistics.</span>
          <span class="default-summary-subtitle"> Based on all iterations</span>
        </div>
      </summary>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Points</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Draws</th>
            <th>Goals for</th>
            <th>Goals against</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stat in teamStats">
            <td>
              <TeamCard
                :id="stat.teamId"
                :variant="'mini'"
                :team="GetTeamById(stat.teamId)"
              />
            </td>
            <td>{{ stat.averangePoints.toFixed(3) }}</td>
            <td>{{ stat.averangeWins.toFixed(3) }}</td>
            <td>{{ stat.averangeLosses.toFixed(3) }}</td>
            <td>{{ stat.averangeDraws.toFixed(3) }}</td>
            <td>{{ stat.averangeGoalsFor.toFixed(3) }}</td>
            <td>{{ stat.averangeGoalsAgainst.toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
    </details>
  </section>
</template>

<style lang="css" scoped>
.preview-table {
  width: 100%;
  text-align: center;
}
.avg-value {
  color: var(--color-text-third);
}
</style>
<script setup lang="ts">
import { computed } from "vue";
import type { IterationPreview } from "../../models/Iterations/iterationPreview";
import type { Scoreboard } from "../../models/Scoreboards/scoreboard";
import {
  sortTeamStats,
  type SimulationTeamStats,
} from "../../models/Simulations/simulationTeamStats";
import TeamCard from "../Team/TeamCard.vue";
import type { Team } from "../../models/SportsDataModels/team";
defineOptions({ name: "ScoreboardItem" });
type Props = {
  teams: Team[];
  iteration_preview?: IterationPreview[];
  scoreboard?: Scoreboard | undefined;
  simulationTeamStats?: SimulationTeamStats[] | null;
  variant?: "preview" | "complete_details" | "simulation_averange";
};
const props = defineProps<Props>();
const variant = computed(() => props.variant ?? "preview");
const teamStats = computed(() =>
  sortTeamStats(props.simulationTeamStats ?? [])
);
const teams = computed(() => props.teams);
const GetTeamById = (Id: string) => {
  return teams.value.find((x) => x.id === Id);
};
const GetTeamStatsById = (Id: string) => {
  return teamStats.value.find((x) => x.teamId === Id);
};
</script>
