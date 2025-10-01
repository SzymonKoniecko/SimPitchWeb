<template>
  <div class="app">
    <NavBar :isDark="isDark" @toggle-theme="toggleTheme" />
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";
import NavBar from "./components/NavBar.vue";

export default defineComponent({
  name: "App",
  components: { NavBar },
  setup() {
    const isDark = ref(false);

    onMounted(() => {
      const saved = localStorage.getItem("isDark");
      if (saved === "true") isDark.value = true;
      updateHtmlClass();
    });

    const updateHtmlClass = () => {
      if (isDark.value) document.documentElement.classList.add("dark");
      else document.documentElement.classList.remove("dark");
      localStorage.setItem("isDark", String(isDark.value));
    };

    watch(isDark, updateHtmlClass);

    const toggleTheme = () => {
      isDark.value = !isDark.value;
    };

    return { isDark, toggleTheme };
  }
});
</script>

<style>
:root{
  --bg: #F9FAFB;
  --card: #ffffff;
  --text: #111827;
  --text-secondary: #6B7280;
  --accent: #22C55E;
  --accent-dark: #059669;
  --border: #E5E7EB;
}

.dark{
  --bg: #111827;
  --card: #1F2937;
  --text: #F9FAFB;
  --text-secondary: #D1D5DB;
  --accent: #22C55E;
  --accent-dark: #059669;
  --border: #374151;
}

.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  color: var(--text);
  transition: background .25s ease, color .25s ease;
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
  overflow-x: hidden;
}
</style>
