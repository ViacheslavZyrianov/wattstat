<script setup lang="ts">
import { PropType } from 'vue'
import type { ReadingRead } from '@/store/readings/types'
import ReadingItemContent from './Content.vue'
import eventBus from '@/eventBus'
import { useReadingsStore } from '@/store/readings'
import dayjs from 'dayjs'

const readingsStore = useReadingsStore()

const props = defineProps({
  data: {
    type: Object as PropType<ReadingRead>,
    default: () => ({}),
  },
  hasSwipeCell: {
    type: Boolean,
    default: true,
  },
})

const onEdit = () => {
  eventBus.emit('openActionSheetEditReading', props.data)
}

const onDelete = async () => {
  eventBus.emit('showDialogConfirm', {
    title: 'Delete reading',
    message: `Are you sure you want to delete reading from ${dayjs(props.data.date).format('DD.MM.YYYY')}?`,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'No',
    confirmButtonType: 'danger',
  })

  eventBus.on('confirm', async () => {
    await readingsStore.deleteReading(props.data.id)
    await readingsStore.fetchReadings()
  })
}
</script>

<template>
  <van-swipe-cell v-if="hasSwipeCell" :border="false">
    <template #default>
      <reading-item-content :day="data.day" :night="data.night" />
    </template>
    <template #right>
      <van-button
        type="primary"
        text="Edit"
        style="height: 100%; margin-left: 8px"
        @click="onEdit"
      />
      <van-button
        type="danger"
        text="Delete"
        style="height: 100%; margin-left: 8px"
        @click="onDelete"
      />
    </template>
  </van-swipe-cell>
  <reading-item-content v-else :day="data.day" :night="data.night" />
</template>
