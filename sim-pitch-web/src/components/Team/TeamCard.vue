<template>
    <RouterLink class="team-card__link" :to="{ name: 'Team', params: { id } }">
      <section v-if="variant === 'mini'" class="team-card__mini">
      {{ team?.name ?? 'Unknown Team' }}
      </section>

      <section v-else-if="variant === 'normal'" class="team-card__normal">
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
  return store.teams.find(t => t.id === props.id);
});

const ensureData = async () => {
  if (!store.leagues?.length) await store.loadLeagues();
  if (!store.teams?.length) await store.loadTeams();
};
onMounted(ensureData);
watch(() => props.id, ensureData);
</script>

<style scoped>
section{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; 
  justify-content: center;
  text-align: center;
}
.team-card {
  background: var(--color-surface-sections);
  color: var(--color-text-main);
  border-radius: 1rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  height: min-content;
  width: max-content;
  box-sizing: border-box;
}

.team-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.45);
}

/* --- MINI VARIANT --- */
.team-card.mini {
  font-size: 0.85rem;
  width: 300px;
  padding-top: 0rem;
  padding-left: 0rem;
  padding-right: 0rem;
  padding-bottom: 0rem;
  box-shadow: none;
  background: transparent;
}

.team-card__mini {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 500;
}

/* --- NORMAL VARIANT --- */
.team-card.normal {
  font-size: 0.9rem;
  width: 100%;
  padding: 1rem;
  margin: 0.25rem 0;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* --- LARGE VARIANT --- */
.team-card.large {
  font-size: 1rem;
  width: 100%;
  padding: 1.25rem;
  margin: 0.5rem 0;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* --- SHARED ELEMENTS --- */
.team-card__header,
.team-card__header_mini {
  text-align: center;
}

.team-card__title,
.team-card__title_mini {
  font-size: 0.9rem;
  font-weight: 500;
}

.team-card__title {
  font-size: 4ch;
}

.team-card__title_mini {
  font-size: 2ch;
}

.team-card__normal,
.team-card__large {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.team-card__mini p,
.team-card__normal p,
.team-card__large p {
  letter-spacing: 0.1em;
  color: var(--color-text-secondary);
  margin: 0.25rem 0;
  text-align: center;
}

.team-card__link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.team-card__link:hover .team-card__title {
  color: var(--color-accent-blue);
}

.team-card__footer {
  font-size: 0.75rem;
  text-align: center;
}

.team-name {
  font-size: 1.2rem;
  text-align: center;
}

.error {
  color: #ff5252;
}

.loading {
  color: var(--color-accent-yellow);
}
</style>
