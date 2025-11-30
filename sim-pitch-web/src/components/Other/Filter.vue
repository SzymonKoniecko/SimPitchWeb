<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import {
  SortingOption,
  SortingOptions,
  getLabel,
} from "../../models/Consts/sortingOption";
import type { Team } from "../../models/SportsDataModels/team";
import type { League } from "../../models/SportsDataModels/league";
import { SimulationStatus, simulationStatusOptions } from "../../models/Consts/simulationStatus";

defineOptions({ name: "Filter" });

const props = defineProps<{
  variant: "SimulationItem" | "SimulationList";
  toSortOption: string;
  order?: "Descending" | "Ascending";
  filterDynamicValue: Team[] | League[];
}>();

const dynamicFilterObjValue = computed(() => {
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
const orderValue = ref(props.order || "Descending");
const selectedDynamicOption = ref<string>();

const emit = defineEmits<{
  (e: "update:sortingOption", value: string): void;
  (e: "update:order", value: "Descending" | "Ascending"): void;
  (e: "update:filterBy", value: string): void;
}>();

const changeSortingOption = (event: Event) => {
  const newSortingOption = String((event.target as HTMLSelectElement).value);
  if (newSortingOption == SortingOption.State) {
    selectedDynamicOption.value = SimulationStatus.Completed;
  }
  else if (newSortingOption == SortingOption.Title) {
    selectedDynamicOption.value = ""
  }
  else if (newSortingOption == SortingOption.DynamicValue) {
    selectedDynamicOption.value = ""
  }
  emit("update:sortingOption", newSortingOption);
};

const changeOrder = () => {
  orderValue.value = orderValue.value === "Descending" ? "Ascending" : "Descending";
  emit("update:order", orderValue.value);
};

const filterBy = (event: Event) => {
  const newFilter = String((event.target as HTMLSelectElement).value);
  console.log(newFilter)
  emit("update:filterBy", newFilter);
};

const setSortingOptions = (variant: string) => {
  let list = [...SortingOptions];

  if (variant === "SimulationItem") {
    list = list.filter((opt) => opt !== SortingOption.Title && opt !== SortingOption.State);
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
  <hr>
  </hr>
  <div class="filter">
    <label class="sort-option">
      Sort by:
      <select :value="props.toSortOption" @change="changeSortingOption" selenium-id="sorting-select">
        <option v-for="option in sortingList" :key="option" :value="option" :selenium-id="`${getLabel(option, variant)
          .replace(/\s+/g, '-')
          .toLowerCase()}`">
          {{ getLabel(option, variant) }}
        </option>
      </select>
    </label>
    <div v-if="props.toSortOption === SortingOption.DynamicValue" class="sort-option">
      <label>Select</label>
      <select :v-model="selectedDynamicOption" :value="selectedDynamicOption" @change="filterBy" selenium-id="condition-select">
        <option v-for="dynamicValue in dynamicFilterObjValue" :key="dynamicValue.id" :value="dynamicValue.id" :selenium-id="`${dynamicValue.name
          .replace(/\s+/g, '-')
          .toLowerCase()}`">
          {{ dynamicValue.name }}
        </option>
      </select>
    </div>
    <div v-else-if="props.toSortOption === SortingOption.State" class="sort-option">
      <label>Select</label>
      <select :v-model="selectedDynamicOption" :value="selectedDynamicOption" @change="filterBy" selenium-id="condition-select">
        <option v-for="status in simulationStatusOptions" :key="status" :value="status" :selenium-id="`${status}`">
          {{ status }}
        </option>
      </select>
    </div>
    <div v-else-if="props.toSortOption === SortingOption.Title" class="sort-option">
      <label>Select</label>
      <input  :v-model="selectedDynamicOption" :value="selectedDynamicOption" @change="filterBy" selenium-id="condition-select" />
    </div>
    <button v-if="props.toSortOption !== SortingOption.DynamicValue" class="button-third" selenium-id="button-order"
      v-on:click="changeOrder">Toggle {{ orderValue }}</button>
  </div>
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
</style>
