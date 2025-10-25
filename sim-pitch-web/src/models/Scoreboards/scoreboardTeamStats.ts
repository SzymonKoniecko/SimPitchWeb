export interface ScoreboardTeamStats {
  id: string;              // Guid -> string
  scoreboardId: string;
  teamId: string;
  rank: number;
  points: number;
  matchPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
}