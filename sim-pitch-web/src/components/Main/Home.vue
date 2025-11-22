<template>
  <main class="home">
    <section class="hero">
      <h1>⚽ SimPitch</h1>
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
      </router-link><h2>🎛️ Simulation Parameters</h2>
      <p class="intro-text">
        Configuration defaults and valid ranges based on current engine tuning:
      </p>

      <div class="params-grid-container">
        <div class="param-box">
          <div class="param-header">
            <h4>Noise Factor</h4>
          </div>
          <p class="param-range">Range: 0.10 – 0.15</p>
          <p class="param-desc">
            Determines the randomness of the outcome. A factor of 0.12
            introduces realistic unpredictability without total chaos.
          </p>
          <br/>
        </div>

        <div class="param-box">
          <div class="param-header">
            <h4>Home Advantage</h4>
          </div>
          <p class="param-range">Range: 1.03 – 1.07</p>
          <p class="param-desc">
            The multiplier applied to the home team's expected goals (Lambda).
            Default simulates a ~5% scoring boost.
          </p>
          <br/>
        </div>

        <div class="param-box">
          <div class="param-header">
            <h4>Confidence Level</h4>
          </div>
          <p class="param-range">Range: 0.90 – 1.10</p>
          <p class="param-desc">
            Scales the impact of historical data. Values > 1.0 give more weight
            to established team strength metrics.
          </p>
          <br/>
        </div>

        <div>
          <div class="param-header">
            <h4>Games to Reach Trust</h4>
          </div>
          <p class="param-range">Range: 10 – 20</p>
          <p class="param-desc">
            The "burn-in" period. Number of historical matches required before
            the system fully trusts a team's calculated strength.
          </p>
        </div>
          <br/>
      </div>
    </section>

    <section class="models-grid" selenium-id="simulation-models">
      <h2>🧠 Simulation Models</h2>
      <p class="intro-text">
        Choose the model that best fits your analytical needs.
      </p>

      <div class="grid-container">
        <div class="card model-card">
          <h3>📊 1. Standard Poisson</h3>
          <span class="badge default">Default</span>
          <p>
            <strong>Best for:</strong> Quick simulations and general insights.
          </p>
          <p>
            Classic model treating home and away goals as independent events.
            Fast and stable, though may slightly underestimate draws.
          </p>
        </div>

        <div class="card model-card recommended">
          <h3>⚽ 2. Dixon-Coles</h3>
          <span class="badge recommended-badge">Recommended</span>
          <p><strong>Best for:</strong> Realistic league simulations.</p>
          <p>
            Fixes the standard model's weakness via Tau correction, increasing
            probability of low-scoring draws (0-0, 1-1). Best reflects real
            league tables.
          </p>
        </div>

        <div class="card model-card">
          <h3>🔗 3. Bivariate Poisson</h3>
          <span class="badge advanced">Advanced</span>
          <p>
            <strong>Best for:</strong> Correlation analysis and "battle
            matches".
          </p>
          <p>
            Assumes results aren't independent. Excellently simulates open
            matches (e.g., 3-3) and closed ones, using covariance (shared chaos
            factor).
          </p>
        </div>

        <div class="card model-card">
          <h3>🚀 4. Advanced (Momentum)</h3>
          <span class="badge experimental">Dynamic</span>
          <p><strong>Best for:</strong> Short-term predictions ("Hot Hand").</p>
          <p>
            Combines Dixon-Coles logic with dynamic form system. Teams "on fire"
            receive attack bonuses, allowing prediction of upsets.
          </p>
        </div>
      </div>
    </section>

    <section class="visualizations-grid" selenium-id="visualizations">
      <div class="viz-item">
        <h3>Heat Map</h3>
        <img :src="monteCarlo" alt="Monte Carlo Heat Map" />
      </div>
    </section>

    <section class="visualizations-grid" selenium-id="visualizations">
      <div class="viz-item">
        <h3>Posterior (Gamma)</h3>
        <img :src="posterior" alt="Posterior Distribution" />
      </div>
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
  max-width: 600px;
}

.hero,
.text,
.img {
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
.models-grid,
.visualizations-grid {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.card {
  background: #fff; /* or color matching your theme */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.recommended {
  border-color: #42b983; /* Vue color or other accent */
  border-width: 2px;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 10px;
  background: #eee;
}

.badge.recommended-badge {
  background: #42b983;
  color: white;
}

.visualizations-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.viz-item img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}
.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 8px;
}

.param-header h4 {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
}

.param-value {
  background: #2c3e50;
  color: #fff;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
  font-size: 0.9rem;
}

.param-range {
  font-size: 0.85rem;
  color: #666;
  margin: 0 0 8px 0;
  font-family: monospace;
}

.param-desc {
  font-size: 0.9rem;
  line-height: 1.4;
  color: #444;
  margin: 0;
}


</style>

<script setup lang="ts">
import monteCarlo from "@/assets/monte_carlo_example.png";
import posterior from "@/assets/posterior_example.png";
</script>
