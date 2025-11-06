<template>
    <table v-if="variant === 'preview'">       
        <thead>
            <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="p in iteration_preview" :key="p.teamId + '-' + p.iterationIndex">
                <td>{{ p.rank }}</td>
                <td><TeamCard :id="p.teamId" :variant="'mini'" /></td>
                <td>{{ p.points }}</td>
            </tr>
        </tbody>
    </table>
    <table v-else-if="variant === 'complete_details'">       
        <thead>
            <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Match Played</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Draws</th>
                <th>Goals for</th>
                <th>Goals against</th>
                <th>Goals difference</th>
                <th>Points</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="s in scoreboard?.scoreboardTeams">
                <td>{{ s.rank }}</td>
                <td><TeamCard :id="s.teamId" :variant="'mini'" /></td>
                <td>{{ s.matchPlayed }}</td>
                <td>{{ s.wins }}</td>
                <td>{{ s.losses }}</td>
                <td>{{ s.draws }}</td>
                <td>{{ s.goalsFor }}</td>
                <td>{{ s.goalsAgainst }}</td>
                <td>{{ s.goalsFor - s.goalsAgainst }}</td>
                <td>{{ s.points }}</td>
            </tr>
        </tbody>
    </table>
    <details close v-else-if="variant === 'simulation_averange' && simulationTeamStats">
    <summary>Teams averange statistics</summary>
        <table>
        <thead>
            <tr>
                <th>Team</th>
                <th>Points</th>
                <th>Wins</th>
                <th>Losses</th>
                <th>Draws</th>
                <th>Goals for</th>
                <th>Goals against</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="stat in teamStats">
                <td><TeamCard :id="stat.teamId" :variant="'mini'" /></td>
                <td>{{ stat.averangePoints }}</td>
                <td>{{ stat.averangeWins }}</td>
                <td>{{ stat.averangeLosses }}</td>
                <td>{{ stat.averangeDraws }}</td>
                <td>{{ stat.averangeGoalsFor }}</td>
                <td>{{ stat.averangeGoalsAgainst }}</td>
            </tr>
        </tbody></table>
    </details>
</template>

<style lang="css" scoped>
table tr td{
    background-color: var(--color-bg);
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import type { IterationPreview } from '../../models/Iterations/iterationPreview';
import type { Scoreboard } from '../../models/Scoreboards/scoreboard';
import { sortTeamStats, type SimulationTeamStats } from '../../models/Simulations/simulationTeamStats';
import TeamCard from '../Team/TeamCard.vue';
defineOptions({ name: "ScoreboardItem" });
type Props = {
    iteration_preview?: IterationPreview[]
    scoreboard?: Scoreboard | undefined
    simulationTeamStats?: SimulationTeamStats[];
    variant?: "preview" | "complete_details" | "simulation_averange"
}
const props = defineProps<Props>();
const variant = computed(() => props.variant ?? "preview");

const teamStats = computed(() =>
  sortTeamStats(props.simulationTeamStats)
);


</script>