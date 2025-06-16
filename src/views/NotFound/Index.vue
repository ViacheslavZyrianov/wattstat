<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <h1>404</h1>
  <h2>Page not found</h2>
  <v-btn variant="elevated" color="primary" @click="router.push('/')">
    Go to Home
  </v-btn>
</template>

<style scoped></style>
