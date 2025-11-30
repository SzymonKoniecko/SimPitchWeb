export const SimulationStatus = {
  Pending: 'Pending',
  Running: 'Running',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
  Failed: 'Failed',
} as const;

export type SeasonYear = typeof SimulationStatus[keyof typeof SimulationStatus];

export const simulationStatusOptions: SeasonYear[] = Object.values(SimulationStatus);