<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import { engineAPI } from '../../api/engine.api'
import { fetchData, type ApiState } from '../../api/fetchData'
import type { Simulation } from '../../models/simulation'
import type { iterationPreview } from '../../models/iterationPreview'
import { useSportsDataStore } from '../../stores/SportsDataStore'


defineOptions({ name: 'SimulationItem' })
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
  state.value = await fetchData<Simulation>(() => engineAPI.getSimulation(props.id))
}

const getTeamName = (id: string) => teams.value.find(t => t.id === id)?.name ?? id
const getLeagueName = (id: string) => leagues.value.find(l => l.id === id)?.name ?? id

const groupedPreviews = computed(() => {
  const previews = state.value.data?.iterationPreviews ?? []
  const groups: Record<string, iterationPreview[]> = {}

  for (const p of previews) {
    // 🔹 Używamy lokalnej zmiennej, więc TS wie że nie jest undefined
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
    <header style="display: flex; justify-content: space-between; align-items: center;">
      <h1>Simulation Details</h1>
      <button @click="loadSimulation" :aria-busy="state.loading">Reload</button>
    </header>

    <article v-if="state.loading" aria-busy="true">Loading simulation...</article>
    <article v-else-if="state.error" class="error">Error: {{ state.error }}</article>

    <article v-else-if="state.data">
      <h2>Summary</h2>
      <p><strong>Winners:</strong> {{ state.data.winnersSummary }}</p>
      <p><strong>Completed iterations:</strong> {{ state.data.completedIterations }}</p>
      <p><strong>Simulated matches:</strong> {{ state.data.simulatedMatches }}</p>
      <p><strong>Prior league strength:</strong> {{ state.data.priorLeagueStrength }}</p>

      <!-- <details open>
        <summary><strong>Simulation Parameters</strong></summary>
        <ul>
          <li><strong>League:</strong> {{ getLeagueName(state.data.simulationParams.LeagueId) }}</li>
          <li><strong>Iterations:</strong> {{ state.data.simulationParams.Iterations }}</li>
          <li><strong>Seasons:</strong> {{ state.data.simulationParams.SeasonYears.join(', ') }}</li>
        </ul>
      </details> -->

      <!-- ✅ Nowe: grupowanie po scoreboardId -->
      <details open>
        <summary><strong>Iteration Previews (grouped by scoreboard)</strong></summary>

        <div v-for="(items, scoreboardId) in groupedPreviews" :key="scoreboardId" class="scoreboard-block">
          <h3>Scoreboard: {{ scoreboardId }}</h3>
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Points</th>
                <th>Iteration</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in items" :key="p.teamId + '-' + p.iterationIndex">
                <td>{{ p.rank }}</td>
                <td>{{ getTeamName(p.teamId) }}</td>
                <td>{{ p.points }}</td>
                <td>{{ p.iterationIndex }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>

      <footer style="margin-top: 1rem;">
        <router-link to="/simulations" role="button" class="secondary">
          ← Back to list
        </router-link>
      </footer>
    </article>
  </main>
</template>

<style scoped>
.scoreboard-block {
  margin-bottom: 2rem;
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
</style>
