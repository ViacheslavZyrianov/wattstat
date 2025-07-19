<script setup lang="ts">
import { usePwaInstall } from '@/composables/usePwaInstall'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const { canInstall, promptInstall, isPwa, hasNativePrompt } = usePwaInstall()
const router = useRouter()

const onInstallPWA = async () => {
  const outcome = await promptInstall()
  console.log(`Install prompt outcome: ${outcome}`)
}

onMounted(() => {
  if (isPwa) router.push('/auth')
})
</script>

<template>
  <v-container>
    <v-card>
      <v-chip>v3</v-chip>
      <h4 class="text-h4 font-weight-bold mb-4">
        Watt's Up?<br />
        It's WattStat!
      </h4>
      <p class="mb-4">
        Whether you're a data nerd or just curious, WattStat helps you keep your
        electricity in check. Simple logging, powerful stats.
      </p>
      <p class="mb-4">Add it to your phone for quick, app-like access!</p>

      <!-- Show install button only when app can be installed and not already a PWA -->
      <v-btn
        v-if="canInstall && !isPwa"
        color="primary"
        :prepend-icon="hasNativePrompt ? 'mdi-download' : 'mdi-lightning-bolt'"
        @click="onInstallPWA"
      >
        Install PWA
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
