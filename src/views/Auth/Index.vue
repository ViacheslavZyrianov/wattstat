<script setup lang="ts">
import Google from '@/views/Auth/Google.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const onAuth = () => {
  router.push('/profile')
}
</script>

<template>
  <google @on-auth="onAuth" />
</template>
