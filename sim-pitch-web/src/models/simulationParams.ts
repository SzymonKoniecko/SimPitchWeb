import type { SeasonYear } from "./seasonYear";

export interface simulationParams{
    seasonYears: SeasonYear[];
    leagueId: string;
    iterations: number;
    leagueRoundId?: string;
}