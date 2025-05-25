import { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useGoogleAuthStore } from '@/store/auth/google'

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
    const googleAuthStore = useGoogleAuthStore()
    const isPublicRoute = publicRoutes.includes(to.path)
    const isHomePage = to.path === '/'

    // Special case for homepage
    if (isHomePage) {
      if (!googleAuthStore.getIsAuthenticated) {
        // User is not authenticated on homepage, redirect to auth
        next({ path: '/auth' })
      } else {
        // User is authenticated on homepage, redirect to dashboard
        next({ path: '/dashboard' })
      }
    }
    // Public route - accessible to everyone
    else if (isPublicRoute) {
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
