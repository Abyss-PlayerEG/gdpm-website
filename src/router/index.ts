import { createRouter, createWebHistory } from 'vue-router'
import { devRoutes } from './dev'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/version/:version',
      name: 'version-detail',
      component: () => import('../views/Download.vue')
    },
    {
      path: '/version/list',
      name: 'version-list',
      component: () => import('../views/Versions.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    },
    // Developer routes (dev only)
    ...(import.meta.env.DEV ? devRoutes : [])
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

export default router
