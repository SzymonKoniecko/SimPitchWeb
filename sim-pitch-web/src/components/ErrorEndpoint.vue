<template>
  <div
    v-if="error"
    id="endpointError"
    role="alert"
    class="endpoint-error"
    aria-live="assertive"
  >
    Error in simulation: {{ error }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error?: string
}>()
</script>