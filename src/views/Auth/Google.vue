<script setup>
import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/store/auth/index.js'
import { showNotify } from 'vant'

const authStore = useAuthStore()

const emit = defineEmits(['onAuth'])

// Handle manual sign-in click
const handleManualSignIn = () => {
  authStore.showOneTapPrompt()
}

watch(
  () => authStore.getIsAuthenticated,
  () => {
    if (authStore.getIsAuthenticated) {
      emit('onAuth')
    }
  },
)

// Initialize Google auth when component mounts
onMounted(async () => {
  try {
    await authStore.initGoogleAuth()
    authStore.setupGoogleSignIn()
  } catch (error) {
    showNotify({
      message: `Failed to initialize Google auth: ${error}`,
      background: '#ee0a24',
      duration: 2000,
    })
  }
})
</script>

<!-- src/components/LoginPage.vue -->
<template>
  <section class="login-container">
    <h2 style="margin-bottom: 32px">Sign in to your account</h2>

    <!-- Regular sign-in button will be rendered here by Google -->
    <van-button
      :loading="authStore.getIsLoading"
      :disabled="authStore.getIsLoading"
      type="primary"
      block
      @click="handleManualSignIn"
    >
      Sign in with Google
    </van-button>
  </section>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  padding: 16px;
  border-radius: 8px;
}
</style>
