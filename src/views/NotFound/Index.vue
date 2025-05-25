<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <h1>404</h1>
  <h2>Page not found</h2>
  <van-button type="primary" @click="router.push('/')"> Go to Home </van-button>
</template>

<style scoped></style>
