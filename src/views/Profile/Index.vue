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
    confirmButtonColor: 'red',
  })

  eventBus.on('confirm', () => {
    googleAuthStore.logout()
  })
}
</script>

<template>
  <v-card v-if="googleAuthStore.getUser">
    <v-card-text class="text-center pa-6">
      <v-avatar size="120" class="mb-4" color="primary">
        <v-img :src="googleAuthStore.getUser.picture" alt="Profile Avatar" />
      </v-avatar>

      <h2 class="text-h5 font-weight-medium mb-2">
        {{ googleAuthStore.getUser.name }}
      </h2>

      <p class="text-body-1 text-medium-emphasis mb-6 text-truncate">
        {{ googleAuthStore.getUser.email }}
      </p>

      <!-- Logout Button -->
      <v-btn
        color="red"
        variant="elevated"
        block
        class="mt-4"
        prepend-icon="mdi-logout"
        @click="onLogout"
      >
        Logout
      </v-btn>
    </v-card-text>
  </v-card>
</template>
