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

export function sortTeamStats(
  simulationTeamStats: SimulationTeamStats[] | null | undefined
): SimulationTeamStats[] {
  return [...(simulationTeamStats ?? [])].sort(
    (a, b) => (b.positionProbbility?.[0] || 0) - (a.positionProbbility?.[0] || 0)
  );
}