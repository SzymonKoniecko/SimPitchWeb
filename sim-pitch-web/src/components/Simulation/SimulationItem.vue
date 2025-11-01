<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { engineAPI } from "../../api/engine.api";
import { fetchData, type ApiState } from "../../api/fetchData";
import type { Simulation } from "../../models/Simulations/simulation";
import type { IterationPreview } from "../../models/Iterations/iterationPreview";
import ErrorEndpoint from "../Other/ErrorEndpoint.vue";
import { useSportsDataStore } from "../../stores/SportsDataStore";
import ScoreboardItem from "../Iteration/ScoreboardItem.vue";
import type { SimulationState } from "../../models/Simulations/simulationState";
import Pagination from "../Other/Pagination.vue";
import Filter from "../Other/Filter.vue";

defineOptions({ name: "SimulationItem" });
type Props = { id: string };
const props = defineProps<Props>();

const store = useSportsDataStore();
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);

const state = ref<ApiState<Simulation>>({
  loading: true,
  error: null,
  data: null,
});
const sortOption = ref("CreatedDate");
const condition = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = computed(
  () => state.value.data?.iterationPreviews?.totalCount ?? 0
);
const totalPages = computed(
  () => state.value.data?.iterationPreviews?.totalPages ?? 1
);

const ensureSportsData = async () => {
  if (!leagues.value.length) await store.loadLeagues();
  if (!teams.value.length) await store.loadTeams();
};

const loadSimulation = async () => {
  state.value = await fetchData<Simulation>(() =>
    engineAPI.SimulationController.getSimulationOverviews(
      props.id,
      currentPage.value,
      pageSize.value,
      sortOption.value,
      condition.value
    )
  );
};

const loadIterationPage = async (newPage: number) => {
  currentPage.value = newPage;
  state.value.loading = true;
  loadSimulation();
  state.value.loading = false;
};

const changePageSize = async (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  await loadSimulation();
};

const stopSimulation = async (id?: string) => {
  if (id != null && id != undefined && id !== "") {
    await fetchData<SimulationState>(() =>
      engineAPI.SimulationController.stopSimulation(id)
    );
    await loadSimulation();
  }
};

const changeSortingOption = async (newSortingOption: string) => {
  sortOption.value = newSortingOption;
  await loadSimulation();
};

const changeCondition = async (newCondition: string) => {
  condition.value = newCondition;
};

const getLeagueName = (id: string) =>
  leagues.value.find((t) => t.id === id)?.name ?? id;

const groupedPreviews = computed(() => {
  const previews = state.value.data?.iterationPreviews.items ?? [];
  const groups: Record<string, IterationPreview[]> = {};
  for (const p of previews) {
    if (p.scoreboardId !== null && p.scoreboardId !== undefined) {
      if (!groups[p.scoreboardId]) groups[p.scoreboardId] = [];
      groups[p.scoreboardId]!.push(p);
    }
  }

  for (const key in groups) {
    const group = groups[key];
    if (group) {
      group.sort((a, b) => a.rank - b.rank);
    }
  }

  return groups;
});

const groupedPreviewEntries = computed(() =>
  Object.entries(groupedPreviews.value)
);
onMounted(async () => {
  await ensureSportsData();
  await loadSimulation();
});
watch(
  () => props.id,
  async () => {
    await loadSimulation();
  }
);
</script>

<template>
  <div style="display: flex">
    <button
      @click="() => loadSimulation()"
      :aria-busy="state.loading"
      role="button"
      class="button-primary"
    >
      Reload
    </button>
    <br />
    <button
      @click="stopSimulation(state.data?.state.simulationId)"
      :aria-busy="state.loading"
      role="button"
      class="button-secondary"
    >
      Stop simulation
    </button>
  </div>
  <main class="container">
    <article v-if="state.loading" aria-busy="true">
      Loading simulation data...
    </article>
    <ErrorEndpoint v-else-if="state.error" :error="state.error" />

    <section v-else-if="state.data" class="container-content">
      <h2>Summary</h2>
      <details close class="details">
        <summary><strong>[-> Simulation Parameters <-]</strong></summary>
        <ul>
          <li>
            <strong>League:</strong>
            {{ getLeagueName(state.data.simulationParams.leagueId) }}
          </li>
          <li>
            <strong>Iterations:</strong>
            {{ state.data.simulationParams.iterations }}
          </li>
          <li>
            <strong>Seasons:</strong>
            {{ state.data.simulationParams.seasonYears.join(", ") }}
          </li>
        </ul>
      </details>
      <p><strong>Winners:</strong> {{ state.data.winnersSummary }}</p>
      <p>
        <strong>Completed iterations:</strong>
        {{ state.data.state.lastCompletedIteration }} /
        {{ state.data?.simulationParams.iterations }} ({{
          state.data?.state.progressPercent
        }}%)
      </p>
      <p>
        <strong>State:</strong> {{ state.data.state.state }} ---
        {{ new Date(state.data.state.updatedAt).toLocaleString() }}
      </p>
      <p>
        <strong>Simulated matches:</strong> {{ state.data.simulatedMatches }}
      </p>
      <p>
        <strong>Prior league strength:</strong>
        {{ state.data.priorLeagueStrength }}
      </p>

      <details open>
        <Pagination
          :total-items="totalCount"
          :page-size="pageSize"
          :current-page="currentPage"
          :total-pages="totalPages"
          @update:page="loadIterationPage"
          @update:pageSize="changePageSize"
        />
        <Filter
          :to-sort-option="sortOption"
          :condition="condition"
          @update:sorting-option="changeSortingOption"
          @update:condition="changeCondition"
        />
        <summary>
          <strong>Iteration Previews (grouped by scoreboard)</strong>
        </summary>

        <div
          v-for="([scoreboardId, items], index) in groupedPreviewEntries"
          :key="scoreboardId"
          class="scoreboard-block"
        >
          <h3 style="float: right">
            #{{ index + 1 + (currentPage - 1) * pageSize }}
          </h3>
          <small>Scoreboard: {{ scoreboardId }}</small>

          <ScoreboardItem
            :scoreboard_id="scoreboardId"
            variant="preview"
            :teams="teams"
            :iteration_preview="items"
          />

          <router-link
            :to="{
              name: 'IterationItem',
              params: { simulation_id: props.id, id: items[0]?.iterationId },
            }"
            role="button"
            class="button-secondary"
          >
            → Check complete iteration details
          </router-link>
        </div>
        <Pagination
          :total-items="totalCount"
          :page-size="pageSize"
          :current-page="currentPage"
          :total-pages="totalPages"
          @update:page="loadIterationPage"
          @update:pageSize="changePageSize"
        />
      </details>

      <footer style="margin-top: 1rem">
        <router-link to="/simulation" role="button" class="secondary">
          ← Back to list
        </router-link>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.scoreboard-block {
  margin-bottom: 2rem;
}
.container-content {
  margin-left: 30%;
  gap: 3rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 0.5rem;
  border-bottom: 1px solid var(--muted-border-color);
  text-align: left;
}

tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

.error {
  color: var(--del-color);
}
button {
  float: right;
}
.details {
  float: right;
  font-size: 125%;
}
</style>
