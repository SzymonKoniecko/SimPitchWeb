<template>
  <details close class="custom-chart-details" selenium-id="teamForm-details">
    <summary class="custom-chart-summary">
      <div class="summary-content">
        <span class="summary-title">📈 Evolution of team form</span>
        <span class="summary-subtitle"> (Posterior vs Likelihood)</span>
      </div>
    </summary>

    <div
      class="p-4 flex flex-wrap gap-4 items-center border-b border-[color:var(--color-grid)] bg-[color:var(--color-surface-sections)]"
    >
      <div class="button-list">
        <button
          @click="metricMode = 'offensive'"
          :class="
            metricMode === 'offensive'
              ? 'button button-primary'
              : 'button button-secondary'
          "
          style="padding: 0.4rem 1rem; font-size: 0.9rem"
        >
          ⚔️ Attack
        </button>
        <button
          @click="metricMode = 'defensive'"
          :class="
            metricMode === 'defensive'
              ? 'button button-primary'
              : 'button button-secondary'
          "
          style="padding: 0.4rem 1rem; font-size: 0.9rem"
        >
          🛡️ Defense
        </button>
      </div>
      <hr />
      <div
        v-if="props.teamStrengths && props.teams && presentedTeams.length > 0"
      >
        <label for="team-select">Select team:</label>
        <select
          id="team-select"
          :value="selectedTeamId"
          @change="filterBy"
          selenium-id="teamform-select"
          style="
            padding: 0.4rem 2rem 0.4rem 1rem;
            border-radius: 0.5rem;
            background-color: var(--color-surface);
            color: var(--color-text-main);
            border: 1px solid var(--color-grid);
          "
        >
          <option
            v-for="team in presentedTeams"
            :key="team.id"
            :value="team.id"
            :selenium-id="`${team.name.replace(/\s+/g, '-').toLowerCase()}`"
          >
            {{ team.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="hasData" class="chart-wrapper">
      <apexchart
        type="line"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
    <div v-else class="p-4 text-center">No historical data for given team</div>
  </details>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import {
  getPresentedTeams,
  type Team,
} from "../../models/SportsDataModels/team";
import type { LeagueRound } from "../../models/SportsDataModels/leagueRound";

const props = defineProps<{
  teamStrengths: TeamStrength[];
  teams: Team[];
  leagueRounds: LeagueRound[];
}>();
function getRoundNameById(id?: string): string {
  if (id === null) {
    return "Start";
  }
  return `Round of ${props.leagueRounds.find((lr) => lr.id === id)?.round}`;
}

const metricMode = ref<"offensive" | "defensive">("offensive");

const hasData = computed(
  () => props.teamStrengths && props.teamStrengths.length > 0
);

const presentedTeams = computed(() =>
  getPresentedTeams(props.teams, props.teamStrengths)
);

const selectedTeamId = ref<string | undefined>(presentedTeams.value?.[0]?.id);

const filterBy = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedTeamId.value = target.value;
};

watch(presentedTeams, (newVal) => {
  if (newVal.length > 0 && !selectedTeamId.value) {
    selectedTeamId.value = newVal[0]?.id;
  }
});

const sortedHistory = computed(() => {
  if (!selectedTeamId.value) return [];

  return [...props.teamStrengths]
    .filter((x) => x.teamId === selectedTeamId.value)
    .sort((a, b) => {
      const dateA = a.lastUpdate ? new Date(a.lastUpdate).getTime() : 0;
      const dateB = b.lastUpdate ? new Date(b.lastUpdate).getTime() : 0;

      if (dateA === dateB) {
        if (!a.roundId) return -1;
        if (!b.roundId) return 1;
        return 0;
      }

      return dateA - dateB;
    });
});

const series = computed(() => [
  {
    name: "Posterior (Long term)",
    data: sortedHistory.value.map((h) => {
      const val =
        metricMode.value === "offensive"
          ? h.posterior.offensive
          : h.posterior.defensive;
      return parseFloat(val.toFixed(2));
    }),
  },
  {
    name: "Likelihood (Short term)",
    data: sortedHistory.value.map((h) => {
      const val =
        metricMode.value === "offensive"
          ? h.likelihood.offensive
          : h.likelihood.defensive;
      return parseFloat(val.toFixed(2));
    }),
  },
]);
const chartOptions = computed(() => ({
  chart: {
    type: "line",
    zoom: { enabled: false },
    toolbar: { show: false },
    fontFamily: "inherit",
    background: "transparent",
  },
  theme: {
    mode: "dark",
  },
  colors: ["#3b82f6", "#f59e0b"],
  stroke: {
    curve: "smooth",
    width: [3, 2],
    dashArray: [0, 5],
  },
  xaxis: {
    categories: sortedHistory.value.map((h) =>
      h.roundId === null || h.roundId === undefined
        ? "Start"
        : getRoundNameById(h.roundId)
    ),
    title: {
      text: "Timeline",
      style: { color: "var(--color-text-secondary)" },
    },
    labels: {
      rotate: -45,
      style: { fontSize: "10px", colors: "var(--color-text-secondary)" },
    },
  },
  yaxis: {
    title: {
      text:
        metricMode.value === "offensive"
          ? "Attack Strength"
          : "Defense Weakness",
      style: { color: "var(--color-text-secondary)" },
    },
    labels: {
      formatter: (val: number) => val.toFixed(2),
      style: { colors: "var(--color-text-secondary)" },
    },
    reversed: metricMode.value === "defensive",
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    labels: { colors: "var(--color-text-main)" },
  },
  tooltip: {
    theme: "dark",
    y: {
      formatter: (val: number) => val.toFixed(3),
    },
  },
  grid: {
    borderColor: "var(--color-grid)",
  },
}));
</script>

<style scoped>
.button-primary {
  background-color: var(--color-button);
  color: #fff;
  border: 1px solid var(--color-button);
}

.button-secondary {
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-grid);
}

.button-secondary:hover {
  background-color: var(--color-surface-sections);
  color: var(--color-text-main);
}
</style>
