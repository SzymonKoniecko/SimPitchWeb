import type { SeasonYear } from "./seasonYear";

export interface simulationParams{
    SeasonYears: SeasonYear[];
    LeagueId: string;
    Iterations: number;
    LeagueRoundId?: string;
}