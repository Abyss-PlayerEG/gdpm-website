import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Download from '../views/Download.vue'
import Versions from '../views/Versions.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/download/:version',
      name: 'download',
      component: Download
    },
    {
      path: '/versions',
      name: 'versions',
      component: Versions
    }
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  }
})

export default router
