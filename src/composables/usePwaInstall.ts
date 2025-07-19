import { ref, onMounted, onUnmounted, Ref, ComputedRef, computed } from 'vue'

// Enhanced PWA install composable with native support + stable fallbacks
const installPromptEvent: Ref<any> = ref(null)
const isPwa: Ref<boolean> = ref(false)

export const usePwaInstall = () => {
  const canInstall: Ref<boolean> = ref(false)
  const isIos: Ref<boolean> = ref(false)
  const showInstallBanner: Ref<boolean> = ref(false)
  const hasNativePrompt: Ref<boolean> = ref(false)

  // Detect if running as PWA using stable APIs
  const checkIsPwa: ComputedRef<boolean> = computed(() => {
    // Check display mode (stable)
    const isStandaloneMode = window.matchMedia(
      '(display-mode: standalone)',
    ).matches

    // Check iOS standalone (stable)
    const isIosStandalone = (window.navigator as any).standalone === true

    // Check if launched from home screen (more reliable detection)
    const isFromHomeScreen =
      window.location.search.includes('source=pwa') ||
      sessionStorage.getItem('isPwaLaunched') === 'true'

    return isStandaloneMode || isIosStandalone || isFromHomeScreen
  })

  // Detect iOS devices
  const detectIos = (): boolean => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    return (
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )
  }

  // Handle native beforeinstallprompt event (when available)
  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault()
    installPromptEvent.value = e
    hasNativePrompt.value = true
    canInstall.value = true
  }

  // Check if PWA is installable using stable methods
  const checkInstallability = () => {
    const currentPwa = checkIsPwa.value
    const currentIos = detectIos()

    isIos.value = currentIos
    isPwa.value = currentPwa

    // Show install prompt if not already running as PWA
    if (!currentPwa && !localStorage.getItem('pwa-install-dismissed')) {
      checkPwaRequirements().then((hasRequirements) => {
        if (hasRequirements) {
          canInstall.value = true
          // Show banner for iOS or when no native prompt is available
          showInstallBanner.value = currentIos || !hasNativePrompt.value
        }
      })
    }
  }

  // Check if PWA requirements are met
  const checkPwaRequirements = async (): Promise<boolean> => {
    try {
      // Check for manifest
      const manifestLink = document.querySelector(
        'link[rel="manifest"]',
      ) as HTMLLinkElement
      if (!manifestLink) return false

      // Check for service worker
      if (!('serviceWorker' in navigator)) return false

      // Optionally fetch and validate manifest
      const manifestResponse = await fetch(manifestLink.href)
      const manifest = await manifestResponse.json()

      return (
        !!(manifest.name || manifest.short_name) &&
        !!manifest.start_url &&
        !!manifest.icons &&
        manifest.icons.length > 0
      )
    } catch {
      return false
    }
  }

  // Enhanced install method - tries native first, falls back to instructions
  const promptInstall = async () => {
    if (!canInstall.value) return Promise.resolve('dismissed')

    // Try native installation first (if available)
    if (hasNativePrompt.value && installPromptEvent.value) {
      try {
        const result = await installPromptEvent.value.prompt()
        const outcome = result.outcome

        // Clean up after native prompt
        hasNativePrompt.value = false
        installPromptEvent.value = null

        if (outcome === 'accepted') {
          canInstall.value = false
          showInstallBanner.value = false
        }

        return outcome
      } catch (error) {
        console.warn(
          'Native install prompt failed, falling back to instructions:',
          error,
        )
        // Fall through to instruction method
      }
    }

    // Fallback to instruction dialogs
    return new Promise<string>((resolve) => {
      let confirmed: boolean

      // For iOS, show specific instructions
      if (isIos.value) {
        confirmed = window.confirm(
          'To install this app on your iOS device:\n\n' +
            '1. Tap the Share button in Safari\n' +
            '2. Select "Add to Home Screen"\n' +
            '3. Tap "Add" to confirm\n\n' +
            'Would you like to continue?',
        )
        resolve(confirmed ? 'accepted' : 'dismissed')
      } else {
        // For other browsers, show generic instructions
        confirmed = window.confirm(
          'To install this app:\n\n' +
            "1. Look for an install icon in your browser's address bar\n" +
            '2. Or use your browser\'s menu to "Install app" or "Add to Home Screen"\n\n' +
            'Would you like to dismiss this message?',
        )
        resolve(confirmed ? 'dismissed' : 'accepted')
      }

      // Only hide the banner if user explicitly dismissed it (non-iOS confirmed case)
      if (!isIos.value && confirmed) {
        showInstallBanner.value = false
      }
    })
  }

  // Reset install availability (useful for testing or re-enabling)
  const resetInstallPrompt = () => {
    localStorage.removeItem('pwa-install-dismissed')
    canInstall.value = false
    showInstallBanner.value = false
    hasNativePrompt.value = false
    installPromptEvent.value = null
    checkInstallability()
  }

  onMounted(() => {
    checkInstallability()

    // Listen for native beforeinstallprompt (when supported)
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installation
    window.addEventListener('appinstalled', () => {
      canInstall.value = false
      showInstallBanner.value = false
      hasNativePrompt.value = false
      installPromptEvent.value = null
      isPwa.value = true
      localStorage.setItem('pwa-install-dismissed', 'true')
    })

    // Mark as PWA launched if coming from installed app
    if (checkIsPwa.value) {
      sessionStorage.setItem('isPwaLaunched', 'true')
    }
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  })

  return {
    canInstall,
    promptInstall,
    isPwa,
    isIos,
    showInstallBanner,
    hasNativePrompt,
    resetInstallPrompt,
  }
}
