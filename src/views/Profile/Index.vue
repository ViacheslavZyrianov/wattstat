<script setup lang="ts">
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'
import eventBus from '@/eventBus'

const router = useRouter()
const authStore = useAuthStore()

const onLogout = async (): Promise<void> => {
  eventBus.emit('showDialogConfirm', {
    title: 'Logout',
    message: 'Are you sure you want to logout?',
    confirmButtonText: 'Yes, logout',
    cancelButtonText: 'No',
    confirmButtonType: 'danger',
  })

  eventBus.on('confirm', async () => {
    await authStore.logout()
    router.push('/auth')
  })
}
</script>

<template>
  <van-cell-group v-if="authStore.getUser">
    <van-cell>
      <template #title>
        <van-image
          round
          width="80px"
          height="80px"
          :src="authStore.getUser.avatar"
        />
      </template>
    </van-cell>
    <van-cell title="Name" :value="authStore.getUser.displayName" />
    <van-cell title="Email">
      <van-text-ellipsis :content="authStore.getUser.email" />
    </van-cell>
    <van-cell title="Logout">
      <van-button size="small" type="danger" plain @click="onLogout">
        Logout
      </van-button>
    </van-cell>
  </van-cell-group>
</template>
