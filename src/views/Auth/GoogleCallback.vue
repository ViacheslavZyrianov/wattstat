<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const code = route.query.code as string

  if (code) {
    const success = await authStore.handleGoogleResponse(code)

    if (success) {
      const returnUrl = localStorage.getItem('authReturnUrl') || '/dashboard'
      router.replace(returnUrl)
    } else {
      router.replace('/auth')
    }
  } else {
    router.replace('/auth')
  }

  localStorage.removeItem('authReturnUrl')
})
</script>

<template>
  <div class="google-callback">
    <p>Processing authentication...</p>
  </div>
</template>
