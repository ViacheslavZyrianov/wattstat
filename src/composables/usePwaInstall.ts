import { onMounted, computed, ComputedRef } from 'vue'

export const usePwaInstall = () => {
  // Detect if running as PWA using stable APIs
  const isPwa: ComputedRef<boolean> = computed(() => {
    // Check display mode (stable)
    const isStandaloneMode = window.matchMedia(
      '(display-mode: standalone)',
    ).matches

    // Check if launched from home screen (more reliable detection)
    const isFromHomeScreen =
      window.location.search.includes('source=pwa') ||
      sessionStorage.getItem('isPwaLaunched') === 'true'

    return isStandaloneMode || isFromHomeScreen
  })

  onMounted(() => {
    // Mark as PWA launched if coming from installed app
    if (isPwa.value) {
      sessionStorage.setItem('isPwaLaunched', 'true')
    }
  })

  return {
    isPwa,
  }
}
