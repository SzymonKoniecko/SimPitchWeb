import type { TeamStrength } from "../Iterations/teamStrength";

// Interfejs dla punktu danych na wykresie radarowym
export interface RadarChartData {
  teamId: string;
  stats: {
    attack: number;     // 0-100: Siła ataku (znormalizowana)
    defense: number;    // 0-100: Solidność obrony (odwrócona, 100 = mur)
    momentum: number;   // 0-100+: Forma (Likelihood vs Posterior)
    winRate: number;    // 0-100: Procent wygranych
    efficiency: number; // 0-100: Gole strzelone na mecz (skalowane)
  };
  raw: TeamStrength;    // Zachowujemy oryginał dla tooltipów
}

/**
 * Mapuje TeamStrength na znormalizowane dane do wykresu Radarowego.
 * @param teamStrength Dane wejściowe drużyny
 * @param leagueMaxOffensive (Opcjonalne) Max siła ataku w lidze dla lepszej skali (default 3.0)
 * @param leagueMaxDefensive (Opcjonalne) Max słabość obrony w lidze (default 3.0)
 */
export function mapToRadarData(
  team: TeamStrength, 
  leagueMaxOffensive: number = 3.0, 
  leagueMaxDefensive: number = 3.0
): RadarChartData {
  
  // 1. Normalizacja Ataku (0-100)
  // Zakładamy, że 3.0 to elitarny atak. Jeśli team ma 1.3, to (1.3 / 3.0) * 100 = 43
  const attackScore = Math.min((team.posterior.offensive / leagueMaxOffensive) * 100, 100);

  // 2. Normalizacja Obrony (0-100)
  // Tu jest tricky: niższa wartość (np. 0.5) jest lepsza.
  // Wzór: Im bliżej 0 tym bliżej 100. Im bliżej leagueMaxDefensive (słaba obrona) tym bliżej 0.
  const defenseScore = Math.max(
    (1 - (team.posterior.defensive / leagueMaxDefensive)) * 100, 
    0
  );

  // 3. Momentum (Forma)
  // Bazowe 50 pkt + bonus/kara za różnicę Likelihood vs Posterior
  // Jeśli Likelihood > Posterior (forma rośnie) -> wynik > 50
  // Skalowanie: np. różnica 0.5 gola to +25 pkt
  const diff = team.likelihood.offensive - team.posterior.offensive;
  const momentumScore = Math.min(Math.max(50 + (diff * 50), 0), 100); 
  // Alternatywnie: Stosunek (Likelihood / Posterior) * 50, ale różnica jest bezpieczniejsza przy małych liczbach.

  // 4. Win Rate (0-100)
  const matches = team.seasonStats.matchesPlayed;
  const winRate = matches > 0 
    ? (team.seasonStats.wins / matches) * 100 
    : 0; // Start sezonu = 0

  // 5. Efficiency (Gole na mecz / Max)
  // Podobne do ataku, ale bazuje na twardych danych z seasonStats, a nie modelu Bayesa
  const goalsPerMatch = matches > 0 
    ? team.seasonStats.goalsFor / matches 
    : 0;
  const efficiencyScore = Math.min((goalsPerMatch / 3.0) * 100, 100);

  return {
    teamId: team.teamId,
    stats: {
      attack: Math.round(attackScore),
      defense: Math.round(defenseScore),
      momentum: Math.round(momentumScore),
      winRate: Math.round(winRate),
      efficiency: Math.round(efficiencyScore)
    },
    raw: team
  };
}
