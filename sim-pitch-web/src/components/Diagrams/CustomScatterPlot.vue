<template>
  <details close class="chart-details" selenium-id="scatter-details">
    <summary class="chart-summary">
      <div class="chart-summary-content">
        <span class="chart-summary-title">📊 Map Team Strength (Bayesian Posterior)</span>
        <span class="chart-summary-subtitle">Offensive vs Defensive</span>
      </div>
    </summary>

    <div class="chart-wrapper">
      <div class="button-list">
        <button
          class="button-secondary"
          @click="resetZoom"
          title="Reset Zoom"
          selenium-id="reset-scatter-button"
        >
          Reset View
        </button>
      </div>
      <apexchart
        ref="chartRef"
        type="scatter"
        height="500"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </details>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import type { Team } from "../../models/SportsDataModels/team";
import type { LeagueRound } from "../../models/SportsDataModels/leagueRound";

const props = defineProps<{
  teamStrengths: TeamStrength[];
  teams: Team[];
  leagueRounds: LeagueRound[];
}>();
const chartRef = ref<any>(null);

const resetZoom = () => {
  if (chartRef.value) {
    chartRef.value.updateOptions({
      xaxis: { min: undefined, max: undefined },
      yaxis: { min: undefined, max: undefined },
    });
  }
};

function getTeamNameById(id?: string): string {
  return props.teams.find((team) => team.id === id)?.name || "UNKNOWN";
}
function getRoundNameById(id?: string): string {
  if (id === null) {
    return "Start";
  }
  return `Round of ${props.leagueRounds.find((lr) => lr.id === id)?.round}`;
}
function getRoundNumberById(id?: string): string {
  if (id === null) {
    return "Start";
  }
  return `${props.leagueRounds.find((lr) => lr.id === id)?.round}`;
}
const leagueAvg = computed(() => {
  if (!props.teamStrengths.length) return 1.5;
  const totalOffensive = props.teamStrengths.reduce(
    (sum, t) => sum + t.posterior.offensive,
    0
  );
  return parseFloat((totalOffensive / props.teamStrengths.length).toFixed(2));
});

const series = computed(() => [
  {
    name: "Teams",
    data: props.teamStrengths.map((t) => ({
      x: parseFloat(t.posterior.offensive.toFixed(2)),
      y: parseFloat(t.posterior.defensive.toFixed(2)),
      teamName:
        getTeamNameById(t.teamId) + " - " + getRoundNameById(t.roundId ?? undefined),
      roundId: "round:" + getRoundNumberById(t.roundId ?? undefined),
      roundIdTeamId: "round:" + t.roundId + "^^team:" + t.teamId,
    })),
  },
]);

const chartOptions = computed(() => ({
  chart: {
    type: "scatter",
    zoom: { enabled: true, type: "xy" },
    toolbar: { show: false },
    fontFamily: "inherit",
    background: "transparent",
    foreColor: "var(--color-text-secondary)",
    events: {
      dataPointSelection: function (event: any, chartContext: any, config: any) {
        const seriesIndex = config.seriesIndex;
        const dataPointIndex = config.dataPointIndex;
        const pointData = config.w.config.series[seriesIndex].data[dataPointIndex];

        if (pointData && pointData.roundIdTeamId) {

          const detailsElement = document.getElementById(
            pointData.roundId
          ) as HTMLDetailsElement | null;
          if (detailsElement) {
            detailsElement.open = true;

            setTimeout(() => {
              const targetElement = document.getElementById(pointData.roundIdTeamId);

              if (targetElement) {
                targetElement.scrollIntoView({
                  behavior: "smooth", 
                  block: "center",
                  inline: "nearest",
                });

                targetElement.style.transition = "background-color 2s";
                const originalBg = targetElement.style.backgroundColor;
                targetElement.style.backgroundColor = "rgba(255, 255, 0, 0.3)";

                setTimeout(() => {
                  targetElement.style.backgroundColor = originalBg;
                }, 1500);
              }
            }, 100); // DOM render
          }
        }
      },
    },
  },
  colors: ["var(--color-accent-blue)"],
  grid: {
    borderColor: "var(--color-grid)",
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
  xaxis: {
    title: {
      text: "(Posterior Offensive)",
      style: { color: "var(--color-text-main)" },
    },
    tickAmount: 5,
    labels: {
      formatter: (val: number) => val.toFixed(2),
      style: { colors: "var(--color-text-secondary)" },
    },
    axisBorder: { color: "var(--color-grid)" },
    axisTicks: { color: "var(--color-grid)" },
  },
  yaxis: {
    title: {
      text: "(Posterior Defensive)",
      style: { color: "var(--color-text-main)" },
    },
    tickAmount: 5,
    reversed: true,
    labels: {
      formatter: (val: number) => val.toFixed(2),
      style: { colors: "var(--color-text-secondary)" },
    },
  },
  annotations: {
    xaxis: [
      {
        x: leagueAvg.value,
        borderColor: "var(--color-text-secondary)",
        strokeDashArray: 4,
        opacity: 0.5,
        label: {
          text: "Avg offensive",
          style: {
            background: "var(--color-surface-sections)",
            color: "var(--color-text-secondary)",
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
          },
        },
      },
    ],
    yaxis: [
      {
        y: leagueAvg.value,
        borderColor: "var(--color-text-secondary)",
        strokeDashArray: 4,
        opacity: 0.5,
        label: {
          text: "Avg defensive",
          style: {
            background: "var(--color-surface-sections)",
            color: "var(--color-text-secondary)",
            padding: { left: 5, right: 5, top: 2, bottom: 2 },
          },
        },
      },
    ],
  },
  tooltip: {
    custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
      const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];
      return `
        <div class="custom-tooltip">
          <div class="tooltip-header">${data.teamName}</div>
          <div class="tooltip-row attack">
            <span>⚔️ Offensive:</span> <b>${data.x}</b>
          </div>
          <div class="tooltip-row defense">
            <span>🛡️ Defence:</span> <b>${data.y}</b>
          </div>
        </div>
      `;
    },
  },
  markers: {
    size: 6,
    strokeWidth: 1,
    strokeColors: "var(--color-surface)",
    hover: { size: 8 },
  },
}));
</script>

<style scoped>

:deep(.custom-tooltip) {
  padding: 0.75rem;
  background-color: var(--color-surface-contrast);
  border: 1px solid var(--color-grid);
  border-radius: 0.25rem;
  box-shadow: 0 4px 6px var(--color-shadow-app);
  font-family: inherit;
}

:deep(.tooltip-header) {
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--color-text-main);
  border-bottom: 1px solid var(--color-grid);
  padding-bottom: 0.25rem;
}

:deep(.tooltip-row) {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.875rem;
}

:deep(.tooltip-row.attack) {
  color: var(--color-home-team);
}

:deep(.tooltip-row.defense) {
  color: var(--color-heatmap-max);
}

.custom-chart-details[open] .chart-wrapper {
  animation: sweep 0.3s ease-in-out;
}

@keyframes sweep {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
