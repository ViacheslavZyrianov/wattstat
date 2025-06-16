<script setup lang="ts">
import { computed, ComputedRef, ref, Ref } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import CenteredLayout from '@/layouts/CenteredLayout.vue'
import FullPageLayout from '@/layouts/FullPageLayout.vue'
import { useUIStore } from '@/store/ui'
import eventBus from '@/eventBus'

const route = useRoute()
const uiStore = useUIStore()

const isSnackbarVisible: Ref<boolean> = ref(false)
const snackbarOptions = ref({
  text: '',
  timeout: 3000,
})

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

eventBus.on('showInfoSnackbar', (options) => {
  snackbarOptions.value = {
    ...options,
    color: 'cyan-darken-2',
  }
})

eventBus.on('showSuccessSnackbar', (options) => {
  snackbarOptions.value = {
    ...options,
    color: 'green-lighten-2',
  }
})

eventBus.on('showWarningSnackbar', (options) => {
  snackbarOptions.value = {
    ...options,
    color: 'orange-lighten-2',
  }
})

eventBus.on('showErrorSnackbar', (options) => {
  snackbarOptions.value = {
    ...options,
    color: 'red',
  }
})
</script>

<template>
  <v-theme-provider :theme="uiStore.getTheme" with-background>
    <component :is="layout">
      <router-view />
    </component>
    <v-snackbar
      v-model="isSnackbarVisible"
      :timeout="snackbarOptions.timeout"
      :color="snackbarOptions.color"
    >
      {{ snackbarOptions.text }}
    </v-snackbar>
  </v-theme-provider>
</template>
