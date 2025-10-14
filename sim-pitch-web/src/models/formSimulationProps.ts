import type { SeasonYear } from "./seasonYear";

export interface formSimulationProps{
    season_Years: SeasonYear[];
    league_id: string;
    iterations: number;
    league_round_id: string;
}