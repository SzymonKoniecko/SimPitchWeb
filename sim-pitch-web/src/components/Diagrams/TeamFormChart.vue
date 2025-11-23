<template>
  <details close class="custom-chart-details" selenium-id="teamForm-details">
    <summary class="custom-chart-summary">
      <div class="summary-content">
        <span>📈 Evolution of team form</span>
        <span class="summary-subtitle"> (Posterior vs Likelihood)</span>
      </div>
    </summary>
    <div class="button-list">
      <button @click="metricMode = 'offensive'" class="button-secondary">
        ⚔️ Attack
      </button>
      <button @click="metricMode = 'defensive'" class="button-secondary">
        🛡️ Defense
      </button>
    </div>
    <div v-if="hasData" class="chart-wrapper">
      <apexchart
        type="line"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
    <div v-else>No historical data for given team</div>
  </details>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { TeamStrength } from "../../models/Iterations/teamStrength"; // Dostosuj ścieżkę
import type { Team } from "../../models/SportsDataModels/team";

const props = defineProps<{
  teamStrengths: TeamStrength[]; // Tablica historycznych stanów JEDNEJ drużyny
  teams: Team[];
}>();

// Stan widoku: 'offensive' lub 'defensive'
const metricMode = ref<"offensive" | "defensive">("offensive");

const hasData = computed(
  () => props.teamStrengths && props.teamStrengths.length > 0
);

// --- PRZYGOTOWANIE DANYCH ---

const sortedHistory = computed(() => {
  // Sortujemy chronologicznie (jeśli backend tego nie gwarantuje)
  // Zakładamy, że lastUpdate lub roundId określa kolejność
  return [...props.teamStrengths].sort(
    (a, b) =>
      new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime()
  );
});

const series = computed(() => [
  {
    name: "Posterior (Długi termin)",
    data: sortedHistory.value.map((h) => {
      const val =
        metricMode.value === "offensive"
          ? h.posterior.offensive
          : h.posterior.defensive;
      return parseFloat(val.toFixed(2));
    }),
  },
  {
    name: "Likelihood (Krótka forma)",
    data: sortedHistory.value.map((h) => {
      const val =
        metricMode.value === "offensive"
          ? h.likelihood.offensive
          : h.likelihood.defensive;
      return parseFloat(val.toFixed(2));
    }),
  },
]);

// --- KONFIGURACJA WYKRESU ---

const chartOptions = computed(() => ({
  chart: {
    type: "line",
    zoom: { enabled: false },
    toolbar: { show: false },
    fontFamily: "inherit",
  },
  colors: ["#3b82f6", "#f59e0b"], // Niebieski (Posterior), Pomarańczowy (Likelihood)
  stroke: {
    curve: "smooth",
    width: [3, 2], // Posterior grubszy, Likelihood cieńszy
    dashArray: [0, 5], // Likelihood przerywaną linią
  },
  xaxis: {
    categories: sortedHistory.value.map((h) =>
      h.roundId ? `Runda ${h.roundId.substring(0, 4)}` : "Start"
    ), // Oś X: Rundy
    title: { text: "Kolejka (Round)" },
    labels: {
      rotate: -45,
      style: { fontSize: "10px" },
    },
  },
  yaxis: {
    title: {
      text: metricMode.value === "offensive" ? "Siła Ataku" : "Słabość Obrony",
    },
    labels: { formatter: (val: number) => val.toFixed(2) },
    reversed: metricMode.value === "defensive", // Obrona: niżej = lepiej, więc odwracamy oś Y
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
  markers: {
    size: 4,
    hover: { size: 6 },
  },
  tooltip: {
    y: {
      formatter: (val: number) => val.toFixed(3),
    },
  },
  annotations: {
    // Opcjonalnie: Linia średniej ligowej (np. 1.0 lub inna wartość jeśli masz dostęp)
    yaxis: [
      {
        y: 1.0, // Przykład: Średnia ligowa znormalizowana
        borderColor: "#9ca3af",
        strokeDashArray: 2,
        opacity: 0.5,
        label: {
          text: "Średnia ligowa",
          style: { color: "#fff", background: "#9ca3af" },
        },
      },
    ],
  },
}));
</script>

<style scoped>
.chart-wrapper {
  min-height: 350px;
}
</style>
