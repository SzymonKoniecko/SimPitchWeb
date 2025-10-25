import type { ScoreboardTeamStats } from "./scoreboardTeamStats";

export interface Scoreboard {
  id: string;
  simulationId: string;
  iterationResultId: string;
  scoreboardTeams: ScoreboardTeamStats[];
  leagueStrength: number;
  priorLeagueStrength: number;
  createdAt: string;       // DateTime -> string (ISO format)
}