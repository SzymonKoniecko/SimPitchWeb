import type { LeagueStrength } from "../SportsDataModels/league";
import type { SimulationParams } from "./simulationParams";
import type { SimulationState } from "./simulationState";

export interface SimulationOverview {
  id: string; // Guid → string
  createdDate: string; // DateTime → string (ISO format)
  simulationParams: SimulationParams;
  state: SimulationState
  leagueStrengths: LeagueStrength[];
  priorLeagueStrength: number;
}
export interface SimulationOverviewList {
  items: SimulationOverview[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}