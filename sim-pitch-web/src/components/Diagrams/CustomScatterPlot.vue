<template>
  <section class="chart-section">
    <details open class="custom-details" selenium-id="scatter-details">
      <summary class="custom-summary">
        <div class="summary-content">
          <span class="summary-title">📊 Map Team Strength (Bayesian Posterior)</span>
          <span class="summary-subtitle">Offensive vs Defensive</span>
        </div>
        <svg class="chevron" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </summary>
      
      <div class="chart-wrapper">
        <apexchart 
          type="scatter" 
          height="500" 
          :options="chartOptions" 
          :series="series"
        ></apexchart>
      </div>
    </details>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TeamStrength } from '../../models/Iterations/teamStrength'; 
import type { Team } from '../../models/SportsDataModels/team';

const props = defineProps<{
  teamStrengths: TeamStrength[];
  teams: Team[];
}>();
const emit = defineEmits<{
  (e: 'point-clicked', roundId: string): void 
}>();

function getTeamNameById(id?: string): string {
  return props.teams.find((team) => team.id === id)?.name || "UNKNOWN";
}
const leagueAvg = computed(() => {
  if (!props.teamStrengths.length) return 1.5;
  const totalOffensive = props.teamStrengths.reduce((sum, t) => sum + t.posterior.offensive, 0);
  return parseFloat((totalOffensive / props.teamStrengths.length).toFixed(2));
});

const series = computed(() => [{
  name: "Teams",
  data: props.teamStrengths.map(t => ({
    x: parseFloat(t.posterior.offensive.toFixed(2)),
    y: parseFloat(t.posterior.defensive.toFixed(2)),
    teamName: getTeamNameById(t.teamId) + t.roundId,
    roundId: t.roundId
  }))
}]);
console.log(props.teamStrengths.filter(x => x.roundId === "52fb5204-9200-492e-8656-f7d6142c1b33" && x.teamId === "b7e4d1a3-9c6f-4e0a-8b2d-3f1c5e7a9d8b"))
const chartOptions = computed(() => ({
  chart: {
    type: 'scatter',
    zoom: { enabled: true, type: 'xy' },
    toolbar: { show: false },
    fontFamily: 'inherit',
    background: 'transparent',
    foreColor: 'var(--color-text-secondary)',
    events: {
      dataPointSelection: function(event: any, chartContext: any, config: any) {
        const seriesIndex = config.seriesIndex;
        const dataPointIndex = config.dataPointIndex;
        const pointData = config.w.config.series[seriesIndex].data[dataPointIndex];

        if (pointData && pointData.roundId) {
          emit('point-clicked', pointData.roundId);
          
          console.log(`Kliknięto roundId: ${pointData.roundId}`);
        }
      }
    }
  },
  colors: ['var(--color-accent-blue)'], 
  grid: {
    borderColor: 'var(--color-grid)',
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
  xaxis: {
    title: { 
      text: '(Posterior Offensive)',
      style: { color: 'var(--color-text-main)' }
    },
    tickAmount: 5,
    labels: { 
      formatter: (val: number) => val.toFixed(2),
      style: { colors: 'var(--color-text-secondary)' }
    },
    axisBorder: { color: 'var(--color-grid)' },
    axisTicks: { color: 'var(--color-grid)' }
  },
  yaxis: {
    title: { 
      text: '(Posterior Defensive)',
      style: { color: 'var(--color-text-main)' }
    },
    tickAmount: 5,
    reversed: true, 
    labels: { 
      formatter: (val: number) => val.toFixed(2),
      style: { colors: 'var(--color-text-secondary)' }
    }
  },
  annotations: {
    xaxis: [{
      x: leagueAvg.value,
      borderColor: 'var(--color-text-secondary)',
      strokeDashArray: 4,
      opacity: 0.5,
      label: { 
        text: 'Avg offensive', 
        style: { 
          background: 'var(--color-surface-sections)', 
          color: 'var(--color-text-secondary)',
          padding: { left: 5, right: 5, top: 2, bottom: 2 }
        } 
      }
    }],
    yaxis: [{
      y: leagueAvg.value,
      borderColor: 'var(--color-text-secondary)',
      strokeDashArray: 4,
      opacity: 0.5,
      label: { 
        text: 'Avg defensive', 
        style: { 
          background: 'var(--color-surface-sections)', 
          color: 'var(--color-text-secondary)',
          padding: { left: 5, right: 5, top: 2, bottom: 2 }
        } 
      }
    }]
  },
  tooltip: {
    custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
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
    }
  },
  markers: { 
    size: 6, 
    strokeWidth: 1,
    strokeColors: 'var(--color-surface)',
    hover: { size: 8 } 
  }
}));
</script>

<style scoped>
.chart-section {
  width: 100%;
  padding: 1rem;
}

.custom-details {
  background-color: var(--color-surface);
  border: 1px solid var(--color-grid);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px var(--color-shadow-app);
}

.custom-summary {
  cursor: pointer;
  padding: 1rem;
  background-color: var(--color-surface-sections);
  border-bottom: 1px solid var(--color-grid);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
  list-style: none; /* Ukrywa domyślny trójkąt w niektórych przeglądarkach */
}

.custom-summary:hover {
  background-color: var(--color-button-secondary-hover-bg);
}

.custom-summary::-webkit-details-marker {
  display: none;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.summary-title {
  font-weight: bold;
  font-size: 1.125rem;
  color: var(--color-text-main);
}

.summary-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: normal;
}

.chevron {
  color: var(--color-text-secondary);
  transition: transform 0.3s;
}

.custom-details[open] .chevron {
  transform: rotate(180deg);
}

.chart-wrapper {
  padding: 1rem;
}

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

.custom-details[open] .chart-wrapper {
  animation: sweep .3s ease-in-out;
}

@keyframes sweep {
  0%    {opacity: 0; transform: translateY(-10px)}
  100%  {opacity: 1; transform: translateY(0)}
}
</style>
