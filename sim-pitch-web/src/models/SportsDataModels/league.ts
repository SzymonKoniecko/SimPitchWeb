export interface League {
  id: string;
  name: string;
  countryId: string;
  maxRound: number;
  leagueStrengths: LeagueStrength[];
}
export interface LeagueStrength {
  id: string;
  leagueId: string;
  seasonYear: string;
  strength: number;
}
