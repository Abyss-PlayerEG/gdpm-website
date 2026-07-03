export const devRoutes = [
  {
    path: '/dev-404',
    name: 'dev-404',
    component: () => import('../views/NotFound.vue'),
    props: { noRedirect: true }
  },
  {
    path: '/demo/modal',
    name: 'demo-modal',
    component: () => import('../views/demo/ModalDemo.vue')
  }
]
