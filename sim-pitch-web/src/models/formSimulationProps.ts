import type { SeasonYear } from "./seasonYear";

export interface formSimulationProps{
    season_Years: SeasonYear[];
    league_id: string;
    iterations: Int32Array;
    league_round_id: string;
}