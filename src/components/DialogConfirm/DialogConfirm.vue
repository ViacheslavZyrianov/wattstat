<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, type Ref } from 'vue'
import eventBus from '@/eventBus'

interface DialogOptions {
  title?: string
  message?: string
  confirmButtonText?: string
  confirmButtonColor?: string
  cancelButtonText?: string
  cancelButtonColor?: string
  persistent?: boolean
  maxWidth?: string | number
}

const isOpen: Ref<boolean> = ref(false)
const options = reactive<DialogOptions>({
  title: 'Title',
  message: 'Message',
  confirmButtonText: 'Confirm',
  confirmButtonColor: 'primary',
  cancelButtonText: 'Cancel',
  cancelButtonColor: 'grey',
  persistent: false,
  maxWidth: 500,
})

const onConfirm = (): void => {
  isOpen.value = false
  eventBus.emit('confirm')
}

const onCancel = (): void => {
  isOpen.value = false
  eventBus.emit('cancel')
}

onMounted(() => {
  eventBus.on('showDialogConfirm', (event) => {
    const dialogOptions = event as DialogOptions
    isOpen.value = true
    Object.assign(options, dialogOptions)
  })
})

onBeforeUnmount(() => {
  eventBus.off('showDialogConfirm')
  eventBus.off('confirm')
  eventBus.off('cancel')
})
</script>

<template>
  <v-dialog
    v-model="isOpen"
    :persistent="options.persistent"
    :max-width="options.maxWidth"
  >
    <v-card>
      <v-card-title class="pa-0 mb-4">
        {{ options.title }}
      </v-card-title>

      <v-card-text class="pa-0">
        <p class="text-body-1">{{ options.message }}</p>
      </v-card-text>

      <v-card-actions class="pa-0 mt-4">
        <v-btn
          :color="options.cancelButtonColor"
          variant="text"
          @click="onCancel"
        >
          {{ options.cancelButtonText }}
        </v-btn>

        <v-btn
          :color="options.confirmButtonColor"
          variant="elevated"
          @click="onConfirm"
        >
          {{ options.confirmButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
