import type { MatchRound } from "../SportsDataModels/matchRound";
import type { TeamStrength } from "./teamStrength";

export interface IterationResult {
  id: string;
  simulationId: string;
  iterationIndex: number;
  startDate: Date;
  executionTime: string; // TimeSpan → string or number (e.g. milliseconds)
  teamStrengths: TeamStrength[];
  simulatedMatchRounds: MatchRound[];
}