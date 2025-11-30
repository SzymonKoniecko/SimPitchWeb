export interface League {
  id: string;
  name: string;
  countryId: string;
  maxRound: number;
  strengths: LeagueStrength[];
}
export interface LeagueStrength {
  id: string;
  leagueId: string;
  seasonYear: string;
  strength: number;
}
