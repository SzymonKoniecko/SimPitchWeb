<template>
  <div class="mb-4">
    <p>Symulacja w toku... ({{ progress }}%)</p>
    <div class="w-full bg-gray-700 rounded-full h-2 mt-1">
      <div class="bg-green-500 h-2 rounded-full transition-all" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  progress: Number
});
</script>
