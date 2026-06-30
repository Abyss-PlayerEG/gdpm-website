import NotFound from '../views/NotFound.vue'
import ModalDemo from '../views/demo/ModalDemo.vue'

export const devRoutes = [
  {
    path: '/dev-404',
    name: 'dev-404',
    component: NotFound,
    props: { noRedirect: true }
  },
  {
    path: '/demo/modal',
    name: 'demo-modal',
    component: ModalDemo
  }
]
