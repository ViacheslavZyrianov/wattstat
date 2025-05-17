<script setup lang="ts">
import { computed, ComputedRef, ref } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CenteredLayout from '@/layouts/CenteredLayout.vue'
import FullPageLayout from '@/layouts/FullPageLayout.vue'
import { useUIStore } from '@/store/ui'

const route = useRoute()
const uiStore = useUIStore()

const version = ref(__APP_VERSION__)

const layout: ComputedRef<unknown> = computed(() => {
  switch (route.meta.layout) {
    case 'FullPageLayout':
      return FullPageLayout
    case 'CenteredLayout':
      return CenteredLayout
    default:
      return DefaultLayout
  }
})
</script>

<template>
  <van-tag
    round
    type="warning"
    style="position: fixed; top: 0; left: 0; z-index: 1000"
  >
    {{ version }}
  </van-tag>
  <van-config-provider :theme="uiStore.getTheme" />
  <component :is="layout">
    <router-view />
  </component>
</template>
