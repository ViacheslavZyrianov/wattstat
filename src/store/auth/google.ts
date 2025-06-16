import { defineStore } from 'pinia'
import axios from '@/axios'
import {
  AuthGoogleLogoutResponse,
  AuthGoogleState,
  GoogleCredentialResponse,
} from '@/store/auth/types'
import router from '@/router'
import eventBus from '@/eventBus'

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

      eventBus.emit('showWarningSnackbar', {
        text: 'Google One Tap is not available, please authenticate with fallback button.',
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
              eventBus.emit('showErrorSnackbar', {
                text: 'You have opted out of Google One Tap or no session found.',
              })
            }

            if (notification.getNotDisplayedReason() === 'user_cancel') {
              eventBus.emit('showErrorSnackbar', {
                text: 'Google One Tap was cancelled by the user.',
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
        eventBus.emit('showErrorSnackbar', {
          text: `Failed to initialize Google auth: ${error}`,
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
        eventBus.emit('showErrorSnackbar', {
          text: `Failed to handle Google credentials response: ${error}`,
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
              eventBus.emit('showErrorSnackbar', {
                text: 'Failed to revoke Google session',
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
