import type { TeamStrength } from "../Iterations/teamStrength.ts";
import type { Country } from "./country.ts";
import type { League } from "./league.ts";
import type { Stadium } from "./stadium.ts";

export interface Team {
  id: string;
  name: string;
  logoUrl: string;
  shortName: string;
  country: Country;
  stadium: Stadium;
  league: League;
}
export function getPresentedTeams(
  teams: Team[],
  strengths: TeamStrength[]
): Team[] {
  const strengthIds = new Set(strengths.map(s => s.teamId));
  return teams.filter(team => strengthIds.has(team.id));
}