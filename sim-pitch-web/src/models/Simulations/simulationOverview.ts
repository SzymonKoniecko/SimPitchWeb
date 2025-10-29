import type { SimulationParams } from "./simulationParams";
import type { SimulationState } from "./simulationState";

export interface SimulationOverview {
  id: string; // Guid → string
  title: string;
  createdDate: string; // DateTime → string (ISO format)
  simulationParams: SimulationParams;
  state: SimulationState
}
export interface SimulationOverviewList {
  items: SimulationOverview[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}