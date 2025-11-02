<script lang="ts" setup>
import { computed, onMounted, watch } from "vue";
import {
  SortingOption,
  SortingOptions,
  getLabel
} from "../../models/Consts/sortingOption";
import type { Team } from "../../models/SportsDataModels/team";

defineOptions({ name: "Filter" });

const props = defineProps<{
  variant?: "SimulationItem" | "SimulationList";
  toSortOption: string;
  condition: string;
  filterteams: Team[];
}>();

const variant = computed(() => props.variant ?? "SimulationItem");
const sortingList = computed(() => {
  return setSortingOptions(variant.value);
});

const emit = defineEmits<{
  (e: "update:sortingOption", value: string): void;
  (e: "update:condition", value: string): void;
  (e: "update:filterByTeam", value: string): void;
}>();

const changeSortingOption = (event: Event) => {
  const newSortingOption = String((event.target as HTMLSelectElement).value);
  emit("update:sortingOption", newSortingOption);
};

const changeCondition = (event: Event) => {
  const newCondition = String((event.target as HTMLSelectElement).value);
  emit("update:condition", newCondition);
};

const filterByTeamId = (event: Event) =>{
    const newFilterTeamId = String((event.target as HTMLSelectElement).value);
    console.log(newFilterTeamId)
    emit("update:filterByTeam", newFilterTeamId);
}

const setSortingOptions = (variant: string) => {
  let list = [...SortingOptions];

  if (variant === "SimulationItem") {
    list = list.filter((opt) => opt !== SortingOption.Name);
  } else if (variant === "SimulationList") {
    list = list.filter(
      (opt) => opt !== SortingOption.Team && opt !== SortingOption.LeaderPoints
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
  <div class="filter">
    <label class="sort-option">
      Sort by:
      <select :value="props.toSortOption" @change="changeSortingOption">
      <option 
        v-for="option in sortingList" 
        :key="option" 
        :value="option"
      >
        {{ getLabel(option) }}
      </option>
    </select>
    </label>
  </div>
  <div v-if="props.toSortOption === SortingOption.Team" class="team-container">
    <label>Select team</label>
    <select :value="props.filterteams" @change="filterByTeamId">
      <option 
        v-for="team in props.filterteams" 
        :key="team.id" 
        :value="team.id"
      >
        {{ team.name }}
      </option>
    </select>
  </div>
  <div class="condition">
    <label>condition</label>
    <input :value="props.condition" @change="changeCondition" />
  </div>
</template>
<style scoped></style>
