<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { useGoogleAuthStore } from '@/store/auth/google'
import { useUIStore } from '@/store/ui'
import TabBar from '@/App/components/TabBar/Index.vue'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm.vue'
import ActionSheetAddEditReading from '@/views/Readings/ActionSheetAddEditReading.vue'

const route = useRoute()
const authGoogleAuthStore = useGoogleAuthStore()
const uiStore = useUIStore()

const title: ComputedRef<string> = computed(() => (route.name as string) || '')

const isTitleVisible: ComputedRef<boolean> = computed(() =>
  Boolean(authGoogleAuthStore.getIsAuthenticated && title.value),
)

const appBarColor: ComputedRef<undefined | 'primary'> = computed(() =>
  uiStore.getIsThemeDark ? undefined : 'primary',
)
</script>

<template>
  <v-app>
    <v-app-bar v-if="isTitleVisible" app :color="appBarColor">
      <v-app-bar-title>{{ title }}</v-app-bar-title>
    </v-app-bar>
    <v-main class="fill-height">
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <template v-if="authGoogleAuthStore.getIsAuthenticated">
      <tab-bar />
      <action-sheet-add-edit-reading />
    </template>
    <dialog-confirm />
  </v-app>
</template>
