import { createRouter, createWebHistory } from 'vue-router'
import { devRoutes } from './dev'
import { i18n } from '../i18n'

const SITE_NAME = 'GDPM'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
      meta: { titleKey: 'pageTitle.home' }
    },
    {
      path: '/version/:version',
      name: 'version-detail',
      component: () => import('../views/Download.vue'),
      meta: { titleKey: 'pageTitle.download' }
    },
    {
      path: '/version/list',
      name: 'version-list',
      component: () => import('../views/Versions.vue'),
      meta: { titleKey: 'pageTitle.versions' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: { titleKey: 'pageTitle.notFound' }
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

router.afterEach((to) => {
  const titleKey = to.meta.titleKey as string
  const title = titleKey ? i18n.global.t(titleKey) : ''
  document.title = title ? `${SITE_NAME} — ${title}` : SITE_NAME
})

export default router
