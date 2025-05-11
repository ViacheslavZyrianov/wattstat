<script setup lang="ts">
import TabBar from '@/App/components/TabBar/Index.vue'
import DialogConfirm from '@/App/components/DialogConfirm/Index.vue'
import { useAuthStore } from '@/store/auth'
import { useRoute } from 'vue-router'
import { computed, ComputedRef } from 'vue'
import { useUIStore } from '@/store/ui'
import ActionSheetAddEditReading from '@/views/Readings/ActionSheetAddEditReading.vue'

const route = useRoute()
const authStore = useAuthStore()
const uiStore = useUIStore()

const title: ComputedRef<string> = computed(() => (route.name as string) || '')

const isTitleVisible: ComputedRef<boolean> = computed(() =>
  Boolean(authStore.getIsAuthenticated && title.value),
)
</script>

<template>
  <van-config-provider :theme="uiStore.getTheme" />
  <van-nav-bar v-if="isTitleVisible" :title="title" />
  <main>
    <router-view />
  </main>
  <tab-bar v-if="authStore.getIsAuthenticated" />
  <dialog-confirm />
  <action-sheet-add-edit-reading />
</template>
