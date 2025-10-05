import httpSimulationService from "./httpSimulationService";
import type { formSimulationProps } from "../../models/formSimulationProps";
export async function submitSimulation(form: formSimulationProps) {
  const payload = {
    ...form,
    iterations: Array.from(form.iterations), // convert Int32Array to plain array
  };
  try {
    const response = await httpSimulationService.post("/api/simulations", payload);
    return response.data;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error while loading leagues";
    return message
  }
}