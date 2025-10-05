import type { Country } from "./country.ts";
import type { League } from "./league.ts";
import type { Stadium } from "./stadium.ts";

export interface Team { id: string; name: string; logo_url: string; short_name: string; country: Country; stadium: Stadium; league: League };
