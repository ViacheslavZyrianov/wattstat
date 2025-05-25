import { defineStore } from 'pinia'
import axios from '@/axios'
import { showNotify } from 'vant'
import {
  AuthGoogleLogoutResponse,
  AuthGoogleState,
  GoogleCredentialResponse,
} from '@/store/auth/types'
import router from '@/router'

export const useGoogleAuthStore = defineStore('googleAuth', {
  state: (): AuthGoogleState => ({
    user: null,
    token: null,
    isAuthing: false,
    isFallbackRenderButtonUsed: false,
  }),

  getters: {
    getIsAuthenticated(): boolean {
      return !!this.token
    },
    getUser(): AuthGoogleState['user'] {
      return this.user
    },
  },

  actions: {
    googleInitialize(): void {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: this.postAuthGoogle,
        auto_select: false,
        prompt_parent_id: 'google-one-tap',
      })
    },

    renderGoogleButton(): void {
      this.isFallbackRenderButtonUsed = true

      const fallbackButtonElement = document.getElementById('fallback-button')
      const parent = fallbackButtonElement.parentElement
      const style = getComputedStyle(parent)
      const paddingLeft = parseFloat(style.paddingLeft)
      const paddingRight = parseFloat(style.paddingRight)
      const totalPadding = paddingLeft + paddingRight
      const width = parent.clientWidth - totalPadding

      showNotify({
        message:
          'Google One Tap is not available, please authenticate with fallback button.',
        background: 'var(--van-warning-color)',
        duration: 2000,
      })

      google.accounts.id.renderButton(fallbackButtonElement, {
        theme: 'filled_blue',
        size: 'large',
        width,
      })
    },

    async auth(): Promise<void> {
      if (this.getIsAuthenticated) {
        return
      }
      try {
        this.isFallbackRenderButtonUsed = false
        this.isAuthing = true
        this.googleInitialize()
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed()) {
            this.isAuthing = false
            this.renderGoogleButton()

            console.log(
              '❌ One Tap was not displayed:',
              notification.getNotDisplayedReason(),
            )

            if (
              notification.getNotDisplayedReason() === 'opt_out_or_no_session'
            ) {
              showNotify({
                message:
                  'You have opted out of Google One Tap or no session found.',
                background: '#ee0a24',
              })
            }

            if (notification.getNotDisplayedReason() === 'user_cancel') {
              showNotify({
                message: 'Google One Tap was cancelled by the user.',
                background: '#ee0a24',
              })
            }
          }
          if (notification.isSkippedMoment()) {
            this.isAuthing = false
            this.renderGoogleButton()
            console.log(
              '⚠️ One Tap was skipped:',
              notification.getSkippedReason(),
            )
          }
          if (notification.isDismissedMoment() !== 'credential_returned') {
            this.isAuthing = false
            console.log(
              '🛑 One Tap was dismissed:',
              notification.getDismissedReason(),
            )
          }
        })
      } catch (error) {
        this.isAuthing = false
        showNotify({
          message: `Failed to initialize Google auth: ${error}`,
          background: '#ee0a24',
          duration: 2000,
        })
      }
    },

    async postAuthGoogle(
      credentialResponse: GoogleCredentialResponse,
    ): Promise<void> {
      try {
        const {
          data: { user, token },
        } = await axios.post('/auth/google', credentialResponse)

        this.setUser(user, token)

        await router.push('/dashboard')
      } catch (error) {
        showNotify({
          message: `Failed to handle Google credentials response: ${error}`,
          background: '#ee0a24',
        })
      }
    },

    setUser(user, token) {
      this.user = user
      this.token = token
    },

    clearUser() {
      this.user = null
      this.token = null
      this.isFallbackRenderButtonUsed = false
    },

    logout(): void {
      this.googleInitialize()

      if (this.user?.email) {
        window.google.accounts.id.revoke(
          this.user.email,
          (done: AuthGoogleLogoutResponse) => {
            if (!done.successful) {
              showNotify({
                message: 'Failed to revoke Google session',
                background: '#ee0a24',
              })
            }
          },
        )
      }
      this.clearUser()
      router.push('/auth')
    },
  },

  persist: true,
})
