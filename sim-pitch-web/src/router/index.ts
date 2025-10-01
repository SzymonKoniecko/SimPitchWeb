import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// Typowanie tras
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
  // przykład dynamic route
  //{
// path: '/team/:id',
  //  name: 'Team',
  //  component: () => import('../components/Team.vue'),
  //  props: true
  //},
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
