import { defineStore } from 'pinia'
import axios from '@/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoading: false,
    error: null,
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

      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: this.handleGoogleResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true,
      })
    },

    async handleGoogleResponse(response) {
      if (!response.credential) {
        this.error = 'No credential received'
        return
      }

      this.isLoading = true

      try {
        const { data } = await axios.post('/auth/google/verify-token', {
          token: response.credential,
        })

        if (data.authenticated) {
          this.user = data.user
          this.error = null
        } else {
          this.error = data.error || 'Authentication failed'
          this.user = null
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        this.user = null
      } finally {
        this.isLoading = false
      }
    },

    showOneTapPrompt() {
      if (!window.google) return
      window.google.accounts.id.prompt()
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
        this.error = err.response?.data?.message || err.message
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
          this.error = null
        }
      } catch (err) {
        this.error = err.response?.data?.message || err.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
