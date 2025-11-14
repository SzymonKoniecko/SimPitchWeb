import type { SeasonYear } from "../Consts/seasonYear";

export interface SimulationParams{
    title: string;
    seasonYears: SeasonYear[];
    leagueId: string;
    iterations: number;
    leagueRoundId?: string;
    createScoreboardOnCompleteIteration?: Boolean;
    seed: number;
    gamesToReachTrust: number;
    confidenceLevel: number;
    homeAdvantage: number;
    noiseFactor: number;
}