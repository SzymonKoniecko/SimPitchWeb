<template>
    <h1>Simulation {{ props.id }}</h1>

</template>
<script lang="ts" setup>
defineOptions({ name: "SimulationItemView" });

type Props = { id: string };
const props = defineProps<Props>();

// Use props.id directly in template
</script>