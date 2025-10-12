<template>
  <article class="team-card" :class="variant">
    <header class="team-card__header">
      <RouterLink class="team-card__name" :to="{ name: 'Team', params: { id } }">
      </RouterLink>
      <section v-if="variant === 'mini'" class="team-card__mini">
        <p><strong>{{ team?.shortName }}</strong></p>
        <p><strong>Country:</strong> {{ team?.country?.code ?? 'N/A' }}</p>
      </section>
    </header>

    <section v-if="variant === 'large'" class="team-card__body">
      <p><strong>Team:</strong> {{ team?.name }}</p>
      <p><strong></strong> ({{ team?.shortName }})</p>
      <p><strong>League:</strong> {{ team?.league?.name ?? 'N/A' }}</p>
      <!-- Slot for extra details when using the large variant -->
      <slot />
    </section>

    <footer v-if="loading || error" class="team-card__footer">
      <span v-if="loading">Loading...</span>
      <span v-else class="error">{{ error }}</span>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";
import { useSportsDataStore } from "../stores/SportsDataStore";

type Props = {
  id: string;
  variant?: "mini" | "large";
};

const props = defineProps<Props>();

const variant = computed(() => props.variant ?? "mini");

const store = useSportsDataStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const team = computed(() => {
  const list = Array.isArray(store.teams) ? store.teams : [];
  return list.find(t => t.id === props.id);
});

const ensureData = async () => {
  if (!Array.isArray(store.leagues) || store.leagues.length === 0) {
    await store.loadLeagues();
  }
  if (!Array.isArray(store.teams) || store.teams.length === 0) {
    await store.loadTeams();
  }
};

onMounted(async () => {
  await ensureData();
});

watch(
  () => props.id,
  async () => {
    await ensureData();
  }
);
</script>

<style scoped>
.team-card { padding: 0.75rem 1rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; }
.team-card.mini { display: flex; align-items: baseline; gap: 0.5rem; }
article.team-card.mini { max-width: min-content; }
.team-card.large { display: block; }
.team-card__header { display: flex; align-items: baseline; gap: 0.5rem; }
.team-card__name { font-weight: 600; text-decoration: none; color: #1e40af; }
.team-card__name:hover { text-decoration: underline; }
.team-card__league { color: #64748b; }
.error { color: #b00020; }
</style>
