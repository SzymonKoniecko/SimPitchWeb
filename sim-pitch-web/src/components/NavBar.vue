<template>
  <header class="navbar">
    <div class="logo">⚽ SimPitch</div>

    <nav class="nav-links">
      <router-link to="/" exact-active-class="active">Home</router-link>
      <router-link to="/simulation" exact-active-class="active">Simulation</router-link>
      <router-link to="/about" exact-active-class="active">About</router-link>
      <router-link to="/settings" exact-active-class="active">Settings</router-link>
    </nav>

    <button
      class="theme-toggle"
      @click="emitToggle"
      :aria-pressed="isDark"
      :title="isDark ? 'Dark mode' : 'Light mode'">
      <span v-if="isDark">🌙</span>
      <span v-else>🌞</span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps<{ isDark: boolean }>();
const emit = defineEmits<{
  (e: "toggle-theme"): void
}>();

const isDark = props.isDark;

const emitToggle = () => {
  emit("toggle-theme");
};
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.logo{
  font-weight:700;
  font-size:1.15rem;
  color: var(--accent);
}

.nav-links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.nav-links a{
  text-decoration:none;
  color: var(--text);
  font-weight:500;
  padding-bottom:2px;
  border-bottom:2px solid transparent;
}

.nav-links a:hover{ color: var(--accent); }
.nav-links a.active{
  color: var(--accent);
  border-bottom:2px solid var(--accent);
}

/* przycisk przełącznika */
.theme-toggle{
  background: transparent;
  border: 1px solid var(--border);
  padding: 0.35rem 0.6rem;
  border-radius:999px;
  cursor:pointer;
  font-size:1.1rem;
  line-height:1;
}
</style>
