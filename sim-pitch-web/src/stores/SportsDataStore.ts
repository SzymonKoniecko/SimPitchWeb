import { defineStore } from "pinia";

type League = {id: string; name: string; countryId: string; max_round: Int16Array; strength: Float32Array;}
type Country = {id: string; name: string; code: string;}
type Stadium = {id: string; name: string; capacity: Int32Array}
type Team = { id: string; name: string; logo_url: string; short_name: string; country: Country; stadium: Stadium; league: League };
type State = { teams: Team[]; leagues: League[]; loading: boolean; error: string|null };

state: (): State => ({
  leagues: [],
  teams: [],
  loading: false,
  error: null
})

export const useSportsDataStore = defineStore("SportsData", {
  state: (): State => ({
    leagues: [],
    teams: [],
    loading: false,
    error: null,
  }),
  actions: {
    async loadLeagues(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("/data/leagues.json");
        if (!res.ok) {
          throw new Error(`Failed to fetch leagues: ${res.status} ${res.statusText}`);
        }
        const data = (await res.json()) as League[];
        this.leagues = data;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error while loading leagues";
        this.error = message;
      } finally {
        this.loading = false;
      }
    },
    async loadTeams(): Promise<void> {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetch("/data/teams.json");
        if (!res.ok) {
          throw new Error(`Failed to fetch teams: ${res.status} ${res.statusText}`);
        }
        function isTeamArray(v: unknown): v is Team[] {
            return Array.isArray(v) && v.every(x => x && typeof x.id === "string");
        }

        const json = await res.json();
        this.teams = isTeamArray(json) ? json : isTeamArray(json?.teams) ? json.teams : [];

      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error while loading teams";
        this.error = message;
      } finally {
        this.loading = false;
      }
    },
  },
});