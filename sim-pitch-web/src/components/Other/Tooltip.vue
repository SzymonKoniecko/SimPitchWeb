<template>
  <span class="tooltip-wrapper">
    <slot></slot>

    <span class="tooltip-bubble">
      {{ text }}
    </span>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<style scoped>
.tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.tooltip-bubble {
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-surface-sections);
  color: var(--color-text-main);
  border: 1px solid var(--color-grid);
  padding: 0.45rem 0.65rem;
  font-size: 0.8rem;
  border-radius: 8px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  z-index: 20;
  box-shadow: 0 4px 10px rgba(0,0,0,0.22);
}

.tooltip-wrapper:hover .tooltip-bubble {
  opacity: 1;
  transform: translateX(-50%) translateY(-4px);
}
</style>
