import { defineStore } from "pinia";
import { ref } from "vue";
import type { League } from "../models/league";
import type { Team } from "../models/team";
import { fetchData } from "../api/fetchData";
import { sportsDataAPI } from "../api/sportsdata.api";
import type { leagueRound } from "../models/leagueRound";

export const useSportsDataStore = defineStore("SportsData", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const leagues = ref<League[]>([]);
  const teams = ref<Team[]>([]);
  const leagueRounds = ref<leagueRound[]>([]);

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
    const result = await fetchData<leagueRound[]>(() => sportsDataAPI.getLeagueRounds({seasonYear, leagueId, leagueRoundId}));
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
