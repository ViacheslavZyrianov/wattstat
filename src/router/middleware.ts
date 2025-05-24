import { useAuthStore } from '@/store/auth'
import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'

const publicRoutes = [
  '/auth',
  '/auth/google-callback',
  '/privacy-policy',
  '/terms-of-service',
]

export default {
  async beforeEach(
    to: RouteLocationNormalized,
    _: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) {
    const authStore = useAuthStore()
    const isPublicRoute = publicRoutes.includes(to.path)

    // Public route - accessible to everyone
    if (isPublicRoute) {
      // If user is already authenticated and tries to access auth page,
      // redirect to dashboard (or home)
      if (authStore.getIsAuthenticated) {
        next({ path: '/dashboard' })
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
        next({ path: '/auth' })
      }
    }
  },
}
