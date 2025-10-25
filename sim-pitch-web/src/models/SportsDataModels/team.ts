import type { Country } from "./country.ts";
import type { League } from "./league.ts";
import type { Stadium } from "./stadium.ts";

export interface Team { id: string; name: string; logoUrl: string; shortName: string; country: Country; stadium: Stadium; league: League };
