import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Main/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../components/Main/About.vue')
  },
  {
    path: '/league',
    name: 'LeagueOverviews',
    component: () => import('../components/LeagueOverview/LeagueOverviews.vue')
  },
  {
    path: '/test',
    name: 'TestEndpoint',
    component: () => import('../components/TestEndpoint.vue')
  },
  {
    path: '/prepareSimulation',
    name: 'PrepareSimulation',
    component: () => import('../components/Simulation/PrepareSimulation.vue')
  },
  {
    path: '/simulation',
    name: 'SimulationList',
    component: () => import('../components/Simulation/SimulationList.vue')
  },
  {
    path: '/simulation/:id',
    name: 'SimulationItem',
    component: () => import('../components/Simulation/SimulationItem.vue'),
    props: true
  },
  {
    path: '/simulation/:simulation_id/iteration/:id',
    name: 'IterationItem',
    component: () => import('../components/Iteration/IterationItem.vue'),
    props: true
  },
  {
    path: '/team/:id',
    name: 'Team',
    component: () => import('../components/Team/Team.vue'),
    props: true
  },
  // catch-all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../components/Main/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
