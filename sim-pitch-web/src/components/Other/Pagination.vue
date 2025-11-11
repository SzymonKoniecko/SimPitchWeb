<script lang="ts" setup>
defineOptions({ name: "Pagination" });

const props = defineProps<{
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}>();
const emit = defineEmits<{
  (e: "update:page", value: number): void;
  (e: "update:pageSize", value: number): void;
}>();

const goToPage = (page: number) => {
  if (page >= 1 && page <= props.totalPages) {
    emit("update:page", page);
  }
};

const changePageSize = (event: Event) => {
  const newSize = Number((event.target as HTMLSelectElement).value);
  emit("update:pageSize", newSize);
};
</script>

<template>
    <hr />
    <div class="pagination">
      <button
        class="button-fourth"
        @click="goToPage(props.currentPage - 1)"
        :disabled="props.currentPage <= 1"
        selenium-id="prev-button"
      >
        ← Prev
      </button>

      <span>Page {{ props.currentPage }} / {{ props.totalPages }}</span>

      <button
        class="button-fourth"
        @click="goToPage(props.currentPage + 1)"
        :disabled="props.currentPage >= props.totalPages"
        selenium-id="next-button"
      >
        Next →
      </button>
      <label class="page-size" selenium-id="total-count">Total count: {{ props.totalItems }} </label>
      <label class="page-size">
        Page size:
        <select :value="props.pageSize" @change="changePageSize"
            selenium-id="size-select">
          <option selenium-id="size-5" :value="5">5</option>
          <option selenium-id="size-10" :value="10">10</option>
          <option selenium-id="size-25" :value="25">25</option>
          <option selenium-id="size-50" :value="50">50</option>
          <option selenium-id="size-100" :value="100">100</option>
        </select>
      </label>
    </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.page-size {
  margin-left: auto;
}
</style>
