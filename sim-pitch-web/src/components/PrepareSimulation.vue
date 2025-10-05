<template>
<div class="formBox">
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
  </form>
</div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { SeasonYear as SeasonYearConst } from '../models/seasonYear'
import type { SeasonYear as SeasonYearType } from '../models/seasonYear'
import type { formSimulationProps } from '../models/formSimulationProps'

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

// Provide safe defaults if no modelValue is passed
const local = reactive<LocalForm>({
  season_Years: [...(props.modelValue?.season_Years ?? [SeasonYearConst.S2023_2024])],
  league_id: props.modelValue?.league_id ?? '',
  iterations: Array.from(props.modelValue?.iterations ?? [100]),
  league_round_id: props.modelValue?.league_round_id ?? ''
})

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

function onSubmit() {
  const out: formSimulationProps = {
    season_Years: [...local.season_Years],
    league_id: local.league_id,
    iterations: new Int32Array(local.iterations),
    league_round_id: local.league_round_id
  }
  emit('update:modelValue', out)
  emit('submit', out)
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
.formBox{ margin: 0 auto; }
.form { display: grid; gap: 1rem; max-width: 28rem; }
.field { display: grid; gap: 0.375rem; }
.actions { display: flex; gap: 0.5rem; }
select[multiple] { min-height: 7rem; }
small { color: #666; }
</style>