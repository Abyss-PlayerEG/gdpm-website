import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Download from '../views/Download.vue'
import Versions from '../views/Versions.vue'
import NotFound from '../views/NotFound.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/version/:version',
      name: 'version-detail',
      component: Download
    },
    {
      path: '/version/list',
      name: 'version-list',
      component: Versions
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFound
    },
    ...(import.meta.env.DEV
      ? [
          {
            path: '/dev-404',
            name: 'dev-404',
            component: NotFound,
            props: { noRedirect: true }
          }
        ]
      : [])
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

export default router
