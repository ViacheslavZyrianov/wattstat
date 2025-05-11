// define pinia store with id "ui"
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    isThemeDark: Boolean(
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    ),
  }),
  getters: {
    getTheme(state) {
      return state.isThemeDark ? 'dark' : 'light'
    },
  },
  persist: true,
})
