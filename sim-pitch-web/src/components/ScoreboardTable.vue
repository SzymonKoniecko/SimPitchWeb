<template>
  <table class="w-full mt-4 border-collapse">
    <thead class="bg-gray-700">
      <tr>
        <th class="p-2 text-left">#</th>
        <th class="p-2 text-left">Drużyna</th>
        <th class="p-2 text-center">M</th>
        <th class="p-2 text-center">W</th>
        <th class="p-2 text-center">R</th>
        <th class="p-2 text-center">P</th>
        <th class="p-2 text-center">Bramki</th>
        <th class="p-2 text-center">Pkt</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(team, idx) in results"
        :key="team.id"
        :class="{
          'bg-green-900': idx < 3,
          'bg-red-900': idx >= results.length - 2
        }"
        class="hover:bg-gray-700 transition"
      >
        <td class="p-2">{{ idx + 1 }}</td>
        <td class="p-2">{{ team.name }}</td>
        <td class="p-2 text-center">{{ team.matches }}</td>
        <td class="p-2 text-center">{{ team.wins }}</td>
        <td class="p-2 text-center">{{ team.draws }}</td>
        <td class="p-2 text-center">{{ team.losses }}</td>
        <td class="p-2 text-center">{{ team.goalsFor }}:{{ team.goalsAgainst }}</td>
        <td class="p-2 text-center font-bold">{{ team.points }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
defineProps({
  results: Array
});
</script>
