<template>
  <div class="app">
    <NavBar :isDark="true" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "./components/Main/NavBar.vue";

export default defineComponent({
  name: "App",
  components: { NavBar },
  setup() {}
});
</script>

<style>
</style>
