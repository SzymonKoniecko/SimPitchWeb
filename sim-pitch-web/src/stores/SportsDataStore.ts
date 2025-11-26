import { defineStore } from "pinia";
import { ref } from "vue";
import type { League } from "../models/SportsDataModels/league";
import type { Team } from "../models/SportsDataModels/team";
import type { LeagueRound } from "../models/SportsDataModels/leagueRound";
import { fetchData } from "../api/fetchData";
import { sportsDataAPI } from "../api/sportsdata.api";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minut

export const useSportsDataStore = defineStore("SportsData", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const leagues = ref<League[]>([]);
  const teams = ref<Team[]>([]);
  const leagueRounds = ref<LeagueRound[]>([]);

  const leaguesLastFetch = ref<number | null>(null);
  const teamsLastFetch = ref<number | null>(null);
  const leagueRoundsLastFetch = ref<Record<string, number>>({});

  let leaguesFetchPromise: Promise<void> | null = null;
  let teamsFetchPromise: Promise<void> | null = null;
  const leagueRoundsFetchPromises: Record<string, Promise<void>> = {};

  const isCacheValid = (lastFetchTime: number | null | undefined): boolean => {
    if (lastFetchTime == null) return false;
    return Date.now() - lastFetchTime < CACHE_DURATION;
  };

  async function loadLeagues(forceRefresh = false) {
    if (leaguesFetchPromise) {
      return leaguesFetchPromise;
    }

    if (!forceRefresh && isCacheValid(leaguesLastFetch.value)) {
      console.log("📦 Leagues cache hit");
      return;
    }

    leaguesFetchPromise = (async () => {
      try {
        loading.value = true;
        error.value = null;
        const result = await fetchData<League[]>(() =>
          sportsDataAPI.getLeagues()
        );
        leagues.value = result.data ?? [];
        leaguesLastFetch.value = Date.now();
        error.value = result.error;
      } finally {
        loading.value = false;
        leaguesFetchPromise = null; // Wyczyść promise
      }
    })();

    return leaguesFetchPromise;
  }

  async function loadTeams(forceRefresh = false) {
    if (teamsFetchPromise) {
      return teamsFetchPromise;
    }

    if (!forceRefresh && isCacheValid(teamsLastFetch.value)) {
      console.log("📦 Teams cache hit");
      return;
    }

    teamsFetchPromise = (async () => {
      try {
        loading.value = true;
        error.value = null;
        const result = await fetchData<Team[]>(() => sportsDataAPI.getTeams());
        teams.value = result.data ?? [];
        teamsLastFetch.value = Date.now();
        error.value = result.error;
      } finally {
        loading.value = false;
        teamsFetchPromise = null;
      }
    })();

    return teamsFetchPromise;
  }

  async function loadLeagueRounds(
    seasonYear: string,
    leagueId: string,
    leagueRoundId?: string,
    forceRefresh = false
  ) {
    const cacheKey = `${seasonYear}_${leagueId}_${leagueRoundId || "all"}`;

    if (leagueRoundsFetchPromises[cacheKey]) {
      return leagueRoundsFetchPromises[cacheKey];
    }

    if (!forceRefresh && isCacheValid(leagueRoundsLastFetch.value[cacheKey])) {
      console.log(`📦 LeagueRounds (${cacheKey}) cache hit`);
      return;
    }

    leagueRoundsFetchPromises[cacheKey] = (async () => {
      try {
        loading.value = true;
        error.value = null;
        const result = await fetchData<LeagueRound[]>(() =>
          sportsDataAPI.getLeagueRounds({ seasonYear, leagueId, leagueRoundId })
        );
        leagueRounds.value = result.data ?? [];
        leagueRoundsLastFetch.value[cacheKey] = Date.now();
        error.value = result.error;
      } finally {
        loading.value = false;
        delete leagueRoundsFetchPromises[cacheKey];
      }
    })();

    return leagueRoundsFetchPromises[cacheKey];
  }

  function clearCache() {
    leagues.value = [];
    teams.value = [];
    leagueRounds.value = [];
    leaguesLastFetch.value = null;
    teamsLastFetch.value = null;
    leagueRoundsLastFetch.value = {};
  }

  return {
    loading,
    error,
    leagues,
    teams,
    leagueRounds,
    loadLeagues,
    loadTeams,
    loadLeagueRounds,
    clearCache,
  };
});
