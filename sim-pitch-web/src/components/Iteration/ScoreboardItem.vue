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
                <td>{{ getTeamName(p.teamId) }}</td>
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
                <td>{{ getTeamName(s.teamId) }}</td>
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
</template>

<style lang="css" scoped>

</style>

<script setup lang="ts">
import { computed } from 'vue';
import type { iterationPreview } from '../../models/iterationPreview';
import type { Team } from '../../models/team';
import type { Scoreboard } from '../../models/scoreboard';
defineOptions({ name: "ScoreboardItem" });
type Props = {
    teams: Team[];
    iteration_preview?: iterationPreview[]
    scoreboard?: Scoreboard | undefined
    variant?: "preview" | "complete_details"
}
const props = defineProps<Props>();
const variant = computed(() => props.variant ?? "preview");

const getTeamName = (id: string) => props.teams.find(t => t.id === id)?.name ?? id

</script>