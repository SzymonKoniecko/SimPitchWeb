<template>
  <main class="home">
    <section class="hero">
      <h1>SimPitch</h1>
      <p class="subtitle">
        Advanced football match and league simulation based on
        <b>Bayesian</b> models.
      </p>
      <router-link
        to="/prepareSimulation"
        class="btn-primary"
        selenium-id="prepareSimulation"
      >
        Prepare a new simulation
      </router-link>

      <h2>Simulation Parameters</h2>
      <p class="intro-text">
        Configuration defaults and valid ranges based on current engine tuning:
      </p>

      <div class="params-grid-container">
        <div class="param-box">
          <div class="param-header"><h4>Noise Factor</h4></div>
          <p class="param-range">Range: 0.10 – 0.15</p>
          <p class="param-desc">Determines the randomness...</p>
        </div>
        <div class="param-box">
          <div class="param-header"><h4>Home Advantage</h4></div>
          <p class="param-range">Range: 1.03 – 1.07</p>
          <p class="param-desc">Multiplier for home team...</p>
        </div>
        <div class="param-box">
          <div class="param-header"><h4>Confidence Level</h4></div>
          <p class="param-range">Range: 0.90 – 1.10</p>
          <p class="param-desc">Scales impact of history...</p>
        </div>
        <div class="param-box">
          <div class="param-header"><h4>Games to Trust</h4></div>
          <p class="param-range">Range: 10 – 20</p>
          <p class="param-desc">Burn-in period...</p>
        </div>
      </div>
    </section>

    <section class="models-grid" selenium-id="simulation-models">
      <h2>Simulation Models</h2>
      <p class="intro-text">
        Choose the model that best fits your analytical needs.
      </p>

      <div class="grid-container">
        <div class="card model-card">
          <h3>📊 1. Standard Poisson</h3>
          <span class="badge default">Default</span>
          <p>Classic model treating home/away as independent.</p>
        </div>
        <div class="card model-card recommended">
          <h3>⚽ 2. Dixon-Coles</h3>
          <span class="badge recommended-badge">Recommended</span>
          <p>Fixes standard model weakness via Tau correction.</p>
        </div>
        <div class="card model-card">
          <h3>🔗 3. Bivariate Poisson</h3>
          <span class="badge advanced">Advanced</span>
          <p>Assumes results aren't independent (covariance).</p>
        </div>
        <div class="card model-card">
          <h3>🚀 4. Advanced</h3>
          <span class="badge experimental">Dynamic</span>
          <p>Includes momentum and "Hot Hand" metrics.</p>
        </div>
      </div>
    </section>

    <section class="visualizations-grid" selenium-id="visualizations">
      <div class="viz-container-full">
        <h2>📈 Analytics Visualization</h2>
        <div class="viz-wrapper">
          <div class="viz-item">
            <h3>Heat Map</h3>
            <img :src="monteCarlo" alt="Monte Carlo Heat Map" />
          </div>
          <div class="viz-item">
            <h3>Posterior (Gamma)</h3>
            <img :src="posterior" alt="Posterior Distribution" />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import monteCarlo from "@/assets/monte_carlo_example.png";
import posterior from "@/assets/posterior_example.png";
</script>

<style scoped>
main.home {
  background-color: var(--color-bg);
  color: var(--color-text-main);
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem;
  padding: 3rem 2rem;
  min-height: 100vh;
}

section {
  box-sizing: border-box;
}

.hero,
.models-grid {
  flex: 1 1 calc(50% - 2rem);
  min-width: 800px;
}

.visualizations-grid {
  flex: 1 1 100%;
  max-width: 1400px;
  margin-top: 2rem;
  border-top: 1px solid var(--color-grid);
  padding-top: 2rem;
}


.hero {
  text-align: left;
  display: flex;
  flex-direction: column;
}

.hero h1,
.hero > .subtitle,
.hero > .btn-primary {
  align-self: center;
  text-align: center;
}

.models-grid {
  text-align: left;
}

.models-grid h2,
.hero h2 {
  color: var(--color-text-third);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 10px;
  display: inline-block;
  margin-bottom: 1rem;
}

.intro-text {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}

.params-grid-container {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(250px, 1fr)
  ); /* Mniejsze kafle */
  gap: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.viz-container-full {
  text-align: center;
}
.viz-wrapper {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.viz-item {
  background: var(--color-surface);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--color-grid);
  max-width: 500px;
}
.viz-item img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-main);
}
.subtitle {
  color: var(--color-text-secondary);
  font-size: 1.2rem;
  margin-bottom: 2rem;
}
.subtitle b {
  color: var(--color-accent-green);
}

.btn-primary {
  background-color: var(--color-button-primary);
  color: var(--color-button-text);
  border-radius: 8px;
  padding: 0.8rem 2rem;
  text-decoration: none;
  font-weight: bold;
  margin-bottom: 3rem;
  box-shadow: 0 4px 14px var(--color-shadow-button);
}
.btn-primary:hover {
  background-color: var(--color-button-primary-hover);
}

.param-box,
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-grid);
  padding: 1.2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--color-shadow-app);
}
.param-header h4,
.card h3 {
  margin: 0;
  color: var(--color-text-main);
}
.param-range {
  color: var(--color-accent-yellow);
  background: var(--color-surface-contrast);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.85rem;
  margin: 0.5rem 0;
}
.param-desc,
.card p {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.recommended {
  border: 2px solid var(--color-accent-green);
  position: relative;
}
.badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}
.badge.default {
  background: var(--color-surface-contrast);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-grid);
}
.badge.recommended-badge {
  background: var(--color-accent-green);
  color: #000;
}
.badge.advanced {
  background: var(--color-accent-blue);
  color: #fff;
}
.badge.experimental {
  background: var(--color-heatmap-max);
  color: #fff;
}

@media (max-width: 900px) {
  .hero,
  .models-grid {
    flex: 1 1 100%;
    max-width: 100%;
  }

  main.home {
    padding: 1.5rem;
  }
}
</style>
