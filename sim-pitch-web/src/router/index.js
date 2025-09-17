import { createRouter, createWebHistory } from "vue-router";
import Main from "@/components/AppMain.vue";
import TeamDetails from "@/components/TeamDetails.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Main, // pokaże wszystkie drużyny
  },
  {
    path: "/league/:id",
    name: "league",
    component: Main, // ten sam komponent, ale z filtrem po lidze
    props: true,
  },
  {
    path: "/team/:id",
    name: "team",
    component: TeamDetails,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
