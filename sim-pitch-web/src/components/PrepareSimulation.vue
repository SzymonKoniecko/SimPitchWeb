<template>
  <form class="form" @submit.prevent="onSubmit">
    <div class="field">
      <label for="seasons">Season years</label>
      <select id="seasons" multiple v-model="local.season_Years" size="4">
        <option
          v-for="opt in seasonOptions"
          :key="opt"
          :value="opt"
        >
          {{ opt }}
        </option>
      </select>
    </div>

    <div class="field">
      <label for="league">League ID</label>
      <input id="league" type="text" v-model="local.league_id" />
    </div>

    <div class="field">
      <label for="iterations">Iterations</label>
      <input
        id="iterations"
        type="text"
        placeholder="e.g. 100, 250, 500"
        v-model="iterationsCsv"
      />
      <small>Comma-separated integers; parsed as Int32Array on submit</small>
    </div>

    <div class="field">
      <label for="round">League round ID</label>
      <input id="round" type="text" v-model="local.league_round_id" />
    </div>

    <div class="actions">
      <button type="submit">Run</button>
      <button type="button" @click="reset">Reset</button>
    </div>

    <div v-if="statusMessage" class="status">
      {{ statusMessage }}
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { SeasonYear as SeasonYearConst } from '../models/seasonYear'
import type { SeasonYear as SeasonYearType } from '../models/seasonYear'
import type { formSimulationProps } from '../models/formSimulationProps'
//import { submitSimulation } from '../api/SimulationService/simulationsService.ts'

defineOptions({ name: 'PrepareSimulation' })

const props = defineProps<{
  modelValue?: formSimulationProps
  seasonOptions?: SeasonYearType[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: formSimulationProps): void
  (e: 'submit', value: formSimulationProps): void
}>()

type LocalForm = Omit<formSimulationProps, 'iterations'> & { iterations: number[] }

const local = reactive<LocalForm>({
  season_Years: [...(props.modelValue?.season_Years ?? [SeasonYearConst.S2023_2024])],
  league_id: props.modelValue?.league_id ?? '',
  iterations: Array.from(props.modelValue?.iterations ?? [100]),
  league_round_id: props.modelValue?.league_round_id ?? ''
})
const router = useRouter()

const statusMessage = ref('')

const seasonOptions = computed<SeasonYearType[]>(() =>
  props.seasonOptions?.slice() ?? (Object.values(SeasonYearConst) as SeasonYearType[])
)

const iterationsCsv = computed<string>({
  get() {
    return local.iterations.join(', ')
  },
  set(csv: string) {
    const nums = csv
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(n => Number.parseInt(n, 10))
      .filter(Number.isFinite)
    local.iterations = nums
  }
})

watch(
  () => props.modelValue,
  (nv) => {
    if (!nv) return
    local.season_Years = [...(nv.season_Years ?? [])]
    local.league_id = nv.league_id ?? ''
    local.iterations = Array.from(nv.iterations ?? [])
    local.league_round_id = nv.league_round_id ?? ''
  },
  { deep: true, immediate: true }
)

async function onSubmit() {
  const out: formSimulationProps = {
    season_Years: [...local.season_Years],
    league_id: local.league_id,
    iterations: new Int32Array(local.iterations),
    league_round_id: local.league_round_id
  }

  emit('update:modelValue', out)
  emit('submit', out)

    try {
        statusMessage.value = 'Sending...'
        //const simulation_Id_response = await submitSimulation(out)
        const simulation_Id_response = "3d6f0a04-6f5b-4b6f-8a4f-9d5b8b9d6c01"
        statusMessage.value = 'Simulation submitted successfully.'
        await router.push({ 
        name: 'SimulationItemView', 
        params: { id: simulation_Id_response } 
        })   
    } catch (err) {
        console.error(err)
        statusMessage.value = 'Failed to submit simulation.'
    }
}

function reset() {
  const src = props.modelValue
  if (src) {
    local.season_Years = [...(src.season_Years ?? [])]
    local.league_id = src.league_id ?? ''
    local.iterations = Array.from(src.iterations ?? [])
    local.league_round_id = src.league_round_id ?? ''
  } else {
    local.season_Years = [SeasonYearConst.S2023_2024]
    local.league_id = ''
    local.iterations = [100]
    local.league_round_id = ''
  }
}
</script>

<style scoped>
.form { display: grid; gap: 1rem; max-width: 28rem; }
.field { display: grid; gap: 0.375rem; }
.actions { display: flex; gap: 0.5rem; }
select[multiple] { min-height: 7rem; }
small { color: #666; }
.status { margin-top: 0.5rem; font-size: 0.875rem; color: #333; }
</style>
