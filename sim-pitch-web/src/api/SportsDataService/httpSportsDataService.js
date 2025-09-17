import axios from "axios";

const httpSportsDataService = axios.create({
  baseURL: "https://localhost:4000",
  timeout: 5000,
});

export default httpSportsDataService;
