<template>
  <section class="legend-section">
    <details close class="custom-chart-details">
      <summary class="custom-chart-summary">
        <div class="summary-content">
          <span class="summary-title">📚 Legend & Parameters Guide</span>
          <span class="summary-subtitle">Understanding Simulation Metrics</span>
        </div>
      </summary>

      <div class="chart-wrapper">
        <div class="legend-tabs">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-button', { active: activeTab === tab.id }]"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <div v-show="activeTab === 'simulation'" class="tab-content">
          <h3>🎮 Simulation Parameters</h3>
          <div class="params-grid">
            <div class="param-card">
              <h4>Seed</h4>
              <p><strong>Type:</strong> Integer</p>
              <p><strong>Description:</strong> Random number generator seed. Use the same seed to reproduce identical simulation results.</p>
              <p><strong>Example:</strong> <code>1000</code></p>
              <p><strong>Impact:</strong> Affects all stochastic outcomes (goal probabilities, match results).</p>
            </div>

            <div class="param-card">
              <h4>Iterations</h4>
              <p><strong>Type:</strong> Integer (1-10000)</p>
              <p><strong>Description:</strong> Number of complete season simulations to run. More iterations = more accurate results but slower computation.</p>
              <p><strong>Example:</strong> <code>1000</code> (recommended)</p>
              <p><strong>Impact:</strong> Higher iterations reduce variance in final predictions.</p>
            </div>

            <div class="param-card">
              <h4>Home Advantage</h4>
              <p><strong>Type:</strong> Float (typically 1.01-1.15)</p>
              <p><strong>Description:</strong> Multiplier for home team's attack strength. Standard value is ~1.05 (5% boost).</p>
              <p><strong>Example:</strong> <code>1.05</code></p>
              <p><strong>Formula:</strong> Home_λ = λ_home × HomeAdvantage</p>
            </div>

            <div class="param-card">
              <h4>Noise Factor</h4>
              <p><strong>Type:</strong> Float (0.0-1.0)</p>
              <p><strong>Description:</strong> Adds randomness to model (simulates "luck"). 0 = deterministic, 0.1+ = realistic variance.</p>
              <p><strong>Example:</strong> <code>0.1</code></p>
              <p><strong>Impact:</strong> Higher noise = more unpredictable matches (like real football).</p>
            </div>

            <div class="param-card">
              <h4>Games To Reach Trust</h4>
              <p><strong>Type:</strong> Integer</p>
              <p><strong>Description:</strong> Number of matches required before treating Likelihood as reliable estimate. Before this, Posterior (historical) strength dominates.</p>
              <p><strong>Example:</strong> <code>10</code></p>
              <p><strong>Impact:</strong> Affects how quickly recent form influences predictions.</p>
            </div>

            <div class="param-card">
              <h4>Confidence Level</h4>
              <p><strong>Type:</strong> Float (0.0-1.0, typically 0.95)</p>
              <p><strong>Description:</strong> Statistical confidence interval for predictions. 0.95 = 95% confidence.</p>
              <p><strong>Example:</strong> <code>0.95</code></p>
              <p><strong>Impact:</strong> Affects confidence bands in probability estimates.</p>
            </div>

            <div class="param-card">
              <h4>Season Years</h4>
              <p><strong>Type:</strong> Array of Strings (YYYY/YYYY format)</p>
              <p><strong>Description:</strong> Historical seasons to include. First item = oldest, last item = current season.</p>
              <p><strong>Example:</strong> <code>["2022/2023", "2023/2024", "2024/2025"]</code></p>
              <p><strong>Impact:</strong> More historical data = more stable Posterior estimates.</p>
            </div>

            <div class="param-card">
              <h4>League ID</h4>
              <p><strong>Type:</strong> UUID</p>
              <p><strong>Description:</strong> Unique identifier of the football league to simulate.</p>
              <p><strong>Impact:</strong> Determines which league's teams and historical data are loaded.</p>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'strength'" class="tab-content">
          <h3>⚔️ Team Strength Metrics</h3>
          <div class="params-grid">
            <div class="param-card">
              <h4>Posterior</h4>
              <p><strong>Type:</strong> Object { offensive, defensive }</p>
              <p><strong>Range:</strong> 0.5 - 3.5 (typically)</p>
              <p><strong>Description:</strong> <strong>Long-term strength</strong> estimate (Bayesian posterior). Stable, based on historical data.</p>
              <p><strong>Offensive:</strong> Expected goals per match (higher = better)</p>
              <p><strong>Defensive:</strong> Expected goals conceded per match (lower = better)</p>
              <p><strong>Use When:</strong> Making season-long or end-of-season predictions.</p>
            </div>

            <div class="param-card">
              <h4>Likelihood</h4>
              <p><strong>Type:</strong> Object { offensive, defensive }</p>
              <p><strong>Range:</strong> 0.3 - 4.0 (varies more than Posterior)</p>
              <p><strong>Description:</strong> <strong>Short-term form</strong> (Bayesian likelihood). Volatile, based on recent matches.</p>
              <p><strong>Offensive:</strong> Recent goals per match (momentum indicator)</p>
              <p><strong>Defensive:</strong> Recent goals conceded per match</p>
              <p><strong>Use When:</strong> Making next-match predictions or analyzing current form.</p>
              <p><strong>⚠️ Note:</strong> Unreliable before "Games To Reach Trust" threshold.</p>
            </div>

            <div class="param-card">
              <h4>Expected Goals (xG)</h4>
              <p><strong>Type:</strong> Float</p>
              <p><strong>Range:</strong> 0.5 - 3.5</p>
              <p><strong>Description:</strong> Model's predicted expected goals for this team in next match.</p>
              <p><strong>Formula:</strong> xG = (Posterior.Offensive × Opponent.Posterior.Defensive) / PriorLeagueStrength</p>
              <p><strong>Interpretation:</strong> Team expected to score ~xG goals on average.</p>
            </div>

            <div class="param-card">
              <h4>Prior League Strength</h4>
              <p><strong>Type:</strong> Float</p>
              <p><strong>Range:</strong> 1.5 - 3.5 (typically ~2.5)</p>
              <p><strong>Description:</strong> <strong>Baseline goal rate</strong> for the entire league. Computed from already-played matches.</p>
              <p><strong>Formula:</strong> PriorLeagueStrength = Total_Goals / Total_Matches</p>
              <p><strong>Purpose:</strong> Normalizes team strength estimates relative to league competitiveness.</p>
              <p><strong>Example:</strong> Premier League ≈ 2.8, lower leagues ≈ 2.2</p>
            </div>

            <div class="param-card">
              <h4>Last Update</h4>
              <p><strong>Type:</strong> DateTime</p>
              <p><strong>Description:</strong> Timestamp when team strength was last calculated.</p>
              <p><strong>Impact:</strong> Older updates = less reliable Likelihood (more matches passed).</p>
            </div>

            <div class="param-card">
              <h4>Round ID</h4>
              <p><strong>Type:</strong> UUID / String</p>
              <p><strong>Description:</strong> ID of the league round (matchday) in which strength was calculated.</p>
              <p><strong>Use:</strong> Track which round a team strength snapshot belongs to.</p>
            </div>
          </div>
        </div>

        <!-- STATISTICAL MODELS TAB -->
        <div v-show="activeTab === 'models'" class="tab-content">
          <h3>📊 Statistical Models</h3>
          <div class="params-grid">
            <div class="param-card">
              <h4>Poisson Model</h4>
              <p><strong>Description:</strong> Predicts match goals using team attack/defense strength.</p>
              <p><strong>Assumption:</strong> Goals are independent, random events.</p>
              <p><strong>Formula:</strong> P(goals) = e^(-λ) × λ^k / k!</p>
              <p><strong>Pros:</strong> Simple, fast, widely used</p>
              <p><strong>Cons:</strong> Underestimates draws, assumes independence</p>
            </div>

            <div class="param-card">
              <h4>Dixon-Coles Model</h4>
              <p><strong>Description:</strong> Poisson + correlation correction for 0-0 and 1-1 draws.</p>
              <p><strong>Improvement:</strong> More accurate for low-scoring matches.</p>
              <p><strong>Tau Parameter:</strong> Correlation strength (typically 0.5-0.9)</p>
              <p><strong>Best For:</strong> Leagues with frequent tight matches (e.g., Serie A)</p>
            </div>

            <div class="param-card">
              <h4>Bivariate Poisson</h4>
              <p><strong>Description:</strong> Models home and away goals with correlation.</p>
              <p><strong>Benefit:</strong> Captures home team attacking advantage when away team defends poorly.</p>
              <p><strong>Use:</strong> More realistic probability matrices for match outcomes.</p>
            </div>

            <div class="param-card">
              <h4>Advanced Momentum</h4>
              <p><strong>Description:</strong> Dixon-Coles + time-decay form factor (Likelihood influence).</p>
              <p><strong>Innovation:</strong> Recent matches have more weight than distant history.</p>
              <p><strong>When Used:</strong> Mid-season predictions (form matters more than initial strength).</p>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'charts'" class="tab-content">
          <h3>📈 Chart Metrics Explained</h3>
          <div class="params-grid">
            <div class="param-card">
              <h4>Attack vs Defense Scatter (Power Map)</h4>
              <p><strong>X-Axis:</strong> Posterior.Offensive (Team Attack Strength)</p>
              <p><strong>Y-Axis:</strong> Posterior.Defensive (Team Defense Weakness) - REVERSED</p>
              <p><strong>Quadrants:</strong></p>
              <ul class="chart-quadrants">
                <li><strong>Top-Right (Dominators):</strong> High attack + Low conceded = Best teams</li>
                <li><strong>Top-Left (Murarze):</strong> Low attack + Low conceded = Defensive specialists</li>
                <li><strong>Bottom-Right (Szaleńcy):</strong> High attack + High conceded = Attacking chaos</li>
                <li><strong>Bottom-Left (Słabeusze):</strong> Low attack + High conceded = Struggling teams</li>
              </ul>
            </div>

            <div class="param-card">
              <h4>Form Evolution (Line Chart)</h4>
              <p><strong>X-Axis:</strong> Match Round / Sequence Number</p>
              <p><strong>Y-Axis (Line 1 - Solid):</strong> Posterior (Long-term strength)</p>
              <p><strong>Y-Axis (Line 2 - Dashed):</strong> Likelihood (Current form)</p>
              <p><strong>Interpretation:</strong></p>
              <ul>
                <li>Lines diverging upward = Team improving (good form)</li>
                <li>Lines diverging downward = Team declining (bad form)</li>
                <li>Lines converging = Form stabilizing toward baseline</li>
              </ul>
            </div>

            <div class="param-card">
              <h4>Result Probability Matrix (Heatmap)</h4>
              <p><strong>X-Axis:</strong> Home Team Goals (0-5+)</p>
              <p><strong>Y-Axis:</strong> Away Team Goals (0-5+)</p>
              <p><strong>Cell Color Intensity:</strong> Probability of that exact scoreline</p>
              <p><strong>Most Likely Outcome:</strong> Brightest cell (red/hot)</p>
              <p><strong>Model:</strong> Generated from Poisson/Dixon-Coles predictions</p>
            </div>

            <div class="param-card">
              <h4>Win Probability (Bar Chart)</h4>
              <p><strong>X-Axis:</strong> Teams in league or participating in simulation</p>
              <p><strong>Y-Axis:</strong> Probability of winning the league (0-100%)</p>
              <p><strong>Aggregation:</strong> Across all simulation iterations</p>
              <p><strong>Interpretation:</strong> If 1000 iterations, Man City with 450 wins = 45% title chance</p>
            </div>

            <div class="param-card">
              <h4>Momentum Indicator</h4>
              <p><strong>Rising Likelihood:</strong> Team gaining momentum (form improving)</p>
              <p><strong>Falling Likelihood:</strong> Team losing momentum (form declining)</p>
              <p><strong>Gap to Posterior:</strong> Larger gap = more volatile current state</p>
              <p><strong>Crossing Point:</strong> When Likelihood crosses Posterior = form returns to average</p>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'glossary'" class="tab-content">
          <h3>📖 Quick Glossary</h3>
          <div class="glossary-grid">
            <div class="glossary-item">
              <h4>λ (Lambda)</h4>
              <p>Expected goals parameter in Poisson model. λ = (Attack × Defense) / LeagueAvg</p>
            </div>
            <div class="glossary-item">
              <h4>Bayesian Inference</h4>
              <p>Statistical method updating beliefs with new data. Prior (history) + Evidence (recent matches) = Posterior (current estimate)</p>
            </div>
            <div class="glossary-item">
              <h4>Deterministic</h4>
              <p>Output always same for same input. Seed=1000 → always same result.</p>
            </div>
            <div class="glossary-item">
              <h4>Stochastic</h4>
              <p>Random/probabilistic. Same team can have different outcomes due to randomness.</p>
            </div>
            <div class="glossary-item">
              <h4>xG (Expected Goals)</h4>
              <p>Predicted goals a team will score, weighted by shot quality. 2.1 xG = expected to score ~2 goals.</p>
            </div>
            <div class="glossary-item">
              <h4>Posterior</h4>
              <p>Updated belief after observing data. In football: strength estimate after seeing match results.</p>
            </div>
            <div class="glossary-item">
              <h4>Likelihood</h4>
              <p>How probable observed data is under current hypothesis. In football: fit of recent form to expected model.</p>
            </div>
            <div class="glossary-item">
              <h4>Prior</h4>
              <p>Initial belief before new data. In football: team strength before current season starts.</p>
            </div>
          </div>
        </div>
      </div>
    </details>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeTab = ref('simulation');

const tabs = [
  { id: 'simulation', label: 'Simulation', icon: '🎮' },
  { id: 'strength', label: 'Strength Metrics', icon: '⚔️' },
  { id: 'models', label: 'Models', icon: '📊' },
  { id: 'charts', label: 'Charts', icon: '📈' },
  { id: 'glossary', label: 'Glossary', icon: '📖' },
];
</script>

<style scoped>

.legend-section {
  width: 100%;
  background-color: var(--color-surface);
  border-radius: 1rem;
  padding: 0;
  box-shadow: 0 0 20px var(--color-shadow-app);
  color: var(--color-text-main);
}

.custom-chart-details {
  background-color: var(--color-surface);
  border: 1px solid var(--color-grid);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px var(--color-shadow-app);
}

.custom-chart-details[open] {
  transform: rotate(180deg);
}

.custom-chart-summary {
  cursor: pointer;
  padding: 1rem;
  background-color: var(--color-surface-sections);
  border-bottom: 1px solid var(--color-grid);
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s ease;
  list-style: none;
}

.custom-chart-summary::-webkit-details-marker {
  display: none;
}

.summary-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.summary-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: var(--color-text-main);
}

.summary-subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-weight: normal;
}
.chart-wrapper {
  padding: 1.5rem;
  min-height: 400px;
}

.legend-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-grid);
}

.tab-button {
  padding: 0.6rem 1.2rem;
  background-color: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-grid);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tab-button:hover {
  background-color: var(--color-surface-sections);
  color: var(--color-text-main);
}

.tab-button.active {
  background-color: var(--color-accent-green);
  color: #000;
  border-color: var(--color-accent-green);
}

.tab-content {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-content h3 {
  color: var(--color-accent-green);
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

.params-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
}

.param-card {
  background-color: var(--color-surface-sections);
  border: 1px solid var(--color-grid);
  border-radius: 8px;
  padding: 1.2rem;
  transition: all 0.2s ease;
}

.param-card:hover {
  background-color: var(--color-surface);
  border-color: var(--color-accent-blue);
  box-shadow: 0 4px 12px rgba(41, 121, 255, 0.2);
}

.param-card h4 {
  color: var(--color-accent-yellow);
  margin: 0 0 0.8rem 0;
  font-size: 1.1rem;
}

.param-card p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.param-card strong {
  color: var(--color-text-main);
}

.param-card code {
  background-color: var(--color-grid);
  color: var(--color-accent-green);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.param-card ul {
  margin: 0.8rem 0;
  padding-left: 1.5rem;
}

.param-card li {
  margin: 0.4rem 0;
  color: var(--color-text-secondary);
}

.chart-quadrants {
  list-style: none;
  padding-left: 0;
}

.chart-quadrants li {
  padding: 0.5rem 0.8rem;
  margin: 0.6rem 0;
  background-color: var(--color-grid);
  border-radius: 4px;
  border-left: 3px solid var(--color-accent-blue);
}

/* GLOSSARY GRID */
.glossary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;
}

.glossary-item {
  background-color: var(--color-surface-sections);
  border-left: 4px solid var(--color-accent-green);
  border-radius: 6px;
  padding: 1rem;
  transition: transform 0.2s ease;
}

.glossary-item:hover {
  transform: translateX(4px);
  background-color: var(--color-surface);
}

.glossary-item h4 {
  color: var(--color-accent-green);
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.glossary-item p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .legend-tabs {
    flex-direction: column;
  }

  .tab-button {
    width: 100%;
    text-align: left;
  }

  .params-grid,
  .glossary-grid {
    grid-template-columns: 1fr;
  }

  .chart-wrapper {
    padding: 1rem;
  }
}
</style>
