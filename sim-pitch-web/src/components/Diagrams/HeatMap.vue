<script setup lang="ts">
import { computed } from "vue";
import { sortTeamStats, type SimulationTeamStats } from "../../models/Simulations/simulationTeamStats";
import TeamCard from "../Team/TeamCard.vue";
defineOptions({ name: "HeatMap" });

const props = defineProps<{
  simulationTeamStats: SimulationTeamStats[];
}>();


const teamStats = computed(() =>
  sortTeamStats(props.simulationTeamStats)
);

const maxPositions = computed(() =>
  Math.max(...(props.simulationTeamStats?.map(t => t.positionProbbility.length) ?? [0]))
);

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

  const alpha = Math.min(Math.max(prob, 0), 1); // 0–1
  const lightnessAdjust = 0.4 + prob * 0.6; // 0.4 → 1.0

  const adjustedR = Math.round(r * lightnessAdjust);
  const adjustedG = Math.round(g * lightnessAdjust);
  const adjustedB = Math.round(b * lightnessAdjust);

  return `rgba(${adjustedR}, ${adjustedG}, ${adjustedB}, ${alpha})`;
};
</script>

<template>
  <details close class="heatmap">
    <summary>Team Position Probbility - Heatmap</summary>
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
          <tr v-for="teamstat in teamStats">
            <th scope="row"><TeamCard :id="teamstat.teamId" :variant="'mini'" /></th>

            <td
              v-for="(prob, idx) in teamstat.positionProbbility"
              :key="idx"
              :style="{
                backgroundColor: getColor(prob),
                color: prob > 0.6 ? '#fff' : 'var(--color-text-main)'
              }"
            >
              {{ (prob * 100).toFixed(3) }}%
            </td>
          </tr>
        </tbody>
      </table>
    </figure>
  </details>
</template>

<style scoped>
.heatmap {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  color: var(--color-text-main);
}

figure {
  overflow-x: auto;
  margin: 0;
}

.heatmap-table {
  width: 100%;
  border-collapse: collapse;
  background-color: var(--color-surface-sections);
  color: var(--color-text-main);
  font-size: .735rem;
}
</style>