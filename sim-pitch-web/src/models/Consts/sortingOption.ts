export const SortingOption = {
  CreatedDate: "CreatedDate",
  ExecutionTime: "ExecutionTime",
  Name: "Name",
  IterationResultNumber: "IterationResultNumber",
  DynamicValue: "dynamic",
  LeaderPoints: "LeaderPoints",
} as const;

export type SortingOption = (typeof SortingOption)[keyof typeof SortingOption];

export const SortingOptions: SortingOption[] = Object.values(SortingOption);

export function getLabel(option: SortingOption, component: string): string {
  switch (option) {
    case "CreatedDate": return "Created date";
    case "ExecutionTime": return "Execution time";
    case "Name": return "Name";
    case "IterationResultNumber": return "Order by iteration";
    case "LeaderPoints": return "Leader points";
    case "dynamic": 
    if (component === "SimulationItem") {
        return "Team"
    }
    else if (component === "SimulationList") {
        return "League"
    };
    default: return option;
  }
}