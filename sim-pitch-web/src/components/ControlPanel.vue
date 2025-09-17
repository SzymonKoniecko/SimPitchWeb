<template>
  <div class="mt-4 flex gap-2">
    <button @click="$emit('reset')" class="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg">
      Reset
    </button>
    <button @click="$emit('new')" class="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg">
      Nowa symulacja
    </button>
  </div>
</template>

<script setup>
defineEmits(["reset", "new"]);
</script>
