import type { ScoreboardTeamStats } from "./scoreboardTeamStats";

export interface Scoreboard {
  id: string;
  simulationId: string;
  iterationResultId: string;
  scoreboardTeams: ScoreboardTeamStats[];
  initialScoreboardTeams: ScoreboardTeamStats[];
  createdAt: string;       // DateTime -> string (ISO format)
}