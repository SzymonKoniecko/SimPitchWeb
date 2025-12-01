import type { SeasonYear } from "../Consts/seasonYear";

export interface SimulationParams{
    title: string;
    seasonYears: SeasonYear[];
    leagueId: string;
    iterations: number;
    leagueRoundId?: string;
    targetLeagueRoundId?: string;
    createScoreboardOnCompleteIteration?: Boolean;
    seed: number;
    gamesToReachTrust: number;
    confidenceLevel: number;
    homeAdvantage: number;
    noiseFactor: number;
    modelType: string | undefined;
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}