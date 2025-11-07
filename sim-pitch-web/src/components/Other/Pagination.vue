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
      >
        ← Prev
      </button>

      <span>Page {{ props.currentPage }} / {{ props.totalPages }}</span>

      <button
        class="button-fourth"
        @click="goToPage(props.currentPage + 1)"
        :disabled="props.currentPage >= props.totalPages"
      >
        Next →
      </button>
      <label class="page-size"> Total count: {{ props.totalItems }} </label>
      <label class="page-size">
        Page size:
        <select :value="props.pageSize" @change="changePageSize">
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
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
