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
import type { Team } from "../../models/SportsDataModels/team";
import { SortingOption } from "../../models/Consts/sortingOption";
import type { SimulationTeamStats } from "../../models/Simulations/simulationTeamStats";
import HeatMap from "../Diagrams/HeatMap.vue";

defineOptions({ name: "SimulationItem" });
type Props = { id: string };
const props = defineProps<Props>();

const store = useSportsDataStore();
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);
const presentedTeams = ref<Team[]>([]);
const filterValue = ref("Any");

const simulationState = ref<ApiState<Simulation>>({
  loading: true,
  error: null,
  data: null,
});
const simulationTeamStatsState = ref<ApiState<SimulationTeamStats[]>>({
  loading: true,
  error: null,
  data: null,
});

const sortOption = ref("CreatedDate");
const order = ref<"Descending" | "Ascending">("Descending");
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = computed(
  () => simulationState.value.data?.iterationPreviews?.totalCount ?? 0
);
const totalPages = computed(
  () => simulationState.value.data?.iterationPreviews?.totalPages ?? 1
);

const ensureSportsData = async () => {
  if (!leagues.value.length) await store.loadLeagues();
  if (!teams.value.length) await store.loadTeams();
};

const loadSimulation = async () => {
  simulationState.value = await fetchData<Simulation>(() =>
    engineAPI.SimulationController.getSimulationOverviews(
      props.id,
      currentPage.value,
      pageSize.value,
      sortOption.value,
      mapOrder(order.value)
    )
  );
  simulationTeamStatsState.value = await fetchData<SimulationTeamStats[]>(() =>
    engineAPI.SimulationStatsController.getSimulationTeamStats(props.id)
  );
};

const loadIterationPage = async (newPage: number) => {
  currentPage.value = newPage;
  simulationState.value.loading = true;
  loadSimulation();
  simulationState.value.loading = false;
};

const changePageSize = async (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  await loadSimulation();
};

const setFilteringByTeam = (teamId: string) => {
  filterValue.value = teamId;
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
  if (sortOption.value !== SortingOption.DynamicValue) {
    await loadSimulation();
    filterValue.value = "Any";
  }
};

const changeOrder = async (newOrder: "Descending" | "Ascending") => {
  order.value = newOrder;
  await loadSimulation();
};

const mapOrder = (newOrder: "Descending" | "Ascending"): "DESC" | "ASC" => {
  return newOrder === "Descending" ? "DESC" : "ASC";
};

const getLeagueName = (id: string) =>
  leagues.value.find((l) => l.id === id)?.name ?? id;

function getTeamById(id: string): boolean {
  return presentedTeams.value.some((team) => team.id === id);
}

function addTeamIfNotPresented(teamId: string) {
  if (!getTeamById(teamId)) {
    const teamToAdd = teams.value.find((team) => team.id === teamId);
    if (teamToAdd) {
      presentedTeams.value.push(teamToAdd);
    }
  }
}

const groupedPreviews = computed(() => {
  const previews = simulationState.value.data?.iterationPreviews.items ?? [];
  const groups: Record<string, IterationPreview[]> = {};
  for (const p of previews) {
    if (p.scoreboardId !== null && p.scoreboardId !== undefined) {
      if (!groups[p.scoreboardId]) groups[p.scoreboardId] = [];
      groups[p.scoreboardId]!.push(p);
    }
    addTeamIfNotPresented(p.teamId);
  }
  if (filterValue.value !== "Any") {
    const teamId = filterValue.value;
    for (const key in groups) {
      const hasTeam = groups[key]?.some((item) => item.teamId === teamId);
      if (!hasTeam) {
        delete groups[key]; // usuń całą grupę, jeśli nie zawiera danego teamId
      }
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
  <main>
      <div class="button-list">
        <button
          @click="() => loadSimulation()"
          :aria-busy="simulationState.loading"
          role="button"
          class="button-primary"
        >
          Reload
        </button>
        <br />
        <button
          @click="stopSimulation(simulationState.data?.state.simulationId)"
          :aria-busy="simulationState.loading"
          role="button"
          class="button-secondary"
        >
          Stop simulation
        </button>
      </div>
      <article v-if="simulationState.loading" aria-busy="true">
        Loading simulation data...
      </article>
      <ErrorEndpoint
        v-else-if="simulationState.error"
        :error="simulationState.error"
      />
      <ErrorEndpoint
        v-else-if="simulationTeamStatsState.error"
        :error="simulationTeamStatsState.error"
      />
      <section v-else-if="simulationState.data" class="container-content">
        <h2>Summary</h2>
        <details close class="details">
          <summary><strong>[-> Simulation Parameters <-]</strong></summary>
          <ul>
            <li>
              <strong>League:</strong>
              {{
                getLeagueName(simulationState.data.simulationParams.leagueId)
              }}
            </li>
            <li>
              <strong>Iterations:</strong>
              {{ simulationState.data.simulationParams.iterations }}
            </li>
            <li>
              <strong>Seasons:</strong>
              {{ simulationState.data.simulationParams.seasonYears.join(", ") }}
            </li>
            <li>
              <strong>Created scoreboards during the simulation? -></strong>
              {{
                simulationState.data.simulationParams
                  .createScoreboardOnCompleteIteration
              }}
            </li>
          </ul>
        </details>
        <p>
          <strong>Winners:</strong> {{ simulationState.data.winnersSummary }}
        </p>
        <p>
          <strong>Completed iterations:</strong>
          {{ simulationState.data.state.lastCompletedIteration }} /
          {{ simulationState.data?.simulationParams.iterations }} ({{
            simulationState.data?.state.progressPercent
          }}%)
        </p>
        <p>
          <strong>State:</strong> {{ simulationState.data.state.state }} ---
          {{ new Date(simulationState.data.state.updatedAt).toLocaleString() }}
        </p>
        <p>
          <strong>Simulated matches:</strong>
          {{ simulationState.data.simulatedMatches }}
        </p>
        <p>
          <strong>Prior league strength:</strong>
          {{ simulationState.data.priorLeagueStrength }}
        </p>
        <HeatMap
          v-if="simulationTeamStatsState?.data && teams?.length"
          :simulation-team-stats="simulationTeamStatsState.data"
        />
        <ScoreboardItem
          variant="simulation_averange"
          :teams="teams"
          :simulation-team-stats="simulationTeamStatsState?.data ?? undefined"
        />
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
            :variant="`SimulationItem`"
            :to-sort-option="sortOption"
            :order="order"
            :filterDynamicValue="presentedTeams"
            @update:sorting-option="changeSortingOption"
            @update:order="changeOrder"
            @update:filter-by="setFilteringByTeam"
          />
          <summary>
            <strong>Iteration Previews (grouped by scoreboard)</strong>
          </summary>

          <div
            v-for="[scoreboardId, items] in groupedPreviewEntries"
            :key="scoreboardId"
            class="scoreboard-block"
          >
            <h3 style="float: right">#{{ items[0]?.iterationIndex }}</h3>
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

        <footer>
          <router-link to="/simulation" role="button" class="secondary">
            ← Back to list
          </router-link>
        </footer>
      </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  min-width: 100%;
  flex-direction: column;
  gap: 1rem;
  border-bottom: 1px solid var(--color-grid);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}
.button-list {
  display: flex;
  background-color: var(--color-surface-sections);
  justify-content: space-between;
  box-sizing: border-box;
  padding: 1rem;
}
.container-content {
  padding: 1rem;
}
/*


table {
}

th,
td {
  border-bottom: 1px solid var(--muted-border-color);
  text-align: left;
}

tr:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
*/

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
