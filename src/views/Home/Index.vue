<script setup lang="ts">
import { usePwaInstall } from '@/composables/usePwaInstall'

const {
  canInstall,
  promptInstall,
  isPwa,
  isIos,
  showInstallBanner,
  hasNativePrompt,
} = usePwaInstall()

const onInstallPWA = async () => {
  const outcome = await promptInstall()
  console.log(`Install prompt outcome: ${outcome}`)
}
</script>

<template>
  <v-container>
    <v-card>
      <v-chip>v2</v-chip>
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

      <!-- Show a banner for better visibility if recommended -->
      <!--      <v-alert-->
      <!--        v-if="showInstallBanner && canInstall && !isPwa"-->
      <!--        type="info"-->
      <!--        variant="tonal"-->
      <!--        class="mt-4"-->
      <!--        closable-->
      <!--        @click:close="showInstallBanner = false"-->
      <!--      >-->
      <!--        <template #prepend>-->
      <!--          <v-icon>{{-->
      <!--            hasNativePrompt ? 'mdi-download' : 'mdi-lightning-bolt'-->
      <!--          }}</v-icon>-->
      <!--        </template>-->
      <!--        <div class="d-flex align-center justify-space-between">-->
      <!--          <div>-->
      <!--            <strong>Install WattStat</strong>-->
      <!--            <br />-->
      <!--            <small>-->
      <!--              {{-->
      <!--                hasNativePrompt-->
      <!--                  ? 'Click to install directly from your browser'-->
      <!--                  : isIos-->
      <!--                    ? 'Add to your home screen for easy access'-->
      <!--                    : 'Get the full app experience'-->
      <!--              }}-->
      <!--            </small>-->
      <!--          </div>-->
      <!--          <v-btn size="small" variant="outlined" @click="onInstallPWA">-->
      <!--            Install PWA-->
      <!--          </v-btn>-->
      <!--        </div>-->
      <!--      </v-alert>-->

      <!-- Show success message when already installed as PWA -->
      <v-alert v-if="isPwa" type="success" variant="tonal" class="mt-4">
        <template #prepend>
          <v-icon>mdi-check-circle</v-icon>
        </template>
        Great! You're using WattStat as an installed app.
      </v-alert>
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
