<script setup>
import { useGoogleAuthStore } from '@/store/auth/google.js'

const googleAuthStore = useGoogleAuthStore()

const onGoogleAuth = async () => {
  await googleAuthStore.auth()
}
</script>

<template>
  <section class="login-container">
    <h2 style="margin-bottom: 32px">Sign in to your account</h2>
    <van-button
      v-show="!googleAuthStore.isFallbackRenderButtonUsed"
      type="primary"
      block
      :loading="googleAuthStore.isAuthing"
      :disabled="googleAuthStore.isAuthing"
      @click="onGoogleAuth"
    >
      Sign in with Google
    </van-button>
    <div
      v-show="googleAuthStore.isFallbackRenderButtonUsed"
      id="fallback-button"
      style="width: 100%"
    />
  </section>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  padding: 16px;
  border-radius: 8px;
}
</style>
