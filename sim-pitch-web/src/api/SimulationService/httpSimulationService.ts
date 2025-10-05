import axios, { type AxiosInstance } from "axios";

const httpSportsDataService: AxiosInstance = axios.create({
  baseURL: "https://localhost:4000",
  timeout: 5000,
});

export default httpSportsDataService;
