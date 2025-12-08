<template>
  <div v-if="error" :id="`error-${errorType}`" role="alert" :class="['error-alert', `error-${errorType}`]" aria-live="assertive">
    <div class="error-icon">
      {{ errorIcon }}
    </div>

    <div class="error-content">
      <h3 class="error-title">{{ errorTitle }}</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <p v-if="errorDetails" class="error-details">{{ errorDetails }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  error?: string
}

const props = withDefaults(defineProps<Props>(), {
  error: undefined
})

const errorType = computed(() => {
  if (!props.error) return null
  
  if (props.error.includes('404') || props.error.includes('Not Found')) {
    return '404'
  }
  if (props.error.includes('412') || props.error.includes('Precondition Failed')) {
    return '412'
  }
  if (props.error.includes('500') || props.error.includes('Internal Server Error')) {
    return '500'
  }
  
  return 'unknown'
})

const errorIcon = computed(() => {
  switch (errorType.value) {
    case '404':
      return '⊘'
    case '412':
      return '⚠'
    case '500':
      return '✕'
    default:
      return '!'
  }
})

const errorTitle = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'Resource Not Found'
    case '412':
      return 'Precondition Failed'
    case '500':
      return 'Server Error'
    default:
      return 'Error'
  }
})

const errorMessage = computed(() => {
  switch (errorType.value) {
    case '404':
      return 'The requested resource could not be found.'
    case '412':
      return 'The request does not meet required conditions. Please verify the simulation state.'
    case '500':
      return 'An unexpected server error occurred. Please try again later.'
    default:
      return 'An error occurred while processing your request.'
  }
})

const errorDetails = computed(() => {
  if (!props.error) return null
  
  return props.error.replace(/^Request failed with status code \d+: ?/, '').trim()
})
</script>

<style scoped>
.error-alert {
  display: flex;
  gap: var(--space-16);
  padding: var(--space-16);
  border-radius: var(--radius-base);
  margin-bottom: var(--space-16);
  border: 1px solid;
  background-color: rgba(var(--color-error-rgb), 0.08);
  border-color: rgba(var(--color-error-rgb), 0.25);
}

.error-alert.error-404 {
  background-color: rgba(255, 84, 89, 0.08);
  border-color: rgba(255, 84, 89, 0.25);
}

.error-alert.error-412 {
  background-color: rgba(230, 129, 97, 0.08);
  border-color: rgba(230, 129, 97, 0.25);
}

.error-alert.error-500 {
  background-color: rgba(192, 21, 47, 0.12);
  border-color: rgba(192, 21, 47, 0.3);
}

.error-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  line-height: 1;
  color: var(--color-error);
  font-weight: bold;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(var(--color-error-rgb), 0.1);
}

.error-alert.error-412 .error-icon {
  color: var(--color-warning);
  background-color: rgba(230, 129, 97, 0.15);
}

.error-content {
  flex: 1;
  min-width: 0;
}

.error-title {
  margin: 0 0 var(--space-8) 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-error);
}

.error-alert.error-412 .error-title {
  color: var(--color-warning);
}

.error-message {
  margin: 0 0 var(--space-8) 0;
  font-size: var(--font-size-base);
  color: var(--color-text);
  line-height: var(--line-height-normal);
}

.error-details {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-family: var(--font-family-mono);
  word-break: break-word;
  padding: var(--space-8);
  background-color: rgba(0, 0, 0, 0.03);
  border-radius: var(--radius-sm);
  overflow-x: auto;
}

@media (prefers-color-scheme: dark) {
  .error-details {
    background-color: rgba(0, 0, 0, 0.3);
  }
}

[data-color-scheme='dark'] .error-details {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
