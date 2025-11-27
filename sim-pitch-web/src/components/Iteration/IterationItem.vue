<template>
  <div class="button-list">
    <router-link
      :to="{ name: 'SimulationItem', params: { id: props.simulation_id } }"
      role="button"
      class="button-primary"
    >
      -> Go back to simulation summary
    </router-link>
  </div>
  <div>
    <div v-if="scoreboardState.loading" class="info">
      Loading scoreboard..., please wait…
    </div>
    <ErrorEndpoint
      v-else-if="scoreboardState.error"
      :error="scoreboardState.error"
    />
    <div v-if="iterationResultState.loading" class="info">
      Loading iteration result..., please wait…
    </div>
    <ErrorEndpoint
      v-else-if="iterationResultState.error"
      :error="iterationResultState.error"
    />
  </div>
  <section>
    <h2>
      Iteration number:
      <strong> #{{ iterationResultState.data?.iterationIndex }}</strong>
    </h2>
    <article v-if="iterationResultState.data" class="iteration-info-article">
      <LegendInfo />
      <div>
        <CustomScatterPlot
          v-if="teamStrengths && teams"
          :team-strengths="teamStrengths.filter((t) => t.roundId !== null)"
          :teams="teams"
          :league-rounds="leagueRounds"
        />
        <TeamFormChart
          v-if="teamStrengths && teams"
          :team-strengths="teamStrengths"
          :teams="teams"
          :league-rounds="leagueRounds"
        />
      </div>
      <hr />
      <ul class="iteration-info">
        <li selenium-id="league-round">
          <p>
            <strong
              >Simulation started by round of
              {{
                getLeagueRoundNameById(
                  simulationOverviewState.data?.simulationParams.leagueRoundId
                )
              }}</strong
            >
          </p>
        </li>
        <li selenium-id="number-simulated-matches">
          <p>
            <strong>Number of simulated matches: </strong
            >{{ iterationResultState.data.simulatedMatchRounds.length }}
          </p>
        </li>
        <li>
          <p>
            <strong>Start time: </strong
            >{{ iterationResultState.data.startDate }}
          </p>
        </li>
        <li>
          <p>
            <strong>Execution time: </strong
            >{{ iterationResultState.data.executionTime }}
          </p>
        </li>
      </ul>
    </article>
  </section>
  <div class="scoreboard">
    <ScoreboardItem
      variant="complete_details"
      :teams="teams"
      :scoreboard="scoreboardState.data?.[0]"
      :simulation-team-stats="simulationTeamStatsState.data"
    />
  </div>
  <section>
    <article v-if="scoreboardState.data">
      <h2>Simulated rounds 0/0:</h2>
    </article>
  </section>
  <section>
    <MatchResultItemList
      v-if="
        iterationResultState.data?.simulatedMatchRounds &&
        iterationResultState.data?.teamStrengths
      "
      :simulated-match-rounds="iterationResultState.data?.simulatedMatchRounds"
      :teams="teams"
      :team-strengths="iterationResultState.data?.teamStrengths"
      :league-rounds="leagueRounds"
    />
  </section>
</template>
<style scoped>
.iteration-info-article {
  background-color: var(--color-bg);
}
.iteration-info {
  list-style: none;
  padding: 0;
  margin-left: 2rem;
}

.iteration-info li {
  margin-bottom: 0.5rem;
}

.iteration-info strong {
  color: var(--color-text-main);
}

.iteration-info p {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text-secondary);
}
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { fetchData, type ApiState } from "../../api/fetchData";
import ErrorEndpoint from "../Other/ErrorEndpoint.vue";
import type { Scoreboard } from "../../models/Scoreboards/scoreboard";
import { useSportsDataStore } from "../../stores/SportsDataStore";
import { engineAPI } from "../../api/engine.api";
import ScoreboardItem from "./ScoreboardItem.vue";
import type { IterationResult } from "../../models/Iterations/iterationResult";
import MatchResultItemList from "./MatchResultItemList.vue";
import { useRoute } from "vue-router";
import type { SimulationTeamStats } from "../../models/Simulations/simulationTeamStats";
import CustomScatterPlot from "../Diagrams/CustomScatterPlot.vue";
import TeamFormChart from "../Diagrams/TeamFormChart.vue";
import LegendInfo from "../Other/LegendInfo.vue";
import { CURRENT_SEASON } from "../../models/Consts/seasonYear";
import type { SimulationOverview } from "../../models/Simulations/simulationOverview";
defineOptions({ name: "IterationItem" });
type Props = {
  id: string; // iteration_id
  simulation_id: string;
};
const props = defineProps<Props>();
const route = useRoute();
const state = computed(() => route.query.simulationState);
const simulationOverviewState = ref<ApiState<SimulationOverview>>({
  loading: true,
  error: null,
  data: null,
});
const scoreboardState = ref<ApiState<Scoreboard[]>>({
  loading: true,
  error: null,
  data: null,
});
const iterationResultState = ref<ApiState<IterationResult>>({
  loading: true,
  error: null,
  data: null,
});
const simulationTeamStatsState = ref<ApiState<SimulationTeamStats[]>>({
  loading: true,
  error: null,
  data: null,
});
const store = useSportsDataStore();
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);
const leagueRounds = computed(() => store.leagueRounds);
const teamStrengths = computed(
  () => iterationResultState.value.data?.teamStrengths
);
const loadSimulationOverview = async () => {
  simulationOverviewState.value = await fetchData<SimulationOverview>(() =>
    engineAPI.SimulationController.getSimulationOverview(props.simulation_id)
  );
};
const loadScoreboard = async () => {
  scoreboardState.value = await fetchData<Scoreboard[]>(() =>
    engineAPI.ScoreboardController.getScoreboard(props.simulation_id, props.id)
  );
};
const loadIterationResult = async () => {
  iterationResultState.value = await fetchData<IterationResult>(() =>
    engineAPI.IterationResultController.getIterationResult(props.id)
  );
  if (state.value === "Completed") {
    simulationTeamStatsState.value = await fetchData<SimulationTeamStats[]>(
      () =>
        engineAPI.SimulationStatsController.getSimulationTeamStats(
          props.simulation_id
        )
    );
  }
};
const leagueId = computed(
  () => simulationOverviewState.value.data?.simulationParams.leagueId
);
const getLeagueRoundNameById = (id?: string) => {
  if (id === undefined || id === null) return `last not played matches`;
  return store.leagueRounds.find((x) => x.id === id)?.round;
};
const ensureData = async () => {
  if (!props.simulation_id || !props.id) return;

  await loadSimulationOverview();
  await loadScoreboard();
  await loadIterationResult();
  if (!leagues.value?.length) {
    await store.loadLeagues();
  }
  if (!teams.value?.length) {
    await store.loadTeams();
  }
  if (
    leagueId.value &&
    (!leagueRounds.value || leagueRounds.value.length === 0)
  ) {
    await store.loadLeagueRounds(CURRENT_SEASON, leagueId.value);
  }
};

onMounted(async () => {
  await ensureData();
});

watch([() => props.id, () => props.simulation_id], async (newIds, oldIds) => {
  // only if the ID is reaaly changed
  if (oldIds && (newIds[0] !== oldIds[0] || newIds[1] !== oldIds[1])) {
    console.log("🔄 Props changed - reloading");
    // clearing cache simulation-specific data
    simulationOverviewState.value = { loading: true, error: null, data: null };
    scoreboardState.value = { loading: true, error: null, data: null };
    iterationResultState.value = { loading: true, error: null, data: null };
    simulationTeamStatsState.value = { loading: true, error: null, data: null };

    await ensureData();
  }
});
</script>
