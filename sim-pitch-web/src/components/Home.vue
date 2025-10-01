<template>
  <main class="home">
    <section class="hero">
      <h1>⚽ SimPitch</h1>
      <p class="subtitle">
        Symulacja meczów i rund ligowych oparta na modelach <b>Poissona</b> i <b>Gamma</b>.
      </p>
      <router-link to="/simulation" class="btn-primary">
        Rozpocznij symulację
      </router-link>
    </section>

    <section class="goal">
      <h2>🎯 Cel systemu</h2>
      <ul>
        <li>Analiza historii drużyn (mecze, bramki zdobyte i stracone)</li>
        <li>Ocena siły ofensywnej i defensywnej</li>
        <li>Uwzględnienie losowego charakteru wyników</li>
        <li>Symulacja rozkładu bramek przy pomocy modeli probabilistycznych</li>
      </ul>
    </section>
  </main>
</template>

<script lang="ts">
export default {
  name: "Home"
};
</script>

<style scoped>
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  padding: 2rem;
  min-height: calc(100vh - 70px);
  background: var(--bg);
  color: var(--text);
  text-align: center;
}
.hero {
  text-align: center;
  max-width: 1200px;
}

.hero h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--accent);
  margin-bottom: 1rem;
}

.subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--accent);
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.2s ease;
}

.btn-primary:hover {
  background: var(--accent-dark);
}

.goal {
  width: 90%;
  max-width: 1200px;
  background: var(--card);
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  text-align: left;
}

.goal h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--accent);
}

.goal ul {
  list-style: none;
  padding: 0;
}

.goal li {
  padding: 0.5rem 0;
  font-size: 1.1rem;
  border-bottom: 1px solid var(--border);
}

:root {
  --bg: #F9FAFB;
  --card: #ffffff;
  --text: #111827;
  --text-secondary: #6B7280;
  --accent: #22C55E;
  --accent-dark: #059669;
  --border: #E5E7EB;
}

.dark {
  --bg: #111827;
  --card: #1F2937;
  --text: #F9FAFB;
  --text-secondary: #D1D5DB;
  --accent: #22C55E;
  --accent-dark: #059669;
  --border: #374151;
}
</style>
