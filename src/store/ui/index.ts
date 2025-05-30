import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    isThemeDark: Boolean(
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    ),
    isShowDayNightCodes: true,
  }),
  getters: {
    getTheme(state) {
      return state.isThemeDark ? 'dark' : 'light'
    },
    getDayNightLabels(state) {
      return {
        day: state.isShowDayNightCodes ? 'Day (15.8.2)' : 'Day',
        night: state.isShowDayNightCodes ? 'Night (15.8.1)' : 'Night',
      }
    },
  },
  persist: true,
})
