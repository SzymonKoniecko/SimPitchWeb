import type { IterationPreview } from "../Iterations/iterationPreview"
import type { SimulationParams } from "./simulationParams"
import type { SimulationState } from "./simulationState"

export interface Simulation {
  id: string
  winnersSummary: string
  completedIterations: number
  state: SimulationState
  simulationParams: SimulationParams
  iterationPreviews: IterationPreview[]
  simulatedMatches: number
  priorLeagueStrength: number
}
