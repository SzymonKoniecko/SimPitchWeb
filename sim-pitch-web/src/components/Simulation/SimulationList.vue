<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { engineAPI } from "../../api/engine.api";
import { fetchData, type ApiState } from "../../api/fetchData";
import type { SimulationOverviewList } from "../../models/Simulations/simulationOverview";
import ErrorEndpoint from "../Other/ErrorEndpoint.vue";
import { useSportsDataStore } from "../../stores/SportsDataStore";
import type { SimulationState } from "../../models/Simulations/simulationState";
import Pagination from "../Other/Pagination.vue";
import { SortingOption } from "../../models/Consts/sortingOption";
import Filter from "../Other/Filter.vue";

defineOptions({ name: "SimulationList" });

const state = ref<ApiState<SimulationOverviewList>>({
  loading: true,
  error: null,
  data: null,
});

const store = useSportsDataStore();
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);

const currentPage = ref(1);
const pageSize = ref(5);
const totalCount = computed(() => state.value.data?.totalCount ?? 0);
const totalPages = computed(() => state.value.data?.totalPages ?? 1);
const sortOption = ref("CreatedDate");
const filterValue = ref("Any");
const order = ref<"Descending" | "Ascending">("Descending");

const simulationOverviews = computed(() => {
  if (
    sortOption.value === SortingOption.DynamicValue &&
    filterValue.value !== "Any"
  ) {
    return state.value.data?.items.filter(
      (x) => x.simulationParams.leagueId === filterValue.value
    );
  }
  return state.value.data?.items;
});

onMounted(async () => {
  await ensureSportsData();
  await loadSimulations();
});
const ensureSportsData = async () => {
  if (!leagues.value.length) await store.loadLeagues();
  if (!teams.value.length) await store.loadTeams();
};

const loadSimulations = async () => {
  state.value = await fetchData<SimulationOverviewList>(() =>
    engineAPI.SimulationController.getSimulations(
      currentPage.value,
      pageSize.value,
      sortOption.value,
      mapOrder(order.value)
    )
  );
};

const loadIterationPage = async (newPage: number) => {
  currentPage.value = newPage;
  state.value.loading = true;
  loadSimulations();
  state.value.loading = false;
};
const changePageSize = async (newSize: number) => {
  pageSize.value = newSize;
  currentPage.value = 1;
  await loadSimulations();
};
const setFilteringByLeague = (leagueId: string) => {
  filterValue.value = leagueId;
};

const stopSimulation = async (id: string) => {
  await fetchData<SimulationState>(() =>
    engineAPI.SimulationController.stopSimulation(id)
  );
  loadSimulations();
};
const checkStatus = (state: string): boolean => {
  if (state === "Pending" || state === "Running") return true;
  return false;
};

const changeSortingOption = async (newSortingOption: string) => {
  sortOption.value = newSortingOption;
  if (sortOption.value !== SortingOption.DynamicValue) {
    await loadSimulations();
    filterValue.value = "Any";
  }
};

const changeOrder = async (newOrder: "Descending" | "Ascending") => {
  order.value = newOrder;
  await loadSimulations();
};

const mapOrder = (newOrder: "Descending" | "Ascending"): "DESC" | "ASC" => {
  return newOrder === "Descending" ? "DESC" : "ASC";
};

//const getTeamName = (id: string) => teams.value.find(t => t.id === id)?.name ?? id
const getLeagueName = (id: string) =>
  leagues.value.find((t) => t.id === id)?.name ?? id;
</script>

<template>
  <h2 style="text-align: center" selenium-id="title-all-simulations">All simulations</h2>
  <main class="container">
    <header
      style="display: flex; justify-content: space-between; align-items: center"
    ></header>
    <div class="button-list">
      <button @click="loadSimulations" :aria-busy="state.loading" class="button-primary">
        Reload
      </button>
    </div>
    <section>
      <Filter
        :variant="`SimulationList`"
        :to-sort-option="sortOption"
        :order="order"
        :filterDynamicValue="leagues"
        @update:sorting-option="changeSortingOption"
        @update:order="changeOrder"
        @update:filter-by="setFilteringByLeague"
      />
    </section>
    <div v-if="state.loading" class="info">Loading simulations..., please wait…</div>
    <ErrorEndpoint v-else-if="state.error" :error="state.error" />

    <section v-else-if="state.error" class="error">Error: {{ state.error }}</section>
    <ul
      v-else-if="state.data && simulationOverviews && simulationOverviews.length > 0"
      class="simulation-list"
    >
      <Pagination
        :total-items="totalCount"
        :page-size="pageSize"
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:page="loadIterationPage"
        @update:pageSize="changePageSize"
      />
      <li v-for="(sim, index) in simulationOverviews" :key="sim.id">
        <section class="simulation">
          <header class="title-details" :selenium-id="`title-details-${index}`">
            <h2 style="text-align: center">{{ sim.simulationParams.title }}</h2>
            <small>State: {{ sim.state.state }}</small> <br />
            <small>League: {{ getLeagueName(sim.simulationParams.leagueId) }}</small>
            <br />
            <small>Created: {{ new Date(sim.createdDate).toLocaleDateString() }}</small>
            <br />
            <small
              >Completed iterations: {{ sim.state.lastCompletedIteration }} /
              {{ sim.simulationParams.iterations }}</small
            >
            <br />
            <small>Percentage: {{ sim.state.progressPercent }}%</small> <br />
            <small
              >Scoreboards are created during the simulation? ->
              {{ sim.simulationParams.createScoreboardOnCompleteIteration }}
              <-</small
            >
            <br />
            <div v-if="checkStatus(sim.state.state)" class="loader"></div>
          </header>
          <details close :selenium-id="`title-details-close-${index}`">
            <article class="details-article">
              <strong>Iterations:</strong> {{ sim.simulationParams.iterations }}
            </article>
            <article class="details-article">
              <strong>Seed:</strong> {{ sim.simulationParams.seed }}
            </article>
            <article class="details-article">
              <strong>Games to reach trust:</strong>
              {{ sim.simulationParams.gamesToReachTrust }}
            </article>
            <article class="details-article">
              <strong>Confidence level:</strong>
              {{ sim.simulationParams.confidenceLevel }}
            </article>
            <article class="details-article">
              <strong>Noise factor:</strong> {{ sim.simulationParams.noiseFactor }}
            </article>
            <article class="details-article">
              <strong>Home advantage:</strong> {{ sim.simulationParams.homeAdvantage }}
            </article>
            <article class="details-article">
              <strong>Season years used in simulation:</strong>
              <ul
                v-if="state.data && sim.simulationParams.seasonYears.length > 0"
                class="season-years-list"
              >
                <li v-for="seasonYear in sim.simulationParams.seasonYears">
                  <small
                    >{{ seasonYear }} -- Used strength:
                    {{
                      sim.leagueStrengths.find((x) => x.seasonYear == seasonYear)
                        ?.strength
                    }}</small
                  >
                </li>
              </ul>
            </article>
          </details>
          <div class="button-list">
            <router-link
              :to="{ name: 'SimulationItem', params: { id: sim.id } }"
              role="button"
              class="button-primary"
            >
              Check the results
            </router-link>
            <->
            <button
              @click="stopSimulation(sim.state.simulationId)"
              :aria-busy="state.loading"
              role="button"
              class="button-secondary"
            >
              Stop simulation
            </button>
          </div>
        </section>
      </li>
      <Pagination
        :total-items="totalCount"
        :page-size="pageSize"
        :current-page="currentPage"
        :total-pages="totalPages"
        @update:page="loadIterationPage"
        @update:pageSize="changePageSize"
      />
    </ul>

    <!-- EMPTY -->
    <article v-else>
      <h2>No simulations found.</h2>
    </article>
  </main>
</template>

<style scoped>
ul li {
  list-style: none;
}
.simulation-list {
  list-style: none;
  display: grid;
}
.error {
  color: var(--del-color);
}
.simulation .details {
  background-color: var(--color-grid);
}
.simulation {
  color: var(--color-text-main);
}
.details-article {
  display: flex;
  flex-wrap: column;
  color: var(--color-text-secondary);
}
.season-years-list {
  color: var(--color-text-secondary);
}
details {
  border: 1px var(--color-border);
  border-radius: 8px;
  padding: 0.5em 1em;
  transition: background-color 0.3s ease;
}
</style>
