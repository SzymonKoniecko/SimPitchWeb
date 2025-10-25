import { defineStore } from "pinia";
import { ref } from "vue";
import type { League } from "../models/SportsDataModels/league";
import type { Team } from "../models/SportsDataModels/team";
import { fetchData } from "../api/fetchData";
import { sportsDataAPI } from "../api/sportsdata.api";
import type { LeagueRound } from "../models/SportsDataModels/leagueRound";

export const useSportsDataStore = defineStore("SportsData", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const leagues = ref<League[]>([]);
  const teams = ref<Team[]>([]);
  const leagueRounds = ref<LeagueRound[]>([]);

  async function loadLeagues() {
    loading.value = true;
    error.value = null;
    const result = await fetchData<League[]>(() => sportsDataAPI.getLeagues());
    leagues.value = result.data ?? [];
    error.value = result.error;
    loading.value = result.loading;
  }

  async function loadTeams() {
    loading.value = true;
    error.value = null;
    const result = await fetchData<Team[]>(() => sportsDataAPI.getTeams());
    teams.value = result.data ?? [];
    error.value = result.error;
    loading.value = result.loading;
  }

  async function loadLeagueRounds(seasonYear: string, leagueId: string, leagueRoundId?: string) {
    loading.value = true;
    error.value = null;
    const result = await fetchData<LeagueRound[]>(() => sportsDataAPI.getLeagueRounds({seasonYear, leagueId, leagueRoundId}));
    leagueRounds.value = result.data ?? [];
    error.value = result.error;
    loading.value = result.loading;
  }


  return {
    loading,
    error,
    leagues,
    leagueRounds,
    teams,
    loadLeagues,
    loadLeagueRounds,
    loadTeams,
  };
});
