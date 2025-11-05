<script setup lang="ts">
import { computed } from "vue";
import type { SimulationTeamStats } from "../../models/Simulations/simulationTeamStats";
import type { Team } from "../../models/SportsDataModels/team";

defineOptions({ name: "HeatMap" });

const props = defineProps<{
  simulationTeamStats: SimulationTeamStats[];
  teams: Team[];
}>();

// Sortowanie po największym prawdopodobieństwie 1. miejsca
const teamStats = computed(() =>
  [...(props.simulationTeamStats ?? [])].sort(
    (a, b) => (b.positionProbbility?.[0] || 0) - (a.positionProbbility?.[0] || 0)
  )
);

const maxPositions = computed(() =>
  Math.max(...(props.simulationTeamStats?.map(t => t.positionProbbility.length) ?? [0]))
);

const getTeamName = (id: string) =>
  props.teams.find((t) => t.id === id)?.name ?? id;

// Funkcja pomocnicza do generowania koloru w zależności od wartości (0–1)
const getColor = (prob: number) => {
  const hue = 240 - prob * 240; // od niebieskiego (niski) do czerwonego (wysoki)
  return `hsl(${hue}, 70%, ${50 - prob * 10}%)`;
};
</script>

<template>
  <section class="heatmap">
    <h2>Team Position Heatmap</h2>

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
          <tr v-for="team in teamStats" :key="team.id">
            <th scope="row">{{ getTeamName(team.teamId) }}</th>

            <td
              v-for="(prob, idx) in team.positionProbbility"
              :key="idx"
              :style="{
                backgroundColor: getColor(prob),
                color: prob > 0.6 ? '#fff' : 'var(--color-text-main)'
              }"
            >
              {{ (prob * 100).toFixed(1) }}%
            </td>
          </tr>
        </tbody>
      </table>
    </figure>
  </section>
</template>

<style scoped>
.heatmap {
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  color: var(--color-text-main);
}

.heatmap h2 {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
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
  font-size: 0.9rem;
}

.heatmap-table th,
.heatmap-table td {
  padding: 0.5rem 0.75rem;
  text-align: center;
  border: 1px solid var(--color-grid);
}

.heatmap-table thead th {
  background-color: var(--color-grid);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.heatmap-table tbody th {
  text-align: left;
  background-color: var(--color-surface-sections);
  color: var(--color-text-main);
  position: sticky;
  left: 0;
}

.heatmap-table td {
  transition: transform 0.15s ease, background-color 0.3s ease;
}

.heatmap-table td:hover {
  transform: scale(1.05);
  z-index: 1;
  border-color: var(--color-accent-yellow);
}
</style>