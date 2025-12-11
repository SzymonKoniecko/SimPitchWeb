<script setup lang="ts">
import { computed, watch } from "vue";
import {
  sortTeamStats,
  type SimulationTeamStats,
} from "../../models/Simulations/simulationTeamStats";
import TeamCard from "../Team/TeamCard.vue";
import type { Team } from "../../models/SportsDataModels/team";

defineOptions({ name: "HeatMap" });

const props = defineProps<{
  simulationTeamStats: SimulationTeamStats[];
  teams: Team[];
}>();

export interface WinnerInfo {
  position: number;
  teamName: string;
  probability: number;
}

const emit = defineEmits<{
  (e: "update:winnersData", value: WinnerInfo[]): void;
}>();

const teamStats = computed(() => {
  return sortTeamStats(props.simulationTeamStats);
});

const maxPositions = computed(() =>
  Math.max(
    ...(props.simulationTeamStats?.map((t) => t.positionProbbility.length) ?? [0])
  )
);

function getTeamNameById(id?: string): string {
  return props.teams.find((team) => team.id === id)?.name || "UNKNOWN";
}

watch(
  teamStats,
  (sorted) => {
    if (!sorted || sorted.length < 3) return;

    const winners: WinnerInfo[] = [
      {
        position: 1,
        teamName: getTeamNameById(sorted[0]?.teamId),
        probability: sorted[0]?.positionProbbility?.[0] ?? 0
      },
      {
        position: 2,
        teamName: getTeamNameById(sorted[1]?.teamId),
        probability: sorted[1]?.positionProbbility?.[1] ?? 0
      },
      {
        position: 3,
        teamName: getTeamNameById(sorted[2]?.teamId),
        probability: sorted[2]?.positionProbbility?.[2] ?? 0
      }
    ];

    emit("update:winnersData", winners);
  },
  { immediate: true }
);

const getColor = (prob: number) => {
  const baseColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-heatmap-max")
    .trim();

  const hexToRgb = (hex: string) => {
    if (!hex.startsWith("#")) return { r: 239, g: 68, b: 68 };
    const value = hex.replace("#", "");
    const bigint = parseInt(value, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const { r, g, b } = hexToRgb(baseColor || "#ef4444");
  const alpha = Math.max(prob * 0.9 + 0.1, 0.15);
  const lightnessAdjust = 0.5 + prob * 0.9;
  const adjustedR = Math.min(Math.round(r * lightnessAdjust) + 10, 255);
  const adjustedG = Math.min(Math.round(g * lightnessAdjust) + 10, 255);
  const adjustedB = Math.min(Math.round(b * lightnessAdjust) + 10, 255);

  return `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`;
};
</script>

<template>
  <section>
    <details open class="default-details" selenium-id="heatmap-details">
      <summary class="default-summary">
       <div class="default-summary-content">
        <span class="default-summary-title">Team Position Probability</span>
        <span class="default-summary-subtitle"> HeatMap</span>
       </div>
      </summary>
      <figure>
        <table role="grid" class="heatmap-table">
          <thead>
            <tr>
              <th>Team</th>
              <th v-for="index in maxPositions" :key="index">
                Pos {{ index }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(teamstat, index) in teamStats" :key="teamstat.teamId">
              <th scope="row">
                <TeamCard :id="teamstat.teamId" :variant="'mini'" />
              </th>

              <td
                v-for="(prob, idx) in teamstat.positionProbbility"
                :key="idx"
                :style="{
                  backgroundColor: getColor(prob),
                  color: prob > 0.6 ? '#fff' : 'var(--color-text-main)',
                }"
                :selenium-id="`cell-${index}-${idx}`"
              >
                {{ (prob * 100).toFixed(1) }}%
              </td>
            </tr>
          </tbody>
        </table>
      </figure>
    </details>
  </section>
</template>

<style scoped>
figure {
  overflow-x: auto;
  margin: 0;
  border-radius: 8px;
}

.heatmap-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-surface-sections);
  color: var(--color-text-main);
  font-size: 0.735rem;
}

.heatmap-table th, 
.heatmap-table td {
  padding: 0.4rem;
  text-align: center;
  border: 1px solid var(--color-grid);
}

.heatmap-table thead th {
  background-color: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: 10;
}
</style>
