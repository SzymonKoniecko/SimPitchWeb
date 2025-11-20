import type { IterationPreviewList } from "../Iterations/iterationPreview";
import type { LeagueStrength } from "../SportsDataModels/league";
import type { SimulationParams } from "./simulationParams";
import type { SimulationState } from "./simulationState";

export interface Simulation {
  id: string;
  winnersSummary: string;
  completedIterations: number;
  state: SimulationState;
  simulationParams: SimulationParams;
  iterationPreviews: IterationPreviewList;
  simulatedMatches: number;
  leagueStrengths: LeagueStrength[];
  priorLeagueStrength: number;
}
