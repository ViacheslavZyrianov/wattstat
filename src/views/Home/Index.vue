<script setup>
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })
})

const installApp = async () => {
  if (!deferredPrompt.value) return
  deferredPrompt.value.prompt()
  const choiceResult = await deferredPrompt.value.userChoice
  if (choiceResult.outcome === 'accepted') {
    console.log('User accepted the install prompt')
  } else {
    console.log('User dismissed the install prompt')
  }
  deferredPrompt.value = null
}
</script>

<template>
  <v-btn v-if="deferredPrompt" @click="installApp"> Install WattStat </v-btn>
</template>
