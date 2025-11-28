export const SeasonYear = {
  S2022_2023: '2022/2023',
  S2023_2024: '2023/2024',
  S2024_2025: '2024/2025',
  S2025_2026: '2025/2026',
} as const;

export type SeasonYear = typeof SeasonYear[keyof typeof SeasonYear];

export const seasonYearsOptions: SeasonYear[] = Object.values(SeasonYear);
export const CURRENT_SEASON = SeasonYear.S2025_2026;