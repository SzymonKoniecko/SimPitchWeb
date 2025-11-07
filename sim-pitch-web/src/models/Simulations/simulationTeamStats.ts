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
  simulationTeamStats: SimulationTeamStats[]
): SimulationTeamStats[] {
  return [...(simulationTeamStats ?? [])].sort((a, b) => {
    const aProbs = a.positionProbbility ?? [];
    const bProbs = b.positionProbbility ?? [];

    // Find each team's most likely finishing position (lowest index with max value)
    const aMaxValue = Math.max(...aProbs);
    const bMaxValue = Math.max(...bProbs);
    const aBestIndex = aProbs.indexOf(aMaxValue);
    const bBestIndex = bProbs.indexOf(bMaxValue);

    // Sort by lowest best index (higher placement)
    if (aBestIndex !== bBestIndex) {
      return aBestIndex - bBestIndex;
    }

    // If both have the same best position, sort by higher probability
    return bMaxValue - aMaxValue;
  });
}