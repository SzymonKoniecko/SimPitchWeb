<template>
  <main class="home">
    <section class="hero">
      <h1>⚽ SimPitch</h1>
      <p class="subtitle">
        Match and league round simulation based on <b>Poisson</b> and <b>Gamma</b> models.
      </p>
      <router-link to="/prepareSimulation" class="btn-primary">
        Prepare a new simulation
      </router-link>
    </section>

    <section class="text">
      <h2>🎯 System Goal</h2>
      <ul>
        <li>Analysis of team history (matches, goals scored and conceded)</li>
        <li>Assessment of offensive and defensive strength</li>
        <li>Consideration of the random nature of results</li>
        <li>Simulation of goal distribution using probabilistic models</li>
      </ul>
    </section>

    <section class="text">
      <h2> Heat map (not developed)</h2>
      <img :src="monteCarlo" alt="Monte Carlo Example" />
    </section>

    <section class="text">
      <h2> Posterior (Gamma) (not developed)</h2>
      <img :src="posterior" alt="Monte Carlo Example" />
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  gap: 3rem;
  max-width: 100%;
  overflow-x: hidden;
  padding: 5rem;
}

section {
  flex: 1 1 45%;
  box-sizing: border-box;
  max-width: 600px
}

.hero, .text, .img {
  text-align: center;
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
  display: inline-block;
  margin-top: 1rem;
}
.btn-primary:hover {
  background-color: var(--color-hover);
}

.text ul {
  text-align: left;
  max-width: 400px;
  margin: 0 auto;
}

.img img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
</style>


<script setup lang="ts">
import monteCarlo from '@/assets/monte_carlo_example.png'
import posterior from '@/assets/posterior_example.png'
</script>
