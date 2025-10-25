<template>
  <details>
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
      </article>

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

type Props = { 
  homeTeamStrengthData: TeamStrength; 
  awayTeamStrengthData: TeamStrength; 
};
const props = defineProps<Props>();
const homeTeamStrength = computed(() => props.homeTeamStrengthData)
const awayTeamStrength = computed(() => props.awayTeamStrengthData)
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
  max-width: 220px;
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
</style>
