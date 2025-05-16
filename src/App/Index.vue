<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import FullPageLayout from '@/layouts/FullPageLayout.vue'
import { useUIStore } from '@/store/ui'

const route = useRoute()
const uiStore = useUIStore()

const layout: ComputedRef<unknown> = computed(() => {
  switch (route.meta.layout) {
    case 'FullPageLayout':
      return FullPageLayout
    case 'AuthLayout':
      return AuthLayout
    default:
      return DefaultLayout
  }
})
</script>

<template>
  <van-config-provider :theme="uiStore.getTheme" />
  <component :is="layout">
    <router-view />
  </component>
</template>
