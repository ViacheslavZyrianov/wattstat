import { ref, onMounted, onUnmounted, Ref, ComputedRef, computed } from 'vue'

const installPrompt: Ref<BeforeInstallPromptEvent | null> = ref(null)
const isPwa: Ref<boolean> = ref(false)

export const usePwaInstall = () => {
  const canInstall: Ref<boolean> = ref(false)

  const checkIsPwa: ComputedRef<boolean> = computed(
    () =>
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true,
  )

  const handleBeforeInstallPrompt = (e: Event) => {
    e.preventDefault()
    installPrompt.value = e as BeforeInstallPromptEvent
    canInstall.value = true
  }

  const promptInstall = async () => {
    if (!installPrompt.value) return

    const result = await installPrompt.value.prompt()
    canInstall.value = false
    installPrompt.value = null
    return result.outcome
  }

  onMounted(() => {
    isPwa.value = checkIsPwa.value

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', () => {
      canInstall.value = false
    })
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  })

  return {
    canInstall,
    promptInstall,
    isPwa,
  }
}
