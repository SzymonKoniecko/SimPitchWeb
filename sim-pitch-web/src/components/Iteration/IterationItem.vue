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
      <ul class="iteration-info">
        <li>
          <p>
            <strong>League strength: </strong
            >{{ iterationResultState.data.leagueStrength }}
          </p>
        </li>
        <li>
          <p>
            <strong>Prior league strength: </strong
            >{{ iterationResultState.data.priorLeagueStrength }}
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
defineOptions({ name: "IterationItem" });
type Props = {
  id: string; // iteration_id
  simulation_id: string;
};
const props = defineProps<Props>();
const route = useRoute();
const state = computed(() => route.query.simulationState);
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
const store = useSportsDataStore();
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);

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
const simulationTeamStatsState = ref<ApiState<SimulationTeamStats[]>>({
  loading: true,
  error: null,
  data: null,
});

//const getLeagueName = (id: string) => leagues.value.find(t => t.id === id)?.name ?? id
const ensureData = async () => {
  if (!props.simulation_id || !props.id) return;
  if (!leagues.value || leagues.value.length === 0) {
    await store.loadLeagues();
  }
  if (!teams.value || teams.value.length === 0) {
    await store.loadTeams();
  }
  if (props.id || props.simulation_id != undefined) {
    await loadScoreboard();
    await loadIterationResult();
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
