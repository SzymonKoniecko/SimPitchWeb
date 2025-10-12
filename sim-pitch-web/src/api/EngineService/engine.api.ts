import axios from 'axios';

const apiClient = axios.create({
  baseURL: '',  // Relatywne ścieżki
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptory dla debugowania
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Error:', error.config?.url, error.message);
    return Promise.reject(error);
  }
);

class EngineAPI {
  // Wszystkie wywołania MUSZĄ zaczynać się od /api/engine/
  
  async getSimulation(id: string) {
    const { data } = await apiClient.get(`/api/engine/simulation/${id}`);
    return data;
  }

  async createSimulation(payload: any) {
    const { data } = await apiClient.post('/api/engine/simulation', payload);
    return data;
  }
}

export const engineAPI = new EngineAPI();