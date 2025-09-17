import { defineStore } from "pinia";
//import { fetchLeagues, fetchTeams } from "@/api/SportsDataService/leagues";

export const useSportsDataStore = defineStore("SportsData",{
    state: () => ({
        leagues: [],
        teams: [],
        loading: false,
        error: null
    }),
    actions: {
        async loadLeagues() {
            this.loading = true;
            try {
                //const res = await fetchLeagues();
                //this.leagues = res.data;
                const res = await fetch("/data/leagues.json");
                this.leagues = await res.json();
            } catch (err) {
                this.error = err.message;
            } finally{
                this.loading = false;
            }
        },
        async loadTeams() {
            this.loading = true;
            try {
                //const res = await fetchLeagues();
                //this.teams = res.data;
                const res = await fetch("/data/teams.json");
                this.teams = await res.json();
            } catch (err) {
                this.error = err.message;
            } finally{
                this.loading = false;
            }
        }
    }
})