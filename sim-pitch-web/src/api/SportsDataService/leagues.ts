import httpSportsDataService from "./httpSportsDataService";

export function fetchLeagues(){
    return httpSportsDataService.get("/leagues");
}