<script setup lang="ts">
import { computed } from "vue";
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
const emit = defineEmits<{
  (e: "update:winnersData", value: string): void;
}>();
const teamStats = computed(() => {
  let sorted = sortTeamStats(props.simulationTeamStats);
  changedWinnersData(sorted);
  return sorted;
});
const maxPositions = computed(() =>
  Math.max(
    ...(props.simulationTeamStats?.map((t) => t.positionProbbility.length) ?? [
      0,
    ])
  )
);

const changedWinnersData = (sortedTeamStats: SimulationTeamStats[]) => {
  if (!sortedTeamStats || sortedTeamStats.length < 3) return;

  const winnersString = [
    `1st: ${getTeamNameById(sortedTeamStats[0]?.teamId)} ${(
      100 * (sortedTeamStats[0]?.positionProbbility?.[0] ?? 0)
    ).toFixed(2)}% - `,
    `2nd: ${getTeamNameById(sortedTeamStats[1]?.teamId)} ${(
      100 * (sortedTeamStats[1]?.positionProbbility?.[0] ?? 0)
    ).toFixed(2)}% - `,
    `3rd: ${getTeamNameById(sortedTeamStats[2]?.teamId)} ${(
      100 * (sortedTeamStats[2]?.positionProbbility?.[0] ?? 0)
    ).toFixed(2)}%`,
  ];

  emit("update:winnersData", winnersString.join(" "));
};

function getTeamNameById(id?: string): string {
  return props.teams.find((team) => team.id === id)?.name || "UNKNOWN";
}

const getColor = (prob: number) => {
  const baseColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-heatmap-max")
    .trim();

  const hexToRgb = (hex: string) => {
    const value = hex.replace("#", "");
    const bigint = parseInt(value, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const { r, g, b } = hexToRgb(baseColor);

  // Gwarantujemy, że alpha nigdy nie spadnie poniżej 0.15
  const alpha = Math.max(prob * 0.9 + 0.1, 0.15);

  // Podbijamy jasność przy niskich wartościach
  const lightnessAdjust = 0.5 + prob * 0.9;

  const adjustedR = Math.min(Math.round(r * lightnessAdjust) + 10, 255);
  const adjustedG = Math.min(Math.round(g * lightnessAdjust) + 10, 255);
  const adjustedB = Math.min(Math.round(b * lightnessAdjust) + 10, 255);

  return `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`;
};
</script>

<template>
  <section>
    <details close class="default-details" selenium-id="heatmap-details">
      <summary class="default-summary">
       <div class="default-summary-content">
        <span class="default-summary-title">Team Position Probbility. </span>
        <span class="default-summary-subtitle"> HeatMap</span></div>
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
            <tr v-for="(teamstat, index) in teamStats">
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
                {{ (prob * 100).toFixed(3) }}%
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
}

.heatmap-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-surface-sections);
  color: var(--color-text-main);
  font-size: 0.735rem;
}
</style>
