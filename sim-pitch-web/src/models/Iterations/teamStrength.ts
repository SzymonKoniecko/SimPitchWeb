import type { SeasonStats } from "./seasonStats";
import type { StrengthItem } from "./strengthItem";

export interface TeamStrength {
  teamId: string;
  likelihood: StrengthItem;
  posterior: StrengthItem;
  expectedGoals: number;
  lastUpdate: Date;
  /** Indicates the roundId in which these stats have been updated.
   * If null, it's before the first match.
   */
  roundId?: string | null;
  seasonStats: SeasonStats;
}
