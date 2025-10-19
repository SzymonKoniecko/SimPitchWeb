import type { simulationParams } from "./simulationParams";

export interface SimulationOverview {
  id: string; // Guid → string
  title: string;
  createdDate: string; // DateTime → string (ISO format)
  simulationParams: simulationParams;
}