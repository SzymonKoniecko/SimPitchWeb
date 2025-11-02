<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";
import {
  SortingOption,
  SortingOptions,
  getLabel,
} from "../../models/Consts/sortingOption";
import type { Team } from "../../models/SportsDataModels/team";
import type { League } from "../../models/SportsDataModels/league";

defineOptions({ name: "Filter" });

const props = defineProps<{
  variant: "SimulationItem" | "SimulationList";
  toSortOption: string;
  condition?: string;
  filterDynamicValue: Team[] | League[];
}>();

const filterObjValue = computed(() => {
  const array = [...props.filterDynamicValue];

  if (props.variant === "SimulationItem") {
    array.push({ id: "Any", name: "( Any )" } as Team);
  } else if (props.variant === "SimulationList") {
    array.push({ id: "Any", name: "( Any )" } as League);
  }

  return array;
});

const variant = computed(() => props.variant ?? "SimulationItem");
const sortingList = computed(() => {
  return setSortingOptions(variant.value);
});

const emit = defineEmits<{
  (e: "update:sortingOption", value: string): void;
  (e: "update:condition", value: string): void;
  (e: "update:filterBy", value: string): void;
}>();

const changeSortingOption = (event: Event) => {
  const newSortingOption = String((event.target as HTMLSelectElement).value);
  emit("update:sortingOption", newSortingOption);
};

const changeCondition = (event: Event) => {
  const newCondition = String((event.target as HTMLSelectElement).value);
  emit("update:condition", newCondition);
};

const filterBy = (event: Event) => {
  const newFilterTeamId = String((event.target as HTMLSelectElement).value);
  emit("update:filterBy", newFilterTeamId);
};

const setSortingOptions = (variant: string) => {
  let list = [...SortingOptions];

  if (variant === "SimulationItem") {
    list = list.filter((opt) => opt !== SortingOption.Name);
  } else if (variant === "SimulationList") {
    list = list.filter(
      (opt) => opt !== SortingOption.LeaderPoints
    );
  }
  return list;
};

const ensureData = async () => {
  setSortingOptions(variant.value);
};
onMounted(ensureData);
watch(() => props.variant, ensureData);
</script>
<template>
    <hr></hr>
  <div class="filter">
    <label class="sort-option">
      Sort by:
      <select :value="props.toSortOption" @change="changeSortingOption">
        <option v-for="option in sortingList" :key="option" :value="option">
          {{ getLabel(option, variant) }}
        </option>
      </select>
    </label>
    <div v-if="props.toSortOption === SortingOption.DynamicValue" class="sort-option">
      <label>Select dynamic value:</label>
      <select :value="filterObjValue" @change="filterBy">
        <option
          v-for="dynamicValue in filterObjValue"
          :key="dynamicValue.id"
          :value="dynamicValue.id"
        >
          {{ dynamicValue.name }}
        </option>
      </select>
    </div>
    <button class="secondary">Descending</button>
    <div class="condition">
      <label>condition</label>
      <input :value="props.condition" @change="changeCondition" />
    </div>
  </div>
  <hr></hr>
</template>
<style scoped>
.filter {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.sort-option {
  font-size: 0.9rem;
}
button {
  cursor: pointer;
}
</style>
