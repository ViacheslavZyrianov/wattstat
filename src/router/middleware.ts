import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useGoogleAuthStore } from '@/store/auth/google'

const publicRoutes = [
  '/',
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
    const googleAuthStore = useGoogleAuthStore()
    const isPublicRoute = publicRoutes.includes(to.path)

    if (isPublicRoute) {
      // If user is already authenticated and tries to access auth page,
      // redirect to dashboard
      if (googleAuthStore.getIsAuthenticated) {
        next({ path: '/dashboard' })
      } else {
        // Allow access to public route for non-authenticated users
        next()
      }
    }
    // Protected route - requires authentication
    else {
      if (googleAuthStore.getIsAuthenticated) {
        // User is authenticated, allow access
        next()
      } else {
        // Not authenticated, redirect to auth page
        next({ path: '/auth' })
      }
    }
  },
}
