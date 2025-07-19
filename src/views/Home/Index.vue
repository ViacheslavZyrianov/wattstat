<script setup lang="ts">
import { usePwaInstall } from '@/composables/usePwaInstall'
import { computed, ComputedRef } from 'vue'
import { isAndroid, isDesktop, isIOS } from '@/helpers/getOS'

const { canInstall, promptInstall, isPwa, hasNativePrompt } = usePwaInstall()

const iconInstallPWA: ComputedRef<'mdi-download' | 'mdi-lightning-bolt'> =
  computed(() => (hasNativePrompt ? 'mdi-download' : 'mdi-lightning-bolt'))

const isButtonInstallPWAVisible: ComputedRef<boolean> = computed(
  () => canInstall && !isPwa,
)
</script>

<template>
  <v-container>
    <v-chip>v5</v-chip>
    <h4 class="text-h4 font-weight-bold mb-4">
      Watt's Up?<br />
      It's WattStat!
    </h4>

    <p class="mb-4">Add it to your phone for quick, app-like access!</p>

    <v-btn
      v-if="isButtonInstallPWAVisible"
      color="primary"
      :prepend-icon="iconInstallPWA"
      @click="promptInstall"
    >
      Install PWA
    </v-btn>

    <v-card v-if="isIOS">
      <v-card-title class="justify-center"> To install on iOS: </v-card-title>
      <v-list>
        <v-list-item>
          1. Tap the three dots menu (⋮) in the top-right corner.
        </v-list-item>
        <v-list-item>
          2. Select “Add to Home screen” or “Install app”.
        </v-list-item>
        <v-list-item> 3. Tap Add to confirm. </v-list-item>
      </v-list>
    </v-card>

    <v-card v-if="isAndroid">
      <v-card-title class="justify-center">To install on Android:</v-card-title>
      <v-list>
        <v-list-item>
          1. Tap the three dots menu (⋮) in the top-right corner.
        </v-list-item>
        <v-list-item>
          2. Select “Add to Home screen” or “Install app”.
        </v-list-item>
        <v-list-item> 3. Tap Add to confirm. </v-list-item>
      </v-list>
    </v-card>

    <v-card v-if="isDesktop">
      <v-card-title class="d-flex align-center">
        <div>Please Use a Mobile Device</div>
      </v-card-title>
      <v-list>
        <v-list-item>
          This app works only in PWA mode and is designed for mobile use. To get
          the full experience, please open this website on your smartphone and
          install it to your home screen.
        </v-list-item>
      </v-list>
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
