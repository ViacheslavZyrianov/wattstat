import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/Index.vue'),
  },
  {
    path: '/auth',
    name: 'Auth',
    meta: { layout: 'AuthLayout' },
    component: () => import('@/views/Auth/Index.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/Index.vue'),
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile/Index.vue'),
  },
  {
    path: '/readings',
    name: 'Readings',
    component: () => import('@/views/Readings/Index.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/Index.vue'),
  },
  {
    path: '/privacy-policy',
    name: 'PrivacyPolicy',
    meta: { layout: 'FullPageLayout' },
    component: () => import('@/views/PrivacyPolicy/Index.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/auth', '/privacy-policy']
  const isPublicRoute = publicRoutes.includes(to.path)

  // Wait for authentication check to complete
  await authStore.checkAuthStatus()

  // Public route - accessible to everyone
  if (isPublicRoute) {
    // If user is already authenticated and tries to access auth page,
    // redirect to dashboard (or home)
    if (authStore.getIsAuthenticated) {
      next({ name: 'Dashboard' })
    } else {
      // Allow access to public route for non-authenticated users
      next()
    }
  }
  // Protected route - requires authentication
  else {
    if (authStore.getIsAuthenticated) {
      // User is authenticated, allow access
      next()
    } else {
      // Not authenticated, redirect to auth page
      next({ name: 'Auth' })
    }
  }
})

export default router
