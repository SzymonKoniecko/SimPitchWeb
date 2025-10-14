import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',  // Relatywne ścieżki
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
const BASE = "/api/sportsdata"

apiClient.interceptors.request.use(
  (config) => {
    console.log('*Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('**Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('***Error:', error.config?.url, error.message);
    return Promise.reject(error);
  }
);

class SportsDataAPI {
  
  async getCountries() {
    const { data } = await apiClient.get(BASE+ `/country`);
    return data;
  }

  async getLeagues() {
    const { data } = await apiClient.get(BASE+ `/league`);
    return data;
  }

  async getSeasonYears(){
    const { data } = await apiClient.get(BASE+ `/LeagueRound/seasonYears`);
    return data;
  }

  async getLeagueRounds(params: {
    seasonYears: string[];
    leagueId: string;
    leagueRoundId?: string;
  }){
    const { seasonYears, leagueId, leagueRoundId } = params;
    const url = `${BASE}/LeagueRound/seasons/${encodeURIComponent(seasonYears.forEach(x => x.replace('/', '_')))}/leagues/${encodeURIComponent(leagueId)}/rounds`;

    const { data } = await apiClient.get(url, {
      params: leagueRoundId ? { leagueRoundId } : undefined,
    });

    return data;
  }

  async getStadiums() {
    const { data } = await apiClient.get(BASE+ `/stadium`);
    return data;
  }

  async getTeams() {
    const { data } = await apiClient.get(BASE+ `/team`);
    return data;
  }
}

export const sportsDataAPI = new SportsDataAPI();