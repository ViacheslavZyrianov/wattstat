<script setup lang="ts">
import { usePwaInstall } from '@/composables/usePwaInstall'
import { isAndroid, isDesktop, isIOS } from '@/helpers/getOS'

const { isPwa } = usePwaInstall()
</script>

<template>
  <v-container>
    <v-chip>v7</v-chip>
    <h4 class="text-h4 font-weight-bold mb-4">
      Watt's Up?<br />
      It's WattStat!
    </h4>

    <v-card v-if="isPwa">
      <div class="mb-4">Nice! Now login into WattStat</div>
      <v-btn color="primary" prepend-icon="mdi-login-variant" to="/auth"
        >Login</v-btn
      >
    </v-card>
    <template v-else>
      <p class="mb-4">Add it to your phone for quick, app-like access!</p>

      <v-card v-if="isIOS">
        <v-card-title class="justify-center"> To install on iOS: </v-card-title>
        <v-list>
          <v-list-item>
            1. Tap the Share button (bottom center: square with ↑).
          </v-list-item>
          <v-list-item> 2. Scroll and tap “Add to Home Screen”. </v-list-item>
          <v-list-item> 3. Tap Add in the top-right corner. </v-list-item>
        </v-list>
      </v-card>

      <v-card v-if="isAndroid">
        <v-card-title class="justify-center"
          >To install on Android:</v-card-title
        >
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
          Please Use a Mobile Device
        </v-card-title>
        <v-list>
          <v-list-item>
            This app works only in PWA mode and is designed for mobile use. To
            get the full experience, please open this website on your smartphone
            and install it to your home screen.
          </v-list-item>
        </v-list>
      </v-card>
    </template>
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
