<template>
  <article class="match-card">
    <header class="match-header">
      <span
        class="match-status"
        :class="{ played: matchRound.isPlayed, draw: matchRound.isDraw }"
      >
        {{ matchRound.isPlayed ? (matchRound.isDraw ? "Draw" : "Played") : "Upcoming" }}
      </span>
    </header>
    <section class="match-body">
      <div class="match-line">
        <!-- HOME -->
        <div class="team home-team">
          <span class="team-label">Home</span>
          <TeamCard :id="matchRound.homeTeamId" variant="normal" />
        </div>

        <!-- SCORE -->
        <div class="score">
          <span class="home-goals">{{ matchRound.homeGoals }}</span>
          <span class="separator">:</span>
          <span class="away-goals">{{ matchRound.awayGoals }}</span>
        </div>

        <!-- AWAY -->
        <div class="team away-team">
          <span class="team-label">Away</span>
          <TeamCard :id="matchRound.awayTeamId" variant="normal" />
        </div>
      </div>

      <!-- STRENGTHS BELOW -->
      <div class="strengths-grid" v-if="matchRound.isPlayed">
        <TeamStrengthItem 
            v-if="homeTeamStrength && awayTeamStrength" 
            :homeTeamStrengthData="homeTeamStrength" 
            :awayTeamStrengthData="awayTeamStrength" 
        />
      </div>
    </section>
  </article>
</template>

<script setup lang="ts">
import { computed } from "vue";
import TeamCard from "../Team/TeamCard.vue";
import TeamStrengthItem from "../Team/TeamStrengthItem.vue";
import type { MatchRound } from "../../models/SportsDataModels/matchRound";
import type { Team } from "../../models/SportsDataModels/team";
import type { TeamStrength } from "../../models/Iterations/teamStrength";

type Props = {
  matchRound: MatchRound;
  teams: Team[];
  homeTeamStrength?: TeamStrength | null;
  awayTeamStrength?: TeamStrength | null;
};

const props = defineProps<Props>();

const matchRound = computed(() => props.matchRound);
const homeTeamStrength = computed(() => props.homeTeamStrength);
const awayTeamStrength = computed(() => props.awayTeamStrength);
</script>

<style scoped>
.match-status {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.match-status.draw {
  color: var(--color-accent-blue);
}

.match-round {
  font-weight: 600;
}
.match-header {
  display: flex;
  justify-content: space-between;
  margin: 1rem 1rem;
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}
.match-line {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  width: 100%;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-grid);
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  text-align: center
}

.team-label {
  text-transform: uppercase;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  font-weight: 600;
}

.score {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
  font-weight: bold;
  color: var(--color-accent-green);
  min-width: 6rem;
}

.separator {
  color: var(--color-text-secondary);
  margin: 0 0.5rem;
}

.strengths-grid {
    display: flex;
    width: 100%;
    margin-top: 1rem;
    gap: 1.5rem;
}

@media (max-width: 900px) {
  .match-body {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .score {
    flex-direction: row;
    font-size: 1.6rem;
  }

  .strengths-grid {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
