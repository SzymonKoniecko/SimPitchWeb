<template>
  <details open class="custom-chart-details" selenium-id="team-radar-details">
    <summary class="custom-chart-summary">
      <div class="summary-content">
        <span class="summary-title">Team Profile</span>
        <span class="summary-subtitle">(Radar Analysis)</span>
      </div>
    </summary>

    <div v-if="radarData" class="chart-wrapper">
      <apexchart
        type="radar"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
    <div v-else class="chart-wrapper no-data">
      <p>No data available for the selected team.</p>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import { mapToRadarData } from "../../models/Diagrams/radarChartData";

const props = defineProps<{
  teamStrength: TeamStrength;
}>();

const radarData = computed(() => {
  if (!props.teamStrength) return null;
  return mapToRadarData(props.teamStrength);
});

const series = computed(() => {
  if (!radarData.value) return [];
  const s = radarData.value.stats;
  return [
    {
      name: "Team Metrics",
      data: [s.attack, s.defense, s.momentum, s.winRate, s.efficiency],
    },
  ];
});

const chartOptions = computed(() => ({
  chart: {
    type: "radar",
    toolbar: { show: false },
    fontFamily: "Inter, Segoe UI, sans-serif",
    background: "transparent",
  },
  labels: ["Attack", "Defense", "Form (Momentum)", "Win Rate %", "Efficiency"],
  yaxis: {
    show: false,
    min: 0,
    max: 100,
  },
  stroke: {
    width: 2,
    colors: ["#2979ff"], //  --color-accent-blue
    dashArray: 0,
  },
  fill: {
    opacity: 0.2,
    colors: ["#2979ff"], //  --color-accent-blue
  },
  markers: {
    size: 4,
    colors: ["#fff"], //  --color-button-text
    strokeColors: "#2979ff",
    strokeWidth: 2,
    hover: { size: 6 },
  },
  tooltip: {
    theme: "dark", // Fits the dark theme
    y: {
      formatter: (val: number) => `${val} / 100`,
    },
  },
  plotOptions: {
    radar: {
      polygons: {
        strokeColors: "#2b3558", //  --color-grid
        connectorColors: "#2b3558", //  --color-grid
      },
    },
  },
  xaxis: {
    labels: {
      style: {
        colors: ["#a0aec0", "#a0aec0", "#a0aec0", "#a0aec0", "#a0aec0"], //  --color-text-secondary
        fontSize: "11px",
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
      },
    },
  },
}));
</script>

<style scoped>
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-secondary);
  font-style: italic;
}

summary::after {
  margin-left: auto;
}
</style>
