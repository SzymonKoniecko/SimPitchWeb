<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { engineAPI } from '../../api/engine.api'
import { fetchData, type ApiState } from '../../api/fetchData'
import type { Simulation } from '../../models/Simulations/simulation'
import type { IterationPreview } from '../../models/Iterations/iterationPreview'
import ErrorEndpoint from '../Other/ErrorEndpoint.vue'
import { useSportsDataStore } from '../../stores/SportsDataStore'
import ScoreboardItem from '../Iteration/ScoreboardItem.vue'
defineOptions({ name: 'SimulationOverviewItem' })
type Props = { id: string }
const props = defineProps<Props>()

const store = useSportsDataStore()
const leagues = computed(() => store.leagues)
const teams = computed(() => store.teams)

const ensureSportsData = async () => {
  if (!leagues.value.length) await store.loadLeagues()
  if (!teams.value.length) await store.loadTeams()
}

const state = ref<ApiState<Simulation>>({
  loading: true,
  error: null,
  data: null
})

const loadSimulation = async () => {
  state.value = await fetchData<Simulation>(() => engineAPI.SimulationController.getSimulationOverviews(props.id))
}

const getLeagueName = (id: string) => leagues.value.find(t => t.id === id)?.name ?? id

const groupedPreviews = computed(() => {
  const previews = state.value.data?.iterationPreviews ?? []
  const groups: Record<string, IterationPreview[]> = {}

  for (const p of previews) {
    const list = groups[p.scoreboardId] ?? (groups[p.scoreboardId] = [])
    list.push(p)
  }

  for (const key in groups) {
  const list = groups[key]
  if (list) {
    list.sort((a, b) => a.rank - b.rank)
  }
}

  return groups
})


onMounted(async () => {
  await ensureSportsData()
  await loadSimulation()
})
watch(() => props.id, loadSimulation)
</script>

<template>
  <main class="container">
      <button @click="loadSimulation" :aria-busy="state.loading" class="button-primary">Reload</button> <br/>

    <article v-if="state.loading" aria-busy="true">Loading simulation...</article>
    <ErrorEndpoint v-else-if="state.error" :error="state.error" />

    <section v-else-if="state.data" class="container-content">
      <h2>Summary</h2>
      <details close class="details">
        <summary><strong>[-> Simulation Parameters <-]</strong></summary>
        <ul>
          <li><strong>League:</strong> {{ getLeagueName(state.data.simulationParams.leagueId) }}</li>
          <li><strong>Iterations:</strong> {{ state.data.simulationParams.iterations }}</li>
          <li><strong>Seasons:</strong> {{ state.data.simulationParams.seasonYears.join(', ') }}</li>
        </ul>
      </details> 
      <p><strong>Winners:</strong> {{ state.data.winnersSummary }}</p>
      <p><strong>Completed iterations:</strong> {{ state.data.completedIterations }}</p>
      <p><strong>Simulated matches:</strong> {{ state.data.simulatedMatches }}</p>
      <p><strong>Prior league strength:</strong> {{ state.data.priorLeagueStrength }}</p>

      <details open>
        <summary><strong>Iteration Previews (grouped by scoreboard)</strong></summary>

        <div v-for="(items, scoreboardId, iterationIndex) in groupedPreviews" :key="scoreboardId" class="scoreboard-block">
          <h3 style="float: right;">#{{ iterationIndex + 1}}</h3><small>Scoreboard: {{ scoreboardId }}</small>
          <ScoreboardItem :scoreboard_id="scoreboardId" variant="preview" :teams="teams" :iteration_preview="items"/>
          <router-link 
            :to="{ name: 'IterationItem', params: { simulation_id: props.id, id: items[0]?.iterationId}}"
            role="button" class="button-secondary">
            ->  Check complete iteration details 
          </router-link>
        </div>
      </details>

      <footer style="margin-top: 1rem;">
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
.container-content{
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
button{
  float: right;
}
.details{
  float: right;
  font-size: 125%;
}
</style>
