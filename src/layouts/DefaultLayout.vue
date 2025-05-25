<script setup lang="ts">
import { computed, ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { useGoogleAuthStore } from '@/store/auth/google'
import TabBar from '@/App/components/TabBar/Index.vue'
import DialogConfirm from '@/components/DialogConfirm/DialogConfirm.vue'
import ActionSheetAddEditReading from '@/views/Readings/ActionSheetAddEditReading.vue'

const route = useRoute()
const authGoogleAuthStore = useGoogleAuthStore()

const title: ComputedRef<string> = computed(() => (route.name as string) || '')

const isTitleVisible: ComputedRef<boolean> = computed(() =>
  Boolean(authGoogleAuthStore.getIsAuthenticated && title.value),
)
</script>

<template>
  <van-nav-bar v-if="isTitleVisible" :title="title" />
  <main>
    <slot />
  </main>
  <tab-bar v-if="authGoogleAuthStore.getIsAuthenticated" />
  <dialog-confirm />
  <action-sheet-add-edit-reading />
</template>

<style lang="scss" scoped>
main {
  height: calc(100vh - 96px);
}
</style>
