import axios from "axios";
const apiClient = axios.create({
  baseURL: "", // Relatywne ścieżki
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});
const BASE = "/api/engine";

apiClient.interceptors.request.use(
  (config) => {
    console.log("*Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log("**Response:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("***Error:", error.config?.url, error.message);
    return Promise.reject(error);
  }
);

class EngineAPI {
  SimulationController: InstanceType<typeof EngineAPI.SimulationController>;
  SimulationStatsController: InstanceType<typeof EngineAPI.SimulationStatsController>;
  ScoreboardController: InstanceType<typeof EngineAPI.ScoreboardController>;
  IterationResultController: InstanceType<
    typeof EngineAPI.IterationResultController
  >;
  constructor() {
    this.SimulationController = new EngineAPI.SimulationController();
    this.SimulationStatsController = new EngineAPI.SimulationStatsController();
    this.ScoreboardController = new EngineAPI.ScoreboardController();
    this.IterationResultController = new EngineAPI.IterationResultController();
  }

  static SimulationController = class SimulationController {
    private static readonly PrefixUrl = BASE + "/simulation";

    async getSimulations(
      pageNumber: number,
      pageSize: number,
      sortingOption: string,
      order: string
    ) {
      const { data } = await apiClient.get(
        `${SimulationController.PrefixUrl}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortingOption=${sortingOption}&order=${order}`
      );
      return data;
    }

    async getSimulationOverviews(
      id: string,
      pageNumber: number,
      pageSize: number,
      sortingOption: string,
      order: string
    ) {
      const { data } = await apiClient.get(
        `${SimulationController.PrefixUrl}/${id}?pageNumber=${pageNumber}&pageSize=${pageSize}&sortingOption=${sortingOption}&order=${order}`
      );
      return data;
    }

    async createSimulation(payload: any) {
      const { data } = await apiClient.post(
        `${SimulationController.PrefixUrl}`,
        payload
      );
      return data;
    }

    async stopSimulation(id: string) {
      const { data } = await apiClient.delete(
        `${SimulationController.PrefixUrl}/stop/${id}`
      );
      return data;
    }
  };

  static SimulationStatsController = class SimulationStatsController {
    private static readonly PrefixUrl = BASE + "/simulationStats";

    async getSimulationTeamStats(simulationId: string) {
      let url = `${SimulationStatsController.PrefixUrl}/${simulationId}`;
      const { data } = await apiClient.get(url);
      return data;
    }
  };

  static ScoreboardController = class ScoreboardController {
    private static readonly PrefixUrl = BASE + "/scoreboard";

    async getScoreboard(simulationId: string, iterationResultId?: string) {
      let url = `${ScoreboardController.PrefixUrl}?simulationId=${simulationId}`;
      if (iterationResultId != null) {
        url += `&iterationResultId=${iterationResultId}`;
      }
      const { data } = await apiClient.get(url);
      return data;
    }
  };

  static IterationResultController = class IterationResultController {
    private static readonly PrefixUrl = BASE + "/iterationresult";

    async getIterationResult(iterationId: string) {
      let url = `${IterationResultController.PrefixUrl}/${iterationId}`;
      const { data } = await apiClient.get(url);
      return data;
    }
  };
}

export const engineAPI = new EngineAPI();
