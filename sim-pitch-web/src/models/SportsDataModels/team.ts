import type { TeamStrength } from "../Iterations/teamStrength.ts";
import type { CompetitionMembership } from "./competitionMembership.ts";
import type { Country } from "./country.ts";
import type { Stadium } from "./stadium.ts";

export interface Team {
  id: string;
  name: string;
  shortName: string;
  country: Country;
  stadium: Stadium;
  memberships: CompetitionMembership[];
}
export function getPresentedTeams(
  teams: Team[],
  strengths: TeamStrength[]
): Team[] {
  const strengthIds = new Set(strengths.map(s => s.teamId));
  return teams.filter(team => strengthIds.has(team.id));
}