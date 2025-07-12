<script setup lang="ts">
import { Ref, ref, onMounted, onBeforeUnmount } from 'vue'

const isButtonInstallPWAVisible: Ref<boolean> = ref(false)
const installPrompt: Ref<Event | null> = ref(null)

const addEventListenerBeforeInstallPrompt = () => {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installPrompt.value = event
    isButtonInstallPWAVisible.value = true
  })
}

const removeEventListenerBeforeInstallPrompt = () => {
  window.removeEventListener('beforeinstallprompt')
}

const addEventListenerAppInstalled = () => {
  window.addEventListener('appinstalled', () => {
    disableInAppInstallPrompt()
  })
}

const removeEventListenerAppInstalled = () => {
  window.removeEventListener('appinstalled')
}

const disableInAppInstallPrompt = () => {
  installPrompt.value = null
  isButtonInstallPWAVisible.value = false
}

const installPWA = async () => {
  if (!installPrompt.value) return

  installPrompt.value.prompt()

  const result = await installPrompt.value.userChoice
  console.log(`Install prompt outcome: ${result.outcome}`)

  disableInAppInstallPrompt()
  installPrompt.value = null
}

onMounted(() => {
  addEventListenerBeforeInstallPrompt()
  addEventListenerAppInstalled()
})

onBeforeUnmount(() => {
  removeEventListenerBeforeInstallPrompt()
  removeEventListenerAppInstalled()
})
</script>

<template>
  <v-container>
    <v-card>
      <h4 class="text-h4 font-weight-bold mb-4">
        Watt's Up?<br />
        It's WattStat!
      </h4>
      <p class="mb-4">
        Whether you’re a data nerd or just curious, WattStat helps you keep your
        electricity in check. Simple logging, powerful stats.
      </p>
      <p class="mb-4">Add it to your phone for quick, app-like access!</p>
      <v-btn
        v-if="isButtonInstallPWAVisible"
        color="primary"
        prepend-icon="mdi-lightning-bolt"
        @click="installPWA"
      >
        Install WattStat
      </v-btn>
    </v-card>
  </v-container>
  <v-footer class="position-fixed bottom-0 right-0 left-0 flex justify-center">
    <v-btn
      href="/privacy-policy"
      variant="text"
      class="text-decoration-underline"
    >
      Privacy Policy
    </v-btn>
    <v-btn
      href="/terms-of-service"
      variant="text"
      class="text-decoration-underline"
    >
      Terms Of Service
    </v-btn>
  </v-footer>
</template>
