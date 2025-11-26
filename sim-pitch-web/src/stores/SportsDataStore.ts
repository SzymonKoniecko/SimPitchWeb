import { defineStore } from "pinia";
import { ref } from "vue";
import type { League } from "../models/SportsDataModels/league";
import type { Team } from "../models/SportsDataModels/team";
import type { LeagueRound } from "../models/SportsDataModels/leagueRound";
import { fetchData } from "../api/fetchData";
import { sportsDataAPI } from "../api/sportsdata.api";
import type { MatchRound } from "../models/SportsDataModels/matchRound";
import { CURRENT_SEASON } from "../models/Consts/seasonYear";

const CACHE_DURATION = 10 * 60 * 1000; // 10 minut

export const useSportsDataStore = defineStore("SportsData", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const leagues = ref<League[]>([]);
  const teams = ref<Team[]>([]);
  const leagueRounds = ref<LeagueRound[]>([]);
  const matchRounds = ref<MatchRound[]>([]); // Przechowuje mecze

  // Timestamps
  const leaguesLastFetch = ref<number | null>(null);
  const teamsLastFetch = ref<number | null>(null);
  const leagueRoundsLastFetch = ref<Record<string, number>>({});
  const matchRoundsLastFetch = ref<Record<string, number>>({}); // Klucz: leagueId

  // Promises (deduplikacja)
  let leaguesFetchPromise: Promise<void> | null = null;
  let teamsFetchPromise: Promise<void> | null = null;
  const leagueRoundsFetchPromises: Record<string, Promise<void>> = {};
  const matchRoundsFetchPromises: Record<string, Promise<void>> = {};

  const isCacheValid = (lastFetchTime: number | null | undefined): boolean => {
    if (lastFetchTime == null) return false;
    return Date.now() - lastFetchTime < CACHE_DURATION;
  };

  // ✅ NOWA IMPLEMENTACJA loadMatchRounds
  async function loadMatchRounds(leagueId: string, forceRefresh = false) {
    const cacheKey = `${CURRENT_SEASON}_${leagueId}`; // Unikalny klucz dla cache i promises

    // 1. Deduplikacja (jeśli request już leci)
    if (matchRoundsFetchPromises[cacheKey]) {
      return matchRoundsFetchPromises[cacheKey];
    }

    // 2. Sprawdzenie Cache
    if (!forceRefresh && isCacheValid(matchRoundsLastFetch.value[cacheKey])) {
      console.log(`📦 MatchRounds (${cacheKey}) cache hit`);
      return;
    }

    // 3. Fetch
    matchRoundsFetchPromises[cacheKey] = (async () => {
      try {
        loading.value = true;
        error.value = null;

        // Pobieramy mecze dla całej ligi w sezonie
        const result = await fetchData<MatchRound[]>(() =>
          sportsDataAPI.getMatchRounds(CURRENT_SEASON, leagueId)
        );

        if (result.data) {
          // Nadpisujemy mecze (ponieważ pobieramy komplet dla ligi)
          // Można ewentualnie filtrować, ale przy pobieraniu per-liga to najczystsze podejście
          matchRounds.value = result.data;
          matchRoundsLastFetch.value[cacheKey] = Date.now();
        }

        if (result.error) {
          error.value = result.error;
        }
      } finally {
        loading.value = false;
        delete matchRoundsFetchPromises[cacheKey];
      }
    })();

    return matchRoundsFetchPromises[cacheKey];
  }

  // ... (Reszta funkcji loadLeagues, loadTeams, loadLeagueRounds bez zmian) ...
  async function loadLeagues(forceRefresh = false) {
    if (leaguesFetchPromise) return leaguesFetchPromise;
    if (!forceRefresh && isCacheValid(leaguesLastFetch.value)) return;
    leaguesFetchPromise = (async () => {
      try {
        loading.value = true;
        const result = await fetchData<League[]>(() =>
          sportsDataAPI.getLeagues()
        );
        leagues.value = result.data ?? [];
        leaguesLastFetch.value = Date.now();
      } finally {
        loading.value = false;
        leaguesFetchPromise = null;
      }
    })();
    return leaguesFetchPromise;
  }

  async function loadTeams(forceRefresh = false) {
    if (teamsFetchPromise) return teamsFetchPromise;
    if (!forceRefresh && isCacheValid(teamsLastFetch.value)) return;
    teamsFetchPromise = (async () => {
      try {
        loading.value = true;
        const result = await fetchData<Team[]>(() => sportsDataAPI.getTeams());
        teams.value = result.data ?? [];
        teamsLastFetch.value = Date.now();
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
    if (leagueRoundsFetchPromises[cacheKey])
      return leagueRoundsFetchPromises[cacheKey];
    if (!forceRefresh && isCacheValid(leagueRoundsLastFetch.value[cacheKey]))
      return;
    leagueRoundsFetchPromises[cacheKey] = (async () => {
      try {
        loading.value = true;
        const result = await fetchData<LeagueRound[]>(() =>
          sportsDataAPI.getLeagueRounds({ seasonYear, leagueId, leagueRoundId })
        );
        leagueRounds.value = result.data ?? [];
        leagueRoundsLastFetch.value[cacheKey] = Date.now();
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
    matchRounds.value = [];
    leaguesLastFetch.value = null;
    teamsLastFetch.value = null;
    leagueRoundsLastFetch.value = {};
    matchRoundsLastFetch.value = {};
  }

  return {
    loading,
    error,
    leagues,
    teams,
    leagueRounds,
    matchRounds,
    loadLeagues,
    loadTeams,
    loadLeagueRounds,
    loadMatchRounds,
    clearCache,
  };
});
