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
      <h2>Simulated matches:</h2>
    </article>
  </section>
  <section>
    <div v-for="matchRound in iterationResultState.data?.simulatedMatchRounds">
      <MatchResultItem
        :match-round="matchRound"
        :teams="teams"
        :home-team-strength="
          iterationResultState.data?.teamStrengths?.find(
            (t) =>
              t.teamId === matchRound.homeTeamId &&
              t.roundId === matchRound.roundId
          )
        "
        :away-team-strength="
          iterationResultState.data?.teamStrengths?.find(
            (t) =>
              t.teamId === matchRound.awayTeamId &&
              t.roundId === matchRound.roundId
          )
        "
        :league-rounds="leagueRounds"
      />
    </div>
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
import MatchResultItem from "./MatchResultItem.vue";
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

  // Jeśli leagueId jest znane → dopiero wtedy ładuj rundy
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

watch(
  [() => props.id, () => props.simulation_id],
  async () => {
    if (props.id && props.simulation_id) {
      await ensureData();
    }
  },
  { immediate: true }
);
</script>
