import type { IterationPreview } from "../Iterations/iterationPreview"
import type { SimulationParams } from "./simulationParams"

export interface SimulationOverview {
  id: string
  winnersSummary: string
  completedIterations: number
  simulationParams: SimulationParams
  iterationPreviews: IterationPreview[]
  simulatedMatches: number
  priorLeagueStrength: number
}
