<template>
  <RouterLink class="team-card__link" :to="{ name: 'Team', params: { id } }">
    <section v-if="variant === 'mini'" class="team-card__mini">
      <img :src="getLogo(team?.shortName)" class="team-img_mini" />
      {{ team?.name ?? "Unknown Team" }}
    </section>

    <section v-else-if="variant === 'normal'" class="team-card__normal" :style="{ backgroundImage: `url(${getLogo(team?.shortName)})` }">
      <header class="team-card__header">
        <h3 class="team-card__title">
          {{ team?.name ?? "Unknown Team" }}
        </h3>
      </header>
      <p class="team-name">{{ team?.shortName ?? "N/A" }}</p>
      <strong>Country:</strong>
      <p>{{ team?.country?.code ?? "N/A" }}</p>
    </section>

    <section v-else class="team-card__large">
      <div class="team-card__large-logo-wrapper">
        <img :src="getLogo(team?.shortName)" class="team-img_large" />
      </div>
      
      <div class="team-card__large-content">
        <header class="team-card__header_large">
          <h3 class="team-card__title_large">
            {{ team?.name ?? "Unknown Team" }}
          </h3>
        </header>
        
        <div class="team-card__details-grid">
          <p class="team-name_large">{{ team?.shortName ?? "N/A" }}</p>
          <p><strong>League:</strong> {{ team?.league?.name ?? "N/A" }}</p>
        </div>
        
        <div class="team-card__slot-wrapper">
          <slot />
        </div>
      </div>
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
import { getLogo } from "../../utils/logos";
import type { Team } from "../../models/SportsDataModels/team";
type Props = {
  id: string;
  variant?: "mini" | "normal" | "large";
  team?: Team | undefined;
};

const props = defineProps<Props>();
const variant = computed(() => props.variant ?? "mini");

const store = useSportsDataStore();
const loading = computed(() => store.loading);
const error = computed(() => store.error);

const team = computed(() => {
  if (props.team === undefined) {
     return store.teams.find((t) => t.id === props.id);
  }
  return props.team
});

const ensureData = async () => {
  if (!store.leagues?.length) await store.loadLeagues();
  if (!store.teams?.length) await store.loadTeams();
};
onMounted(ensureData);
watch(() => props.id, ensureData);
</script>

<style scoped>
section {
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

/*  MINI  */
.team-card__mini {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: row; 
  align-items: center;
  justify-content: flex-start; 
  padding: 0.4rem 0.7rem;
  gap: 0.75rem;

  background: var(--color-surface-sections);
  border-radius: 0.5rem;
  text-align: left;
}

.team-img_mini {
  width: 42px;
  height: 42px;
  object-fit: contain;
  
  flex-shrink: 0; 
  pointer-events: none;
}

.team-name_mini-text {
  font-weight: 500;
  line-height: 1.2;
}

/*  Normal  */
.team-card__normal {
  position: relative;
  width: 100%;
  min-height: 150px;

  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  border-radius: 1rem;
  overflow: hidden;
  padding: 1rem;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.team-card__normal::before {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--teamcard-overlay);
  backdrop-filter: blur(2px);
  z-index: 1;
}
/* LARGE */
.team-card__large {
  position: relative;
  width: 100%;
  min-width: 500px;
  min-height: 160px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 2rem;

  background: var(--color-surface-sections);
  color: var(--color-text-main);
  
  border-radius: 1rem;
  padding: 1.5rem 2rem;
  border: 1px solid var(--color-grid);
  box-shadow: 0 4px 15px var(--color-shadow-app);
}

.team-card__large-logo-wrapper {
  flex: 0 0 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.team-img_large {
  width: 110px;
  height: 110px;
  object-fit: contain;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}

.team-card__large-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

.team-card__title_large {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-text-main);
}

.team-name_large {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.team-card__details-grid p {
  margin: 0.25rem 0;
  color: var(--color-text-main);
  font-size: 1rem;
}

.team-card__slot-wrapper {
  margin-top: 1rem;
  width: 100%;
}


.team-card__normal > *,
.team-card__large > * {
  position: relative;
  z-index: 2;
}

.team-img_normal,
.team-img_large {
  display: none;
}

/* 
   TEKST + OBRAMOWANIE
 */
.team-card__title,
.team-card__normal p,
.team-card__large p,
.team-name {
  color: var(--teamcard-text);
  text-shadow:
    -1px -1px 0 var(--teamcard-outline),
     1px -1px 0 var(--teamcard-outline),
    -1px  1px 0 var(--teamcard-outline),
     1px  1px 0 var(--teamcard-outline);
}

/*  SHARED  */
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
