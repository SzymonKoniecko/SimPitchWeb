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
import HeatMap, { type WinnerInfo } from "../Diagrams/HeatMap.vue"; // Importujemy typ z HeatMap
import { CURRENT_SEASON } from "../../models/Consts/seasonYear";
import { MapNumberToText } from "../../models/Consts/textHelper";

defineOptions({ name: "SimulationItem" });
type Props = { id: string };
const props = defineProps<Props>();

const store = useSportsDataStore();
const leagues = computed(() => store.leagues);
const teams = computed(() => store.teams);
const leagueRounds = computed(() => store.leagueRounds);
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
const scroll = ref<HTMLElement | null>(null);

const winnersData = ref<WinnerInfo[] | null>(null);

const totalCount = computed(
  () => simulationState.value.data?.iterationPreviews?.totalCount ?? 0
);
const totalPages = computed(
  () => simulationState.value.data?.iterationPreviews?.totalPages ?? 1
);

const ensureSportsData = async () => {
  if (!leagues.value.length) await store.loadLeagues();
  if (!teams.value.length) await store.loadTeams();
  if (
    !leagueRounds.value.length &&
    simulationState.value.data?.simulationParams.leagueId !== undefined
  )
    await store.loadLeagueRounds(
      CURRENT_SEASON,
      simulationState.value.data?.simulationParams.leagueId
    );
};

function scrollToSection() {
  scroll?.value?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const loadSimulation = async () => {
  simulationState.value.loading = true;
  sortOption.value === "dynamic" ? "CreatedDate" : sortOption.value,
    (simulationState.value = await fetchData<Simulation>(() =>
      engineAPI.SimulationController.getSimulationOverviews(
        props.id,
        currentPage.value,
        pageSize.value,
        sortOption.value,
        mapOrder(order.value)
      )
    ));
  if (
    simulationTeamStatsState.value.data === null &&
    simulationState.value.data?.state.state !== "Running"
  ) {
    simulationTeamStatsState.value = await fetchData<SimulationTeamStats[]>(
      () => engineAPI.SimulationStatsController.getSimulationTeamStats(props.id)
    );
  }
  simulationState.value.loading = false;
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
  scrollToSection();
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
  scrollToSection();
};

const changeOrder = async (newOrder: "Descending" | "Ascending") => {
  order.value = newOrder;
  await loadSimulation();
  scrollToSection();
};

const mapOrder = (newOrder: "Descending" | "Ascending"): "DESC" | "ASC" => {
  return newOrder === "Descending" ? "DESC" : "ASC";
};

const getLeagueName = (id: string) =>
  leagues.value.find((l) => l.id === id)?.name ?? id;
const getLeagueRoundNameById = (id?: string) => {
  if (
    id === undefined ||
    id === null ||
    id === "00000000-0000-0000-0000-000000000000"
  )
    return `Simulation is made for unplayed matches only`;
  return (
    "Started simulation by " +
    MapNumberToText(leagueRounds.value.find((x) => x.id === id)?.round ?? 0) +
    " round"
  );
};
const getTargetLeagueRoundNameById = (id?: string) => {
  if (
    id === undefined ||
    id === null ||
    id === "00000000-0000-0000-0000-000000000000"
  )
    return `Simulated all league rounds (to the end of the season)`;
  return (
    "Finished simulation to " +
    MapNumberToText(leagueRounds.value.find((x) => x.id === id)?.round ?? 0) +
    " round"
  );
};
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
        delete groups[key];
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

const setWinnersData = (data: WinnerInfo[]) => {
  winnersData.value = data;
};

onMounted(async () => {
  await ensureSportsData();
  await loadSimulation();
});
watch(
  () => props.id,
  async () => {
    await loadSimulation();
    await ensureSportsData();
  }
);
watch(
  () => simulationState.value.data?.simulationParams.leagueId,
  async () => {
    await ensureSportsData();
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
    <section v-else-if="simulationState.data">
      <h2 style="text-align: center" selenium-id="title-simulation-item">
        Summary of simulation
      </h2>
      <h3>
        <strong> {{ simulationState.data.simulationParams.title }}</strong>
      </h3>

      <section
        v-if="winnersData && winnersData.length >= 3"
        class="winners-podium"
      >
        <div class="podium-card rank-2">
          <div class="medal">🥈</div>
          <div class="team-name">{{ winnersData[1]?.teamName }}</div>
          <div class="probability">
            {{ (winnersData[1]?.probability! * 100).toFixed(1) }}%
            <span class="label">win prob</span>
          </div>
        </div>

        <div class="podium-card rank-1">
          <div class="crown">👑</div>
          <div class="medal">🥇</div>
          <div class="team-name">{{ winnersData[0]?.teamName }}</div>
          <div class="probability">
            {{ (winnersData[0]?.probability! * 100).toFixed(1) }}%
            <span class="label">win prob</span>
          </div>
        </div>

        <div class="podium-card rank-3">
          <div class="medal">🥉</div>
          <div class="team-name">{{ winnersData[2]?.teamName }}</div>
          <div class="probability">
            {{ (winnersData[2]?.probability! * 100).toFixed(1) }}%
            <span class="label">win prob</span>
          </div>
        </div>
      </section>

      <ul class="stats-grid">
        <li class="stat-card" selenium-id="iterations">
          <div class="stat-content">
            <strong>Completed iterations:</strong>
            <span class="stat-value">
              {{ simulationState.data.state.lastCompletedIteration }} /
              {{ simulationState.data?.simulationParams.iterations }}
              <span class="stat-sub"
                >({{ simulationState.data?.state.progressPercent }}%)</span
              >
            </span>
          </div>
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{
                width: simulationState.data?.state.progressPercent + '%',
              }"
            ></div>
          </div>
        </li>

        <li class="stat-card" selenium-id="state">
          <div class="stat-content">
            <strong>State:</strong>
            <span class="stat-value">
              {{ simulationState.data.state.state }}
            </span>
          </div>
          <div class="stat-footer">
            {{
              new Date(simulationState.data.state.updatedAt).toLocaleString()
            }}
          </div>
        </li>

        <li class="stat-card">
          <div class="stat-content">
            <strong>Simulated matches:</strong>
            <span class="stat-value">{{
              simulationState.data.simulatedMatches
            }}</span>
          </div>
        </li>
      </ul>

      <div>
        <div class="strengths-header">
          <strong>Strengths per each season:</strong>
          <span class="subtitle">(based on average goals calculations)</span>
        </div>

        <ul>
          <li
            v-for="strength in simulationState.data.leagueStrengths"
            :key="strength.seasonYear"
          >
            <span>{{ strength.seasonYear }}</span>
            <span> → </span>
            <span>strength {{ strength.strength }}</span>
          </li>
        </ul>
      </div>

      <section>
        <p selenium-id="league-round">
          <strong
            ><i>{{
              getLeagueRoundNameById(
                simulationState.data.simulationParams.leagueRoundId
              )
            }}</i></strong
          >
        </p>
        <p selenium-id="target-league-round">
          <strong
            ><i>{{
              getTargetLeagueRoundNameById(
                simulationState.data.simulationParams.targetLeagueRoundId
              )
            }}</i></strong
          >
        </p>
      </section>
      <section>
        <details close class="default-details" selenium-id="sim-params-details">
          <summary class="default-summary">
            <div class="default-summary-content">
              <strong class="default-summary-title"
                >Simulation Parameters.</strong
              >
              <span class="default-summary-subtitle"> Details</span>
            </div>
          </summary>
          <ul class="params-ul" selenium-id="sim-params-details-list">
            <li>
              <strong>League:</strong>
              {{
                getLeagueName(simulationState.data.simulationParams.leagueId)
              }}
            </li>
            <li>
              <strong>Model:</strong>
              {{ simulationState.data.simulationParams.modelType }}
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
              <strong>Seed:</strong>
              {{ simulationState.data.simulationParams.seed }}
            </li>
            <li>
              <strong>Games to reach trust:</strong>
              {{ simulationState.data.simulationParams.gamesToReachTrust }}
            </li>
            <li>
              <strong>Confidence level:</strong>
              {{ simulationState.data.simulationParams.confidenceLevel }}
            </li>
            <li>
              <strong>Noise factor:</strong>
              {{ simulationState.data.simulationParams.noiseFactor }}
            </li>
            <li>
              <strong>Home Advantage:</strong>
              {{ simulationState.data.simulationParams.homeAdvantage }}
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
      </section>

      <summary
        v-if="simulationTeamStatsState?.data == null"
        class="default-summary-subtitle"
      >
        Wait for completed simulation for heatmap
      </summary>

      <HeatMap
        v-else-if="simulationTeamStatsState?.data && teams?.length"
        :simulation-team-stats="simulationTeamStatsState.data"
        :teams="teams"
        @update:winners-data="setWinnersData"
      />

      <summary
        v-if="simulationTeamStatsState?.data == null"
        class="default-summary-subtitle"
      >
        Wait for completed simulation for averange stats
      </summary>
      <ScoreboardItem
        v-else-if="simulationTeamStatsState?.data && teams?.length"
        variant="simulation_averange"
        :teams="teams"
        :simulation-team-stats="simulationTeamStatsState?.data ?? undefined"
      />

      <section>
        <details class="default-details" open ref="scroll">
          <hr />
          <summary class="default-summary">
            <div class="default-summary-content">
              <span class="default-summary-title">Iteration Previews</span>
              <span class="default-summary-subtitle">
                (grouped by scoreboard)</span
              >
            </div>
          </summary>
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
          <div class="scoreboards-list">
            <div
              v-for="([scoreboardId, items], index) in groupedPreviewEntries"
              :key="scoreboardId"
              class="scoreboard-block"
            >
              <h3 style="float: right">#{{ items[0]?.iterationIndex }}</h3>

              <ScoreboardItem
                :scoreboard_id="scoreboardId"
                variant="preview"
                :teams="teams"
                :iteration_preview="items"
              />
              <div class="button-list">
                <router-link
                  :to="{
                    name: 'IterationItem',
                    params: {
                      simulation_id: props.id,
                      id: items[0]?.iterationId,
                    },
                    query: {
                      simulationState: simulationState.data?.state.state,
                    },
                  }"
                  role="button"
                  class="button-secondary"
                  :selenium-id="`iteration-${index}`"
                >
                  → Check complete iteration details
                </router-link>
              </div>
            </div>
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
      </section>
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

div {
  margin-top: 1rem;
}

.error {
  color: var(--del-color);
}

button {
  float: right;
}

.scoreboards-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.scoreboards-list > * {
  flex: 1 1 calc(50% - 1rem);
}

.winners-podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;
}

.podium-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
  background-color: var(--color-surface-sections);
  border: 1px solid var(--color-grid);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 140px;
  position: relative;
  transition: transform 0.3s ease;
}

.podium-card:hover {
  transform: translateY(-5px);
}

.rank-1 {
  order: 2;
  width: 160px;
  padding-bottom: 2.5rem;
  background: linear-gradient(
    to bottom,
    var(--color-surface-sections),
    rgba(255, 215, 0, 0.1)
  );
  border-color: rgba(255, 215, 0, 0.5);
  z-index: 2;
}

.rank-2 {
  order: 1;
  padding-bottom: 1.5rem;
}

.rank-3 {
  order: 3;
  padding-bottom: 1rem;
}

.medal {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.rank-1 .medal {
  font-size: 3.5rem;
}

.crown {
  position: absolute;
  top: -25px;
  font-size: 2rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.team-name {
  font-weight: 700;
  color: var(--color-text-main);
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.probability {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-accent-blue);
  display: flex;
  flex-direction: column;
}

.rank-1 .probability {
  color: var(--color-accent-yellow);
  font-size: 1.4rem;
}

.label {
  font-size: 0.7rem;
  color: var(--color-text-secondary);
  font-weight: normal;
  text-transform: uppercase;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.stat-card {
  background-color: var(--color-surface-sections);
  border: 1px solid var(--color-grid);
  border-radius: 8px;
  padding: 1rem 1.25rem;
  border-left: 4px solid var(--color-accent-blue);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.stat-content {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stat-card strong {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  color: var(--color-text-main);
  font-weight: 700;
  font-size: 1.1rem;
}

.stat-sub {
  font-size: 0.85rem;
  color: var(--color-text-third);
  font-weight: normal;
}

.stat-footer {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  font-style: italic;
  text-align: right;
}

.progress-bar {
  margin-top: 0.75rem;
  height: 4px;
  background-color: var(--color-grid);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-accent-green);
  transition: width 0.5s ease;
}

.strengths-header {
  margin-bottom: 1rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.strengths-header strong {
  color: var(--color-text-main);
  font-size: 1.05rem;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-style: italic;
}
</style>
