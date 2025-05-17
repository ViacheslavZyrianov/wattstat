import { defineStore } from 'pinia'
import axios from '@/axios'
import { showNotify } from 'vant'
import router from '@/router' // Import router instance directly=

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
  }),

  getters: {
    getUser: (state) => state.user,
    getIsLoading: (state) => state.isLoading,
    getIsAuthenticated: (state) => !!state.user,
  },

  actions: {
    async initGoogleAuth() {
      // Skip if already loaded
      if (document.querySelector('script#google-auth')) {
        return
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.id = 'google-auth'
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true
        script.onload = () => resolve()
        script.onerror = () =>
          reject(new Error('Failed to load Google Identity Services SDK'))
        document.head.appendChild(script)
      })
    },

    setupGoogleSignIn() {
      if (!window.google) return

      const currentUrl = window.location.origin
      const redirectUri = `${currentUrl}/auth/google-callback`

      // Store the return URL to redirect after authentication
      const returnUrl =
        router.currentRoute.value.query.returnUrl || '/dashboard'
      localStorage.setItem('authReturnUrl', returnUrl.toString())

      // Create the Google OAuth URL with redirect parameters
      const googleAuthUrl = new URL(
        'https://accounts.google.com/o/oauth2/v2/auth',
      )
      googleAuthUrl.searchParams.append(
        'client_id',
        import.meta.env.VITE_GOOGLE_CLIENT_ID,
      )
      googleAuthUrl.searchParams.append('redirect_uri', redirectUri)
      googleAuthUrl.searchParams.append('response_type', 'code')
      googleAuthUrl.searchParams.append('scope', 'email profile')
      googleAuthUrl.searchParams.append('prompt', 'select_account')

      // Redirect to Google Auth
      window.open(googleAuthUrl.toString())
    },

    async handleGoogleResponse(code) {
      if (!code) {
        showNotify({
          type: 'danger',
          message: 'No authentication code received',
        })
        return false
      }

      this.isLoading = true

      try {
        const currentUrl = window.location.origin
        const redirectUri = `${currentUrl}/auth/google-callback`

        const { data } = await axios.post('/auth/google-callback', {
          code,
          redirectUri,
        })

        if (data.authenticated) {
          this.user = data.user
          return true
        } else {
          showNotify({
            type: 'danger',
            message: data.error || 'Authentication failed',
          })
          this.user = null
          return false
        }
      } catch (err) {
        this.user = null
        return false
      } finally {
        this.isLoading = false
      }
    },

    async checkAuthStatus() {
      this.isLoading = true

      try {
        const { data } = await axios.get('/auth/status')

        if (data.authenticated) {
          this.user = data.user
        } else {
          this.user = null
        }
      } catch (err) {
        this.user = null
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      this.isLoading = true

      try {
        const { data } = await axios.post('/auth/logout')

        if (data.success) {
          this.user = null
        }
      } finally {
        this.isLoading = false
      }
    },
  },
})
