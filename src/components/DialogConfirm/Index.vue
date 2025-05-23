<script setup lang="ts">
import { onBeforeUnmount, onMounted, Reactive, reactive, ref, Ref } from 'vue'
import { DialogOptions } from 'vant'
import eventBus from '@/eventBus'

const isOpen: Ref<boolean> = ref(false)
const options: Reactive<DialogOptions> = reactive({
  title: 'Title',
  message: 'Message',
  confirmButtonText: 'Confirm',
  confirmButtonType: 'primary',
  confirmButtonColor: 'primary',
  cancelButtonText: 'Cancel',
  cancelButtonType: 'default',
  cancelButtonColor: '#00f',
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
  eventBus.on('showDialogConfirm', (dialogOptions: DialogOptions) => {
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
  <van-dialog v-model:show="isOpen">
    <template #title>{{ options.title }}</template>
    <template #default>
      <div class="dialog-confirm-content">
        <p>{{ options.message }}</p>
      </div>
    </template>
    <template #footer>
      <van-row class="dialog-confirm-footer" gutter="16">
        <van-col span="12">
          <van-button
            :type="options.cancelButtonType"
            block
            plain
            size="small"
            @click="onCancel"
          >
            {{ options.cancelButtonText }}
          </van-button>
        </van-col>
        <van-col span="12">
          <van-button
            :type="options.confirmButtonType"
            block
            size="small"
            @click="onConfirm"
          >
            {{ options.confirmButtonText }}
          </van-button>
        </van-col>
      </van-row>
    </template>
  </van-dialog>
</template>

<style scoped>
.dialog-confirm-content {
  padding: 16px;
}
.dialog-confirm-footer {
  padding: 16px;
}
</style>
