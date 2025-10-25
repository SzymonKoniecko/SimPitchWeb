import type { SeasonYear } from "../Consts/seasonYear";

export interface SeasonStats {
  id: string; // Guid → string
  teamId: string;
  seasonYear: SeasonYear;
  leagueId: string;
  leagueStrength: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
}