import httpSportsDataService from "./httpSportsDataService";

export function fetchTeams(){
    return httpSportsDataService.get("/teams");
}