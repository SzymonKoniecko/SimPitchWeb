
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { SeasonYear, seasonYearsOptions } from '../../models/Consts/seasonYear'
import { useSportsDataStore } from '../../stores/SportsDataStore'
import { fetchData } from '../../api/fetchData'
import { engineAPI } from '../../api/engine.api'
import ErrorEndpoint from '../Other/ErrorEndpoint.vue'
import type { SimulationParams } from '../../models/Simulations/simulationParams'

defineOptions({ name: "PrepareSimulation"})

const sportsDataStore = useSportsDataStore()
const loadingSimulation = ref(false)
const errorSimulation = ref<string | null>(null)
const loading = computed(() => sportsDataStore.loading)
const error = computed(() => sportsDataStore.error)
const leagues = computed(() => sportsDataStore.leagues)
const leagueRounds = computed(() => sportsDataStore.leagueRounds)
const simulationId = ref('')

const form = reactive({
  title: `Simulation - ${new Date().toISOString()}`,
  seasonYears: [] as SeasonYear[],
  league_id: '',
  iterations: 1,
  league_round_id: null,
  createScoreboardOnCompleteIteration: true
})

const ensureData = async () => {
  if (!leagues.value || leagues.value.length === 0) {
    await sportsDataStore.loadLeagues()
  }
}

onMounted(async () => {
  await ensureData()
})

const status = ref('')

async function submitForm() {
  loadingSimulation.value = true
  errorSimulation.value = null
  status.value = ''
  simulationId.value = ''
  const payload: SimulationParams = {
    title: form.title,
    seasonYears: form.seasonYears,
    leagueId: form.league_id,
    iterations: form.iterations,
    leagueRoundId: form.league_round_id ?? undefined,
    createScoreboardOnCompleteIteration: form.createScoreboardOnCompleteIteration ?? false
  }
  try {
    const result = await fetchData<any>(() => engineAPI.SimulationController.createSimulation(payload))
    if (result.error) {
      errorSimulation.value = result.error
    } else {
      simulationId.value = result.data ?? ''
      status.value = 'Simulation has been sent!'
    }
  } catch (err: any) {
    errorSimulation.value = err.message || 'Unexpected error'
  } finally {
    loadingSimulation.value = false
  }
}

function resetForm() {
  form.seasonYears = []
  form.league_id = ''
  form.iterations = 1
  form.league_round_id = null
  status.value = ''
  errorSimulation.value = null
}
</script>
<template>
  <main>
    <section v-if="simulationId" class="simulation-result">
      <h5>Simulation ID: {{ simulationId }}</h5>
      <router-link :to="{ name: 'SimulationItem', params: { id: simulationId }}" class="button-link">
        <button type="submit" class="button-primary">Check the simulation results</button>
      </router-link>
    </section>

    <section>
      <div v-if="loading" class="info">⏳ Loading...</div>
      <ErrorEndpoint v-else-if="error" :error="error" />
      <div v-if="loadingSimulation" class="info"> Working simulation, please wait…</div>
      <ErrorEndpoint v-else-if="errorSimulation" :error="errorSimulation" />

      <form class="form" @submit.prevent="submitForm">
        <div class="field">
          <label>Choose seasons</label>
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
              {{ season }}
            </label>
          </div>
        </div>
        <div class="field">
          <label for="title">Set Title</label>
          <input v-model="form.title" selenium-id="input-title">
        </div>
        <div class="field">
          <label for="leagueId">Choose league</label>
          <select id="leagueId" v-model="form.league_id">
            <option 
              v-for="league in leagues"
              :key="league.name"
              :value="league.id"
              :selenium-id="league.name"
            >
              {{ league.name }}
            </option>
          </select>
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

        <div class="field">
          <label for="leagueRoundId">Optional: With specified round of league</label>
          <select id="leagueRoundId" v-model="form.league_round_id">
            <option 
              v-for="leagueRounds in leagueRounds"
              :key="leagueRounds.round"
              :value="leagueRounds.id"
            >
              {{ leagueRounds.round }}
            </option>
          </select>
        </div>
        <div class="field">
          <label for="leagueRoundId">Optional: Simulation should create scoreboards during the simulation?</label>
           <input
              type="checkbox"
              :value="form.createScoreboardOnCompleteIteration"
              v-model="form.createScoreboardOnCompleteIteration"
              selenium-id="input-create-scoreboards"
            />
        </div>
        <div class="actions">
          <button type="submit" class="button-primary">Simulate</button>
          <button type="button" class="button-secondary" @click="resetForm">Reset</button>
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

/* ---- SECTIONS ---- */
section {
  width: 100%;
  max-width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1.5rem;
}

.simulation-result {
  background-color: var(--color-surface-sections);
  border: 1px solid var(--color-grid);
  border-radius: 16px;
  padding: 1.75rem 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  float: center;
}
.simulation-result:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.4);
}

/* ---- FORM ---- */
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

/* ---- BUTTONS ---- */
button {
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s ease;
  padding: 0.75rem 1.5rem;
  border: none;
}

/* ---- INFO / STATUS ---- */
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

</style>
