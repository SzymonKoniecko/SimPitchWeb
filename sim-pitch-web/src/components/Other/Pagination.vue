<script lang="ts" setup>

type Props = {
  totalItems: number
  pageSize: number
  currentPage: number
  totalPages: number
}
const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()


const changePage = (page: number) => {
  if (page < 1 || page > props.totalPages) return
  emit('update:page', page)
}
</script>

<template>
  <nav class="pagination">
    <button @click="changePage(1)" :disabled="currentPage === 1">⏮ First</button>
    <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">← Prev</button>
    <span>Page {{ currentPage }} / {{ totalPages }}</span>
    <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next →</button>
    <button @click="changePage(totalPages)" :disabled="currentPage === totalPages">Last ⏭</button>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
}
button {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--muted-border-color);
  background: var(--background-color);
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
