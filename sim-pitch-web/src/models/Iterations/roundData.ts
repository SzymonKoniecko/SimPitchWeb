import type { MatchRound } from "../SportsDataModels/matchRound";

export type RoundData = { // exists only on vue
  roundNumber: number;
  roundId: string | undefined;
  simulatedMatches: MatchRound[];
  realMatches: MatchRound[];
};