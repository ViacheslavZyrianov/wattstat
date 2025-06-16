<script setup>
import { useGoogleAuthStore } from '@/store/auth/google.js'

const googleAuthStore = useGoogleAuthStore()

const onGoogleAuth = async () => {
  await googleAuthStore.auth()
}
</script>

<template>
  <v-card>
    <v-card-title>Sign in to your account</v-card-title>
    <v-card-actions>
      <v-btn
        v-show="!googleAuthStore.isFallbackRenderButtonUsed"
        variant="elevated"
        color="primary"
        prepend-icon="mdi-google"
        block
        :loading="googleAuthStore.isAuthing"
        :disabled="googleAuthStore.isAuthing"
        @click="onGoogleAuth"
      >
        Sign in with Google
      </v-btn>
      <div
        v-show="googleAuthStore.isFallbackRenderButtonUsed"
        id="fallback-button"
        style="width: 100%"
      />
    </v-card-actions>
  </v-card>
</template>
