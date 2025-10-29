export interface SimulationState {
  id: string; // Guid → string
  simulationId: string; // Guid → string
  lastCompletedIteration: number;
  progressPercent: number;
  state: string;
  updatedAt: string; // DateTime → string (ISO format)
}