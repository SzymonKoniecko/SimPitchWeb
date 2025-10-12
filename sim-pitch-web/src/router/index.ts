import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/Home.vue') // lazy load
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../components/About.vue')
  },
  {
    path: '/test',
    name: 'TestEngine',
    component: () => import('../components/TestEngine.vue')
  },
  {
    path: '/prepareSimulation',
    name: 'PrepareSimulation',
    component: () => import('../components/PrepareSimulation.vue')
  },
  {
    path: '/simulation/:id',
    name: 'SimulationItemView',
    component: () => import('../components/SimulationItemView.vue'),
    props: true
  },
  {
    path: '/team/:id',
    name: 'Team',
    component: () => import('../components/Team.vue'),
    props: true
  },
  // catch-all 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../components/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
