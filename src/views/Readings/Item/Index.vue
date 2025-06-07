<script setup lang="ts">
import { computed, ComputedRef, PropType } from 'vue'
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

const title: ComputedRef<string> = computed(() =>
  dayjs(props.data.date).isValid()
    ? dayjs(props.data.date).format('MMMM')
    : props.data.date,
)

const onEdit = () => {
  eventBus.emit('openActionSheetEditReading', {
    id: props.data.id,
    day: props.data.enteredDay,
    night: props.data.enteredNight,
    date: props.data.date,
  })
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
      <reading-item-content
        :title="title"
        :day="data.day"
        :night="data.night"
      />
    </template>
    <template #right>
      <div class="swipe-action-buttons">
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
      </div>
    </template>
  </van-swipe-cell>
  <reading-item-content
    v-else
    :title="title"
    :day="data.day"
    :night="data.night"
  />
</template>

<style scoped>
.swipe-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
}
</style>
