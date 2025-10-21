<template>
    <div>
        <div v-if="scoreboardState.loading" class="info"> Loading details..., please wait…</div>
        <ErrorEndpoint v-else-if="scoreboardState.error" :error="scoreboardState.error" />
    </div>
    <div class="scoreboard">
        <ScoreboardItem 
            variant="complete_details" 
            :teams="teams" 
            :scoreboard="scoreboardState.data?.[0]"
        />
    </div>
</template>
<style scoped>
</style>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { fetchData, type ApiState } from '../../api/fetchData';
import ErrorEndpoint from '../Other/ErrorEndpoint.vue';
import type { Scoreboard } from '../../models/scoreboard';
import { useSportsDataStore } from '../../stores/SportsDataStore';
import { engineAPI } from '../../api/engine.api';
import ScoreboardItem from './ScoreboardItem.vue';
defineOptions({ name: 'IterationItem' })
type Props = {
    id: string; // iteration_id
    simulation_id: string;
} 
const props = defineProps<Props>()

const scoreboardState = ref<ApiState<Scoreboard[]>>({
  loading: true,
  error: null,
  data: null
})
const store = useSportsDataStore()
const leagues = computed(() => store.leagues)
const teams = computed(() => store.teams)

const loadScoreboard = async () => {
    scoreboardState.value = await fetchData<Scoreboard[]>(() => 
        engineAPI.ScoreboardController.getScoreboard(props.simulation_id, props.id))
}
//const getLeagueName = (id: string) => leagues.value.find(t => t.id === id)?.name ?? id
const ensureData = async () => {
    if (!props.simulation_id || !props.id) return;
    if (!leagues.value || leagues.value.length === 0) {
        await store.loadLeagues();
    }
    if (!teams.value || teams.value.length === 0) {
        await store.loadTeams();
    }
    if (props.id || props.simulation_id != undefined) {
        await loadScoreboard();
    }
};

onMounted(async () => {
    await ensureData();
});

watch(
  [() => props.id, () => props.simulation_id],
  async () => {
      if (props.id && props.simulation_id) {
          await ensureData();
      }
  },
  { immediate: true }
);
</script>

