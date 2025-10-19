<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { engineAPI } from '../../api/engine.api'
import { fetchData, type ApiState } from '../../api/fetchData'
import type { SimulationOverview } from '../../models/simulationOverview'

defineOptions({ name: 'SimulationList' })

// Reaktywny stan API
const state = ref<ApiState<SimulationOverview[]>>({
  loading: true,
  error: null,
  data: null
})

// Funkcja do załadowania danych
const loadSimulations = async () => {
  state.value = await fetchData<SimulationOverview[]>(() =>
    engineAPI.getSimulations()
  )
}

onMounted(loadSimulations)
</script>

<template>
  <main class="container">
    <header style="display: flex; justify-content: space-between; align-items: center;">
      <h1>Simulations</h1>
      <button @click="loadSimulations" :aria-busy="state.loading">Reload</button>
    </header>

    <!-- LOADING -->
    <article v-if="state.loading" aria-busy="true">Loading simulations...</article>

    <!-- ERROR -->
    <article v-else-if="state.error" class="error">Error: {{ state.error }}</article>

    <!-- LIST -->
    <ul v-else-if="state.data && state.data.length > 0" class="simulation-list">
      <li v-for="sim in state.data" :key="sim.id">
        <article>
          <header>
            <h2>{{ sim.title }}</h2>
            <small>Created: {{ new Date(sim.createdDate).toLocaleDateString() }}</small>
          </header>
          <p><strong>Iterations:</strong> {{ sim.simulationParams.Iterations }}</p>
          <router-link
            :to="{ name: 'SimulationItem', params: { id: sim.id } }"
            role="button"
          >
            View details
          </router-link>
        </article>
      </li>
    </ul>

    <!-- EMPTY -->
    <article v-else>
      <p>No simulations found.</p>
    </article>
  </main>
</template>

<style scoped>
.simulation-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1rem;
}
.error {
  color: var(--del-color);
}
</style>
