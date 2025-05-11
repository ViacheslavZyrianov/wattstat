<script setup>
import { onMounted, watch } from 'vue'
import { useAuthStore } from '@/store/auth/index.js'

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
    console.error('Failed to initialize Google auth:', error)
  }
})
</script>

<!-- src/components/LoginPage.vue -->
<template>
  <div class="login-container">
    <h2>Sign in to your account</h2>

    <div v-if="authStore.getIsLoading">Loading authentication...</div>

    <div v-else>
      <!-- Regular sign-in button will be rendered here by Google -->
      <button @click="handleManualSignIn" class="manual-signin-btn">
        Sign in with Google
      </button>

      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.manual-signin-btn {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.error-message {
  color: #d93025;
  margin-top: 15px;
}
</style>
