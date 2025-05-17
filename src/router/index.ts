import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import middleware from './middleware'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(middleware.beforeEach)

export default router
