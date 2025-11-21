export const SimulationModel = {
  StandardPoisson: 'StandardPoisson',
  DixonColes: 'DixonColes',
  BivariatePoisson: 'BivariatePoisson',
  Advanced: 'Advanced',
} as const;

export type SimulationModel = typeof SimulationModel[keyof typeof SimulationModel];

export const SimulationModelsOptions: SimulationModel[] = Object.values(SimulationModel);