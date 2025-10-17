import type { iterationPreview } from "./iterationPreview"
import type { simulationParams } from "./simulationParams"

export interface Simulation {
  id: string
  winnersSummary: string
  completedIterations: number
  simulationParams: simulationParams
  iterationPreviews: iterationPreview[]
  simulatedMatches: number
  priorLeagueStrength: number
}
