<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { engineAPI } from '../../api/engine.api'
import { fetchData, type ApiState } from '../../api/fetchData'
import type { SimulationOverview } from '../../models/simulationOverview'
import ErrorEndpoint from '../Other/ErrorEndpoint.vue'
import { useSportsDataStore } from '../../stores/SportsDataStore'

defineOptions({ name: 'SimulationList' })

const state = ref<ApiState<SimulationOverview[]>>({
  loading: true,
  error: null,
  data: null
})

const store = useSportsDataStore()
const leagues = computed(() => store.leagues)
const teams = computed(() => store.teams)


onMounted(async () => {
  await ensureSportsData()
  await loadSimulations()
})
const ensureSportsData = async () => {
  if (!leagues.value.length) await store.loadLeagues()
  if (!teams.value.length) await store.loadTeams()
}

const loadSimulations = async () => {
  state.value = await fetchData<SimulationOverview[]>(() =>
    engineAPI.getSimulations()
  )
}
//const getTeamName = (id: string) => teams.value.find(t => t.id === id)?.name ?? id
const getLeagueName = (id: string) => leagues.value.find(t => t.id === id)?.name ?? id
</script>

<template>
  <main class="container">
    <header style="display: flex; justify-content: space-between; align-items: center;">
      <h1>All simulations</h1>
      <button @click="loadSimulations" :aria-busy="state.loading" class="button-primary">Reload</button>
    </header>
      <div v-if="state.loading" class="info"> Loading simulations..., please wait…</div>
      <ErrorEndpoint v-else-if="state.error" :error="state.error" />

    <section v-else-if="state.error" class="error">Error: {{ state.error }}</section>

    <ul v-else-if="state.data && state.data.length > 0" class="simulation-list">
      <li v-for="sim in state.data" :key="sim.id">
        <section class="simulation">
          <header class="title-details">
            <h2>{{ sim.title }}</h2>
            <small style="float: right;">Created: {{ new Date(sim.createdDate).toLocaleDateString() }}</small> <br/>
            <small style="float: right;">League: {{ getLeagueName(sim.simulationParams.leagueId)}}</small>
          </header>
          <details close>
            <article class="details-article"><strong>Iterations:</strong> {{ sim.simulationParams.iterations }}</article>
            <article class="details-article">
              <strong>Season years used in simulation:</strong> 
              <ul v-if="state.data && state.data.length > 0" class="season-years-list">
                <li v-for="seasonYear in sim.simulationParams.seasonYears">
                  <small>{{ seasonYear }}</small>
                </li>
              </ul>
            </article>
            <router-link
              :to="{ name: 'SimulationItem', params: { id: sim.id } }"
              role="button"
              class="button-primary"
            >
            More details
            </router-link>
          </details>
        </section>
      </li>
    </ul>

    <!-- EMPTY -->
    <article v-else>
      <p>No simulations found.</p>
    </article>
  </main>
</template>

<style scoped>
ul li{
  list-style: none;
}
.simulation-list {
  list-style: none;
  margin: 3rem;
  display: grid;
  gap: 3rem;
}
.error {
  color: var(--del-color);
}
.simulation .details{
  background-color: var(--color-grid);
}
.simulation{
  color: var(--color-text-main)
}
.details-article{
  display: flex;
  flex-wrap: column;
  color: var(--color-text-secondary)
}
.season-years-list{
  color: var(--color-text-secondary)
}
details {
  border: 1px var(--color-border);
  border-radius: 8px;
  padding: 0.5em 1em;
  transition: background-color 0.3s ease;
}
</style>
