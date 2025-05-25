<script setup lang="ts">
import eventBus from '@/eventBus'
import { useGoogleAuthStore } from '@/store/auth/google'

const googleAuthStore = useGoogleAuthStore()

const onLogout = async (): Promise<void> => {
  eventBus.emit('showDialogConfirm', {
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'No',
    confirmButtonType: 'danger',
  })

  eventBus.on('confirm', () => {
    googleAuthStore.logout()
  })
}
</script>

<template>
  <van-cell-group v-if="googleAuthStore.getUser">
    <van-cell>
      <template #title>
        <van-image
          round
          width="80px"
          height="80px"
          :src="googleAuthStore.getUser.picture"
        />
      </template>
    </van-cell>
    <van-cell title="Name" :value="googleAuthStore.getUser.name" />
    <van-cell title="Email">
      <van-text-ellipsis :content="googleAuthStore.getUser.email" />
    </van-cell>
    <van-cell title="Logout">
      <van-button size="small" type="danger" plain @click="onLogout">
        Logout
      </van-button>
    </van-cell>
  </van-cell-group>
</template>
