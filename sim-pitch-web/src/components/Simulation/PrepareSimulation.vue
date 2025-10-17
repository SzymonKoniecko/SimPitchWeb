<template>
  <main>
    <section>
      <div v-if="simulationId">🧩 Simulation ID: {{ simulationId }}</div>
      <div v-if="loading">⏳ Loading...</div>
      <div v-else-if="error">❌ {{ error }}</div>
      <div v-if="loadingSimulation">⏳ Working simulation, wait..</div>
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
          <label for="leagueId">Choose league</label>
          <select id="leagueId" v-model="form.league_id">
            <option 
              v-for="league in leagues"
              :key="league.name"
              :value="league.id"
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

        <div class="actions">
          <button type="submit">Simulate</button>
          <button type="button" @click="resetForm">Reset</button>
        </div>

        <div v-if="simulationId">
          <router-link :to="{ name: 'SimulationItem', params: { id: simulationId }}" class="btn-primary">
            Check the simulation results
          </router-link>
        </div>
        <div v-if="status" class="status">
          {{ status }}
        </div>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { SeasonYear, seasonYearsOptions } from '../../models/seasonYear'
import { useSportsDataStore } from '../../stores/SportsDataStore'
import { fetchData } from '../../api/fetchData'
import { engineAPI } from '../../api/engine.api'
import ErrorEndpoint from '../Other/ErrorEndpoint.vue'
import type { simulationParams } from '../../models/simulationParams'

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
  seasonYears: [] as SeasonYear[],
  league_id: '',
  iterations: 1,
  league_round_id: null
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
  const payload: simulationParams = {
    SeasonYears: form.seasonYears,
    LeagueId: form.league_id,
    Iterations: form.iterations,
    LeagueRoundId: form.league_round_id ?? undefined
  }
  try {
    const result = await fetchData<any>(() => engineAPI.createSimulation(payload))
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

<style scoped>
main, section {
  max-width: 100%;
  overflow-x: hidden;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 480px;
  margin: 2rem auto;
  background: var(--color-bg-surface);
  border: 1px solid var(--color-grid);
  border-radius: 10px;
  padding: 2rem;
}
.field label {
  font-weight: 600;
  color: var(--color-text-primary);
}
.checkbox-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: var(--color-bg-surface-secondary);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
}
.actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.status {
  margin-top: 1rem;
  font-weight: 500;
  color: var(--color-accent-green);
}
</style>
