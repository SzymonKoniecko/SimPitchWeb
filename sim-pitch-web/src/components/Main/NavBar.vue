<script setup lang="ts">
import { ref, onMounted } from "vue";

// Reaktywne dane
const isDark = ref(false);

// Przełączanie motywu i zapis w localStorage
function toggleTheme() {
  isDark.value = !isDark.value;
  const root = document.documentElement;
  root.classList.toggle("dark", isDark.value);
  localStorage.setItem("theme", isDark.value ? "dark" : "light");
}

// Wczytaj preferencję przy starcie
onMounted(() => {
  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    document.documentElement.classList.add("dark");
    isDark.value = true;
  }
});
</script>

<template>
  <header class="navbar">
    <router-link to="/" exact-active-class="active">
      <div class="logo">⚽ SimPitch</div>
    </router-link>
    

    <nav class="nav-links">
      <router-link to="/" exact-active-class="active">Home</router-link>
      <router-link to="/simulation" exact-active-class="active">Simulation</router-link>
      <router-link to="/about" exact-active-class="active">About</router-link>
      <router-link to="/settings" exact-active-class="active">Settings</router-link>
    </nav>

    <button
      class="theme-toggle"
      @click="toggleTheme"
      :aria-pressed="isDark"
      :title="isDark ? 'Dark mode' : 'Light mode'"
    >
      <span v-if="isDark">🌙</span>
      <span v-else>🌞</span>
    </button>
  </header>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-bg-surface);
  border-bottom: 1px solid var(--color-grid);
  padding: 1rem 2rem;
  max-width: 80%;
  box-sizing: border-box;
  overflow-x: hidden;
}

.logo {
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--color-text-primary);
}

.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.nav-links a {
  color: var(--color-text-secondary);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s;
}

.nav-links a.active {
  color: var(--color-accent-green);
}

.nav-links a:hover {
  color: var(--color-hover);
}

.theme-toggle {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.theme-toggle:hover {
  background-color: var(--color-pastel-green);
}
</style>
