import type { SeasonYear } from "../Consts/seasonYear";

export interface SimulationParams{
    seasonYears: SeasonYear[];
    leagueId: string;
    iterations: number;
    leagueRoundId?: string;
    createScoreboardOnCompleteIteration?: Boolean;
}