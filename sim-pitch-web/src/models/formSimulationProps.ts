import type { SeasonYear } from "./seasonYear";

export interface formSimulationProps{
    SeasonYears: SeasonYear[];
    LeagueId: string;
    Iterations: number;
    LeagueRoundId: string;
}