<template>
  <main class="home">
    <section class="hero">
      <h1>⚽ SimPitch</h1>
      <p class="subtitle">
        Match and league round simulation based on <b>Poisson</b> and <b>Gamma</b> models.
      </p>
      <router-link to="/prepareSimulation" class="btn-primary">
        Prepare a simulation
      </router-link>
    </section>

    <section class="goal">
      <h2>🎯 System Goal</h2>
      <ul>
        <li>Analysis of team history (matches, goals scored and conceded)</li>
        <li>Assessment of offensive and defensive strength</li>
        <li>Consideration of the random nature of results</li>
        <li>Simulation of goal distribution using probabilistic models</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
main, section {
  max-width: 100%;
  overflow-x: hidden;
}
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  min-height: auto;
}

.hero {
  text-align: center;
  max-height: fit-content;
}

.subtitle {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.btn-primary {
  background-color: var(--color-button);
  color: #fff;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
}
.btn-primary:hover {
  background-color: var(--color-hover);
}

.goal ul {
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}
</style>


<script lang="ts">
export default {
  name: "Home"
};
</script>
