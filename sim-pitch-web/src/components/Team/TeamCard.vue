<template>
  <article class="team-card" :class="variant">
    <RouterLink class="team-card__link" :to="{ name: 'Team', params: { id } }">
      

      <section v-if="variant === 'mini'" class="team-card__mini">
        <header class="team-card__header">
          <h3 class="team-card__title">
            {{ team?.shortName ?? 'Unknown Team' }}
          </h3>
        </header>
          <p class="team-card__details">
            <strong>Country:</strong> {{ team?.country?.code ?? 'N/A' }}
          </p>
      </section>

      <section v-if="variant === 'normal'" class="team-card__normal">
        <header class="team-card__header">
          <h3 class="team-card__title">
            {{ team?.name ?? 'Unknown Team' }}
          </h3>
        </header>
        <p class="team-name">{{ team?.shortName ?? 'N/A' }}</p>
          <strong>Country:</strong> <p>{{ team?.country?.code ?? 'N/A' }}</p>
      </section>

      <section v-else class="team-card__large">
        <header class="team-card__header">
          <h3 class="team-card__title">
            {{ team?.name ?? 'Unknown Team' }}
          </h3>
        </header>
        <p class="team-name">{{ team?.shortName ?? 'N/A' }}</p>
        <p><strong>Abbr:</strong> ({{ team?.shortName ?? 'N/A' }})</p>
        <p><strong>League:</strong> {{ team?.league?.name ?? 'N/A' }}</p>
        <slot />
      </section>
    </RouterLink>

    <footer v-if="loading || error" class="team-card__footer">
      <span v-if="loading" class="loading">Loading...</span>
      <span v-else class="error">{{ error }}</span>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { RouterLink } from "vue-router";
import { useSportsDataStore } from "../../stores/SportsDataStore";

type Props = {
  id: string;
  variant?: "mini" | "normal" | "large";
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
  if (!store.leagues?.length) await store.loadLeagues();
  if (!store.teams?.length) await store.loadTeams();
};

onMounted(ensureData);
watch(() => props.id, ensureData);
</script>

<style scoped>
.team-card {
  background: var(--color-surface-sections);
  color: var(--color-text-main);
  border-radius: 1rem;
  padding: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  width: 400px;
  height: min-content;
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.45);
}

.team-card.mini {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  text-align: left;
}
.team-card.normal {
  flex-direction: row;
  justify-content: center;
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
}
p {
  font-weight: 600;
}

.team-card.large {
  flex-direction: column;
  gap: 0.25rem;
  font-size: 1rem;
}

.team-card__header {
  margin-bottom: 0.25rem;
}

.team-card__title {
  font-weight: 900;
  font-size: 4ch;
  color: var(--color-accent-blue);
}

.team-card__mini p,
.team-card__normal p,
.team-card__large p {
  letter-spacing: 0.1em;
  margin: 0.15rem 0;
  color: var(--color-text-secondary);
}

.team-card__link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.team-card__link:hover .team-card__title {
  color: var(--color-accent-green);
}

.team-card__footer {
  margin-top: 0.5rem;
  font-size: 0.75rem;
}
.team-name{
  font-size: 1.2rem;
}
.error {
  color: #ff5252;
}

.loading {
  color: var(--color-accent-yellow);
}
</style>
