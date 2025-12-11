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
      class="complete-details-table"
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
        <tr v-for="s in scoreboard?.scoreboardTeams" :key="s.teamId">
          <td>
            <div class="stat-cell">
              <span>{{ s.rank }}</span>
            </div>
          </td>
          <td>
            <div class="team-card-container">
              <TeamCard
                :id="s.teamId"
                :variant="'mini'"
                :team="GetTeamById(s.teamId)"
              />
            </div>
          </td>
          <td>
            <div class="stat-cell">
              <span>{{ s.matchPlayed }}</span>
              <span
                class="initial-value"
                v-if="teamStats && teamStats.length > 0"
              >
                ({{ GetInitialTeamStatByTeamId(s.teamId)?.matchPlayed }})
              </span>
            </div>
          </td>
          <td>
            <div class="stat-cell">
              <span>{{ s.wins }}</span>
              <span
                class="initial-value"
                v-if="teamStats && teamStats.length > 0"
              >
                ({{ GetInitialTeamStatByTeamId(s.teamId)?.wins }})
              </span>
              <span class="avg-value" v-if="teamStats && teamStats.length > 0">
                ≈ {{ GetTeamStatsById(s.teamId)?.averangeWins.toFixed(2) }}
              </span>
            </div>
          </td>
          <td>
            <div class="stat-cell">
              <span>{{ s.draws }}</span>
              <span
                class="initial-value"
                v-if="teamStats && teamStats.length > 0"
              >
                ({{ GetInitialTeamStatByTeamId(s.teamId)?.draws }})
              </span>
              <span class="avg-value" v-if="teamStats && teamStats.length > 0">
                ≈ {{ GetTeamStatsById(s.teamId)?.averangeDraws.toFixed(2) }}
              </span>
            </div>
          </td>
          <td>
            <div class="stat-cell">
              <span>{{ s.losses }}</span>
              <span
                class="initial-value"
                v-if="teamStats && teamStats.length > 0"
              >
                ({{ GetInitialTeamStatByTeamId(s.teamId)?.losses }})
              </span>
              <span class="avg-value" v-if="teamStats && teamStats.length > 0">
                ≈ {{ GetTeamStatsById(s.teamId)?.averangeLosses.toFixed(2) }}
              </span>
            </div>
          </td>
          <td>
            <div class="stat-cell">
              <span>{{ s.goalsFor }}</span>
              <span
                class="initial-value"
                v-if="teamStats && teamStats.length > 0"
              >
                ({{ GetInitialTeamStatByTeamId(s.teamId)?.goalsFor }})
              </span>
              <span class="avg-value" v-if="teamStats && teamStats.length > 0">
                ≈ {{ GetTeamStatsById(s.teamId)?.averangeGoalsFor.toFixed(2) }}
              </span>
            </div>
          </td>
          <td>
            <div class="stat-cell">
              <span>{{ s.goalsAgainst }}</span>
              <span
                class="initial-value"
                v-if="teamStats && teamStats.length > 0"
              >
                ({{ GetInitialTeamStatByTeamId(s.teamId)?.goalsAgainst }})
              </span>
              <span class="avg-value" v-if="teamStats && teamStats.length > 0">
                ≈
                {{
                  GetTeamStatsById(s.teamId)?.averangeGoalsAgainst.toFixed(2)
                }}
              </span>
            </div>
          </td>
          <td>
            <div class="stat-cell">
              <span>{{ s.goalsFor - s.goalsAgainst }}</span>
              <span
                class="initial-value"
                v-if="teamStats && teamStats.length > 0"
              >
                ({{
                  (GetInitialTeamStatByTeamId(s.teamId)?.goalsFor ?? 0) -
                  (GetInitialTeamStatByTeamId(s.teamId)?.goalsAgainst ?? 0)
                }})
              </span>
            </div>
          </td>
          <td>
            <div class="stat-cell">
              <span>{{ s.points }}</span>
              <span
                class="initial-value"
                v-if="teamStats && teamStats.length > 0"
              >
                ({{ GetInitialTeamStatByTeamId(s.teamId)?.points }})
              </span>
              <span class="avg-value" v-if="teamStats && teamStats.length > 0">
                ≈ {{ GetTeamStatsById(s.teamId)?.averangePoints.toFixed(2) }}
              </span>
            </div>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="10">
            <div class="tfoot-legend">
              <div class="legend-item">
                <span class="initial-breadcrumb"
                  >Team stats before the simulation</span
                >
              </div>
              <div class="legend-item">
                <span class="avg-breadcrumb"
                  >Averange statistics based on all iterations</span
                >
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </table>

    <details
      class="default-details"
      v-else-if="variant === 'simulation_averange' && simulationTeamStats"
    >
      <summary class="default-summary">
        <div class="default-summary-content">
          <span class="default-summary-title">Teams average statistics</span>
          <span class="default-summary-subtitle">Based on all iterations</span>
        </div>
      </summary>
      <table class="simulation-stats-table">
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
          <tr v-for="stat in teamStats" :key="stat.teamId">
            <td>
              <div>
                <TeamCard
                  :id="stat.teamId"
                  :variant="'mini'"
                  :team="GetTeamById(stat.teamId)"
                />
              </div>
            </td>
            <td>
              <div class="stat-cell">
                <span>{{ stat.averangePoints.toFixed(3) }}</span>
              </div>
            </td>
            <td>
              <div class="stat-cell">
                <span>{{ stat.averangeWins.toFixed(3) }}</span>
              </div>
            </td>
            <td>
              <div class="stat-cell">
                <span>{{ stat.averangeLosses.toFixed(3) }}</span>
              </div>
            </td>
            <td>
              <div class="stat-cell">
                <span>{{ stat.averangeDraws.toFixed(3) }}</span>
              </div>
            </td>
            <td>
              <div class="stat-cell">
                <span>{{ stat.averangeGoalsFor.toFixed(3) }}</span>
              </div>
            </td>
            <td>
              <div class="stat-cell">
                <span>{{ stat.averangeGoalsAgainst.toFixed(3) }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </details>
  </section>
</template>

<style lang="css" scoped>
.preview-table {
  width: 100%;
  border-collapse: collapse;
}

.preview-table th,
.preview-table td {
  padding: 0.75rem;
  text-align: center;
  border: 1px solid var(--color-grid);
}

.preview-table th {
  background-color: var(--color-grid);
  color: var(--color-text-secondary);
  font-weight: 600;
}

.preview-table tbody tr:hover td {
  background-color: var(--color-surface-contrast);
  transform: scale(1.002);
}

.complete-details-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.complete-details-table th,
.complete-details-table td {
  padding: 0.75rem 0.5rem;
  text-align: center;
  border: 1px solid var(--color-grid);
  font-size: 0.9rem;
}

.complete-details-table th {
  background-color: var(--color-grid);
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
}

.complete-details-table tbody td {
  background-color: var(--color-surface-sections);
  transition: background-color 0.2s ease, transform 0.15s ease;
  position: relative;
}

.complete-details-table tbody tr:hover td {
  background-color: var(--color-surface-contrast);
  transform: scale(1.002);
}

.simulation-stats-table th {
  background-color: var(--color-grid);
  color: var(--color-text-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  letter-spacing: 0.3px;
}

.simulation-stats-table tbody td {
  background-color: var(--color-surface-sections);
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.simulation-stats-table tbody tr:hover td {
  background-color: var(--color-surface-contrast);
  transform: scale(1.002);
}

.stat-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-height: 3.5rem;
  justify-content: center;
}

.stat-cell > span:first-child {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-main);
}

.team-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.25rem;
}

.initial-value {
  color: var(--color-text-teamStat-initial);
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 0.9;
}

.avg-value {
  color: var(--color-text-teamStat-avg);
  font-size: 0.8rem;
  font-weight: 500;
  opacity: 0.85;
  font-style: italic;
}

.complete-details-table tfoot {
  width: 100%;
  border-collapse: collapse;
}

.complete-details-table tfoot tr {
  background-color: var(--color-surface-sections);
  border-top: 2px solid var(--color-grid);
}

.complete-details-table tfoot td {
  padding: 1rem;
  border: 1px solid var(--color-grid);
}

.tfoot-legend {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.initial-breadcrumb {
  color: var(--color-text-teamStat-initial);
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.9;
}

.avg-breadcrumb {
  color: var(--color-text-teamStat-avg);
  font-size: 1rem;
  font-weight: 500;
  opacity: 0.85;
  font-style: italic;
}

@media (max-width: 768px) {
  .tfoot-legend {
    gap: 0.5rem;
  }

  .initial-breadcrumb,
  .avg-breadcrumb {
    font-size: 0.9rem;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .complete-details-table th,
  .complete-details-table td,
  .simulation-stats-table th,
  .simulation-stats-table td {
    padding: 0.5rem 0.25rem;
    font-size: 0.8rem;
  }

  .stat-cell {
    min-height: 3rem;
  }

  .initial-value,
  .avg-value {
    font-size: 0.75rem;
  }
}

@media (max-width: 768px) {
  .complete-details-table,
  .simulation-stats-table {
    font-size: 0.75rem;
  }

  .complete-details-table th,
  .complete-details-table td,
  .simulation-stats-table th,
  .simulation-stats-table td {
    padding: 0.4rem 0.2rem;
  }

  .stat-cell {
    min-height: 2.5rem;
  }

  .initial-value,
  .avg-value {
    font-size: 0.7rem;
  }

  .preview-table th,
  .preview-table td {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
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
import type { ScoreboardTeamStats } from "../../models/Scoreboards/scoreboardTeamStats";

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

const GetInitialTeamStatByTeamId = (
  TeamId: string
): ScoreboardTeamStats | undefined => {
  if (props.scoreboard?.initialScoreboardTeams) {
    return props.scoreboard?.initialScoreboardTeams.find(
      (x) => x.teamId === TeamId
    );
  }
};
</script>
