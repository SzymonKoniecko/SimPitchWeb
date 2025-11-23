<template>
  <details>
  <summary><span>Teams strengths</span></summary>
    <section class="team-strengths">
      <!-- HOME -->
      <article class="team-strength ts-home" v-if="homeTeamStrength">
        <p>
          <strong>Expected Goals:</strong>
          {{ homeTeamStrength.expectedGoals.toFixed(2) }}
        </p>
        <p class="ts-likelihood">
          <strong>Off:</strong> {{ homeTeamStrength.posterior.offensive.toFixed(3) }}
          |
          <strong>Def:</strong> {{ homeTeamStrength.posterior.defensive.toFixed(3) }}
        </p>
        <RadarChart v-if="homeTeamStrength" :team-strength="homeTeamStrength" />
      </article>

      <details close>
        <summary><span>Metric legend</span></summary>
        <div class="metrics-legend">
          <div class="metric-item">
            <span class="metric-label">⚔️ Attack</span>
            <span class="metric-desc"
              >Normalized offensive strength (0-100). Higher is better.</span
            >
          </div>
          <div class="metric-item">
            <span class="metric-label">🛡️ Defense</span>
            <span class="metric-desc"
              >Defensive solidity. 100 means a "wall", 0 means very leaky.</span
            >
          </div>
          <div class="metric-item">
            <span class="metric-label">📈 Form</span>
            <span class="metric-desc"
              >Momentum. >50 means team performs better than expected recently.</span
            >
          </div>
          <div class="metric-item">
            <span class="metric-label">🏆 Win Rate</span>
            <span class="metric-desc"
              >Percentage of games won in the current season simulation.</span
            >
          </div>
          <div class="metric-item">
            <span class="metric-label">🎯 Efficiency</span>
            <span class="metric-desc"
              >Actual goals scored per match ratio vs league average.</span
            >
          </div>
        </div>
      </details>
      <!-- AWAY -->
      <article class="team-strength ts-away" v-if="awayTeamStrength">
        <p>
          <strong>Expected Goals:</strong>
          {{ awayTeamStrength.expectedGoals.toFixed(2) }}
        </p>
        <p class="ts-likelihood">
          <strong>Off:</strong> {{ awayTeamStrength.posterior.offensive.toFixed(3) }}
          |
          <strong>Def:</strong> {{ awayTeamStrength.posterior.defensive.toFixed(3) }}
        </p>
        <RadarChart v-if="awayTeamStrength" :team-strength="awayTeamStrength" />
      </article>
    </section>

    <footer>
      <small v-if="homeTeamStrength.roundId && awayTeamStrength.roundId">
        Round: {{ homeTeamStrength.roundId }}
      </small>
      <small v-else>Incorrect roundId</small>
    </footer>
  </details>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { TeamStrength } from "../../models/Iterations/teamStrength";
import RadarChart from "../Diagrams/RadarChart.vue";

type Props = {
  homeTeamStrengthData: TeamStrength;
  awayTeamStrengthData: TeamStrength;
};
const props = defineProps<Props>();
const homeTeamStrength = computed(() => props.homeTeamStrengthData);
const awayTeamStrength = computed(() => props.awayTeamStrengthData);
</script>

<style scoped>
details {
  width: 100%;
}

.team-strengths {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  width: 100%;
}

.team-strength {
  background: var(--color-surface-alt);
  border: 1px solid var(--color-grid);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-text-main);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.ts-home {
  text-align: left;
}
.ts-away {
  text-align: right;
}

.team-strength:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

.ts-likelihood {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

/* --- Footer --- */
footer {
  padding-top: 0.4rem;
  font-size: 0.75rem;
  text-align: right;
}

/* --- Responsive --- */
@media (max-width: 600px) {
  .team-strengths {
    flex-direction: column;
    align-items: stretch;
  }
  .team-strength {
    max-width: 100%;
  }
}

.metrics-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid var(--color-grid);
  background-color: var(--color-surface-sections);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.metric-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-accent-blue);
}

.metric-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

/* Responsive tweaks */
@media (max-width: 600px) {
  .metrics-legend {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
}
</style>
