<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/store/auth'
import { showNotify } from 'vant'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isSuccessAuth: Ref<boolean> = ref(false)

const handleGoogleResponse = async () => {
  try {
    isSuccessAuth.value = await authStore.handleGoogleResponse(
      `${route.query.code}`,
    )

    await router.replace(localStorage.getItem('authReturnUrl') || '/auth')

    localStorage.removeItem('authReturnUrl')
  } catch (error) {
    showNotify({
      type: 'danger',
      message: `${error}`,
      duration: 5000,
    })
  }
}

onMounted(async () => {
  await handleGoogleResponse()
})
</script>

<template>
  <div class="google-callback">
    <p>Processing authentication...</p>
  </div>
</template>
