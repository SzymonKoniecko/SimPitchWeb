<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  CURRENT_SEASON,
  SeasonYear,
  seasonYearsOptions,
} from "../../models/Consts/seasonYear";
import { useSportsDataStore } from "../../stores/SportsDataStore";
import { fetchData } from "../../api/fetchData";
import { engineAPI } from "../../api/engine.api";
import ErrorEndpoint from "../Other/ErrorEndpoint.vue";
import {
  randomInt,
  type SimulationParams,
} from "../../models/Simulations/simulationParams";
import { SimulationParametersShortTooltips as TT } from "../../models/Consts/tooltipTexts";
import Tooltip from "../Other/Tooltip.vue";
import { SimulationModelsOptions } from "../../models/Consts/simulationModel";

defineOptions({ name: "PrepareSimulation" });

const router = useRouter();
const sportsDataStore = useSportsDataStore();
const loadingSimulation = ref(false);
const errorSimulation = ref<string | null>(null);
const loading = computed(() => sportsDataStore.loading);
const error = computed(() => sportsDataStore.error);
const leagues = computed(() => sportsDataStore.leagues);
const leagueRounds = computed(() => sportsDataStore.leagueRounds);
const simulationId = ref("");

const scrollValErrors = ref<HTMLElement | null>(null);
const scrollStartedSim = ref<HTMLElement | null>(null);

const isRedirecting = ref(false);
const redirectCountdown = ref(2);

const form = reactive({
  title: `Simulation - ${new Date().toISOString()}`,
  seasonYears: [CURRENT_SEASON] as SeasonYear[],
  league_id: "",
  iterations: 1,
  league_round_id: null,
  target_league_round_id: null,
  createScoreboardOnCompleteIteration: true,

  seed: randomInt(0, 999999),

  gamesToReachTrust: 15, // 10–20
  confidenceLevel: 1.05, // 0.90–1.10
  noiseFactor: 0.12, // 0.10–0.15
  homeAdvantage: 1.05, // 1.03–1.07

  model: SimulationModelsOptions[1],
});

onMounted(async () => {
  if (!leagues.value || leagues.value.length === 0) {
    await sportsDataStore.loadLeagues();
  }
});

watch(
  () => form.league_id,
  async (newLeagueId) => {
    sportsDataStore.leagueRounds = [];

    form.league_round_id = null;
    form.target_league_round_id = null;

    if (!newLeagueId || newLeagueId === "") {
      return;
    }

    await sportsDataStore.loadLeagueRounds(CURRENT_SEASON, newLeagueId);

    await nextTick();
    if (!form.seasonYears.includes(CURRENT_SEASON)) {
      form.seasonYears.push(CURRENT_SEASON);
    }
  }
);

watch(
  () => form.seasonYears,
  async (val) => {
    if (!val.includes(CURRENT_SEASON)) {
      await nextTick();
      if (!form.seasonYears.includes(CURRENT_SEASON)) {
        form.seasonYears.push(CURRENT_SEASON);
      }
    }
  },
  { deep: true }
);

const status = ref("");
const validationErrors = ref<string[]>([]);

function validateForm(): boolean {
  const newErrors: string[] = [];

  if (!form.title || form.title.trim().length < 3) {
    newErrors.push("Title must have at least 3 characters");
  }
  if (!form.league_id) {
    newErrors.push("You must select a league");
  }
  if (!form.seasonYears || form.seasonYears.length === 0) {
    newErrors.push("Select at least one season");
  }
  if (!form.iterations || form.iterations < 1) {
    newErrors.push("Iterations must be at least 1");
  }

  validationErrors.value = newErrors;
  return newErrors.length === 0;
}

async function scrollToValidationSection() {
  // Wait for DOM update to ensure validation error list is rendered
  await nextTick();
  if (scrollValErrors.value) {
    scrollValErrors.value.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

async function scrollToStartedSimulation() {
  await nextTick();
  if (scrollStartedSim.value) {
    scrollStartedSim.value.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}

async function submitForm() {
  if (!validateForm()) {
    scrollToValidationSection();
    return;
  }

  loadingSimulation.value = true;
  errorSimulation.value = null;
  status.value = "";
  simulationId.value = "";
  isRedirecting.value = false;
  redirectCountdown.value = 2;

  const payload: SimulationParams = {
    title: form.title,
    seasonYears: form.seasonYears,
    leagueId: form.league_id,
    iterations: form.iterations,
    leagueRoundId: form.league_round_id ?? undefined,
    targetLeagueRoundId: form.target_league_round_id ?? undefined,
    createScoreboardOnCompleteIteration:
      form.createScoreboardOnCompleteIteration ?? false,
    seed: form.seed,
    gamesToReachTrust: form.gamesToReachTrust,
    confidenceLevel: form.confidenceLevel,
    noiseFactor: form.noiseFactor,
    homeAdvantage: form.homeAdvantage,
    modelType: form.model?.toString(),
  };

  try {
    const result = await fetchData<any>(() =>
      engineAPI.SimulationController.createSimulation(payload)
    );

    if (result.error) {
      errorSimulation.value = result.error;
    } else {
      simulationId.value = result.data ?? "";
      status.value = "Simulation has been sent!";
      scrollToStartedSimulation();
    }
  } catch (err: any) {
    errorSimulation.value = err.message || "Unexpected error";
  } finally {
    loadingSimulation.value = false;
  }
}

function handleCheckResultsWithDelay() {
  if (isRedirecting.value) return;

  isRedirecting.value = true;
  redirectCountdown.value = 2;

  const interval = setInterval(() => {
    redirectCountdown.value--;
    if (redirectCountdown.value <= 0) {
      clearInterval(interval);
      router.push({
        name: "SimulationItem",
        params: { id: simulationId.value },
      });
    }
  }, 1000);
}

function resetForm() {
  form.seasonYears = [CURRENT_SEASON];
  form.league_id = "";
  form.iterations = 1;
  form.league_round_id = null;
  form.target_league_round_id = null;

  form.seed = randomInt(0, 999999);
  form.gamesToReachTrust = 15;
  form.confidenceLevel = 1.05;
  form.noiseFactor = 0.12;
  form.homeAdvantage = 1.05;

  status.value = "";
  errorSimulation.value = null;
  validationErrors.value = [];
  isRedirecting.value = false;
  simulationId.value = ""; // Reset simulation ID to show form buttons again
}
</script>

<template>
  <main>
    <h2 style="text-align: center" selenium-id="title-prepare-simulation">
      Prepare a new simulation
    </h2>
    <section v-if="simulationId" class="simulation-result">
      <h5 selenium-id="simulation-id-text">
        Simulation ID: {{ simulationId }}
      </h5>
    </section>

    <section>
      <div v-if="loading" class="info">⏳ Loading...</div>
      <ErrorEndpoint v-else-if="error" :error="error" />

      <!-- Moved loading indicator inside the button for smoother UX, removing separate text div -->
      <ErrorEndpoint v-else-if="errorSimulation" :error="errorSimulation" />

      <form class="form" @submit.prevent="submitForm">
        <div class="field">
          <label>Seasons used for team strength calculation</label>
          <h6>(Training Data Seasons)</h6>
          <div class="checkbox-list">
            <label
              v-for="season in seasonYearsOptions"
              :key="season"
              class="checkbox-item"
            >
              <input
                type="checkbox"
                :value="season"
                v-model="form.seasonYears"
              />
              <span v-if="season === CURRENT_SEASON">
                {{ season }} (Current season)
              </span>
              <span v-else>
                {{ season }}
              </span>
            </label>
          </div>
        </div>

        <!-- Scroll anchor for validation errors -->
        <div ref="scrollValErrors" class="scroll-anchor"></div>

        <div
          v-if="validationErrors && validationErrors.length > 0"
          class="validation-error"
        >
          <label>Validation errors:</label>
          <ul v-for="valError in validationErrors" :key="valError">
            <li>{{ valError }}</li>
          </ul>
        </div>

        <div class="field">
          <label for="title">Set Title</label>
          <input v-model="form.title" selenium-id="input-title" />
        </div>
        <div class="field">
          <label for="leagueId">Choose league</label>
          <select
            id="leagueId"
            v-model="form.league_id"
            selenium-id="league-select"
            name="league"
          >
            <option value="" disabled>Select a league</option>
            <option
              v-for="league in leagues"
              :key="league.id"
              :value="league.id"
              :selenium-id="`${league.name.replace(/\s+/g, '-').toLowerCase()}`"
            >
              {{ league.name }}
            </option>
          </select>
        </div>

        <div class="rounds-container">
          <div class="field" v-if="form.league_id !== ''">
            <label for="leagueRoundId"
              >Optional: All matches will be simulated from ->
            </label>
            <select id="leagueRoundId" v-model="form.league_round_id">
              <option value="">Select starting round</option>
              <option
                v-for="leagueRound in leagueRounds.sort(
                  (a, b) => a.round - b.round
                )"
                :key="leagueRound.round"
                :value="leagueRound.id"
                :selenium-id="`round:${leagueRound.round}`"
              >
                Round of {{ leagueRound.round }}
              </option>
            </select>
          </div>
          <div class="field" v-if="form.league_id !== ''">
            <label for="targetLeagueRoundId"
              >Optional: All matches will be simulated to ->
            </label>
            <select
              id="targetLeagueRoundId"
              v-model="form.target_league_round_id"
            >
              <option value="">Select ending round</option>
              <option
                v-for="leagueRound in leagueRounds.sort(
                  (a, b) => a.round - b.round
                )"
                :key="leagueRound.round"
                :value="leagueRound.id"
                :selenium-id="`round:${leagueRound.round}`"
              >
                Round of {{ leagueRound.round }}
              </option>
            </select>
          </div>
        </div>

        <div class="field">
          <label>Choose simulation model</label>
          <div class="checkbox-list">
            <label
              v-for="model in SimulationModelsOptions"
              :key="model"
              class="checkbox-item"
            >
              <input
                type="radio"
                :value="model"
                v-model="form.model"
                :selenium-id="`model-${model}`"
              />
              {{ model }}
            </label>
          </div>
        </div>
        <div class="field">
          <label for="iterations">Number of iterations</label>
          <input
            id="iterations"
            v-model.number="form.iterations"
            type="number"
            min="1"
            required
            selenium-id="input-iterations"
          />
        </div>

        <!-- SEED -->
        <div class="field">
          <Tooltip :text="TT.SEED_SHORT">
            <label>Seed</label>
          </Tooltip>
          <input
            type="number"
            v-model.number="form.seed"
            min="0"
            max="999999"
            selenium-id="seed"
          />
        </div>

        <!-- gamesToReachTrust -->
        <div class="field">
          <Tooltip :text="TT.GAMES_TO_REACH_TRUST_SHORT">
            <label
              >Games To Reach Trust:
              <label selenium-id="gamesToReachTrustLabel">{{
                form.gamesToReachTrust
              }}</label></label
            >
          </Tooltip>
          <input
            type="range"
            min="10"
            max="20"
            step="1"
            v-model.number="form.gamesToReachTrust"
            selenium-id="gamesToReachTrust"
          />
        </div>

        <!-- confidenceLevel -->
        <div class="field">
          <Tooltip :text="TT.CONFIDENCE_LEVEL_SHORT">
            <label
              >Confidence Level:
              <label selenium-id="confidenceLevelLabel">{{
                form.confidenceLevel
              }}</label></label
            >
          </Tooltip>
          <input
            type="range"
            min="0.90"
            max="1.10"
            step="0.01"
            v-model.number="form.confidenceLevel"
            selenium-id="confidenceLevel"
          />
        </div>

        <!-- noiseFactor -->
        <div class="field">
          <Tooltip :text="TT.NOISE_FACTOR_SHORT">
            <label
              >Noise Factor:
              <label selenium-id="noiseFactorLabel">{{
                form.noiseFactor
              }}</label></label
            >
          </Tooltip>
          <input
            type="range"
            min="0.10"
            max="0.15"
            step="0.01"
            v-model.number="form.noiseFactor"
            selenium-id="noiseFactor"
          />
        </div>

        <!-- homeAdvantage -->
        <div class="field">
          <Tooltip :text="TT.HOME_ADVANTAGE_SHORT">
            <label
              >Home Advantage:
              <label selenium-id="homeAdvantageLabel">{{
                form.homeAdvantage
              }}</label></label
            >
          </Tooltip>
          <input
            type="range"
            min="1.03"
            max="1.07"
            step="0.01"
            v-model.number="form.homeAdvantage"
            selenium-id="homeAdvantage"
          />
        </div>
        <div class="field">
          <label for="createScoreboards"
            >Optional: Simulation should create scoreboards during the
            simulation?</label
          >
          <input
            id="createScoreboards"
            type="checkbox"
            v-model="form.createScoreboardOnCompleteIteration"
            selenium-id="input-create-scoreboards"
          />
        </div>

        <div class="actions" v-if="!simulationId">
          <button
            type="submit"
            class="button-primary"
            :disabled="loadingSimulation"
          >
            <span v-if="loadingSimulation">Processing...</span>
            <span v-else>Simulate</span>
          </button>
          <button
            type="button"
            class="button-secondary"
            @click="resetForm"
            :disabled="loadingSimulation"
          >
            Reset
          </button>
        </div>

        <div v-if="simulationId" ref="scrollStartedSim">
          <hr />
          <h5>Simulation has been started!</h5>

          <button
            type="button"
            class="button-primary button-timer"
            :class="{ 'timer-active': isRedirecting }"
            selenium-id="simulation-result"
            @click="handleCheckResultsWithDelay"
            :disabled="isRedirecting"
          >
            <span v-if="!isRedirecting">Check the simulation results</span>
            <span v-else>Opening in {{ redirectCountdown }}s...</span>
          </button>

          <button
            type="button"
            class="button-secondary"
            style="margin-top: 1rem; width: 100%"
            @click="resetForm"
          >
            Start New Simulation
          </button>
        </div>
      </form>
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text-main);
}

section {
  width: 100%;
  max-width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
}

.form {
  background-color: var(--color-surface);
  border: 1px solid var(--color-grid);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 2. LAYOUT STABILITY FOR ROUNDS */
.rounds-container {
  min-height: 0;
  transition: min-height 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Ensures space is reserved or animated smoothly if needed, 
   but primarily groups inputs to avoid large jumps */

label {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
}

select,
input[type="number"] {
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  font-size: 1rem;
  background-color: var(--color-surface-sections);
  color: var(--color-text-main);
  border: 1px solid var(--color-grid);
  transition: border-color 0.2s, box-shadow 0.2s;
}

select:focus,
input:focus {
  border-color: var(--color-accent-blue);
  box-shadow: 0 0 0 3px rgba(41, 121, 255, 0.35);
  outline: none;
}

.checkbox-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.checkbox-item {
  background: var(--color-surface-sections);
  border: 1px solid var(--color-grid);
  border-radius: 8px;
  padding: 0.4rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}
.checkbox-item:hover {
  background: var(--color-accent-blue);
  color: #fff;
  transform: translateY(-1px);
}

button {
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s ease;
  padding: 0.75rem 1.5rem;
  border: none;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-timer {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 260px;
  position: relative;
  overflow: hidden;
}

.button-timer.timer-active {
  background-color: var(--color-accent-green, #4caf50);
  transform: scale(0.98);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: wait;
}

.scroll-anchor {
  scroll-margin-top: 2rem; /* Buffer for scrolling */
}

.status {
  color: var(--color-accent-green);
  font-weight: 600;
}

.info {
  color: var(--color-text-secondary);
}

.error {
  color: var(--color-accent-yellow);
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
