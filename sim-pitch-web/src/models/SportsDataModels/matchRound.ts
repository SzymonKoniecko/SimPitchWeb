export interface MatchRound {
  id: string;           // Guid → string
  roundId: string;      // Guid → string
  homeTeamId: string;   // Guid → string
  awayTeamId: string;   // Guid → string
  homeGoals: number;
  awayGoals: number;
  isDraw: boolean;
  isPlayed: boolean;
}