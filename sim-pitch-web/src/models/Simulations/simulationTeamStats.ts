export interface SimulationTeamStats {
  id: string;                    // Guid 
  simulationId: string;          // Guid
  teamId: string;                // Guid
  positionProbbility: number[];  // float[] → number[]
  averangePoints: number;
  averangeWins: number;
  averangeLosses: number;
  averangeDraws: number;
  averangeGoalsFor: number;
  averangeGoalsAgainst: number;
}