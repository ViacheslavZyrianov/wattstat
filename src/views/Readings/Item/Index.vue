<script setup lang="ts">
import { computed, ComputedRef, PropType } from 'vue'
import type { ReadingRead } from '@/store/readings/types'
import ReadingItemContent from './Content.vue'
import eventBus from '@/eventBus'
import { useReadingsStore } from '@/store/readings'
import dayjs from 'dayjs'
import { useUIStore } from '@/store/ui'

const readingsStore = useReadingsStore()
const uiStore = useUIStore()

const props = defineProps({
  data: {
    type: Object as PropType<ReadingRead>,
    default: () => ({}),
  },
  customTitle: {
    type: String,
    default: '',
  },
})

const title: ComputedRef<string> = computed(() =>
  props.customTitle
    ? props.customTitle
    : dayjs(props.data.date).isValid()
      ? dayjs(props.data.date).format('MMMM')
      : props.data.date,
)

const sumTotalDayNight: ComputedRef<{ day: string; night: string }> = computed(
  () => ({
    day: (Number(props.data.day) * 4.32).toFixed(2),
    night: (Number(props.data.night) * 2.16).toFixed(2),
  }),
)

const sumTotal: ComputedRef<string> = computed(() =>
  (
    Number(sumTotalDayNight.value.day) + Number(sumTotalDayNight.value.night)
  ).toFixed(2),
)

const kWhTotal: ComputedRef<number> = computed(
  () => Number(props.data.day) + Number(props.data.night),
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
    confirmButtonColor: 'red',
  })

  eventBus.on('confirm', async () => {
    await readingsStore.deleteReading(props.data.id)
    await readingsStore.fetchReadings()
  })
}
</script>

<template>
  <v-card variant="elevated" class="mb-6">
    <v-card-title class="d-flex align-center pa-0">
      {{ title }}
      <v-spacer />

      <div class="d-flex align-center">
        <v-btn
          variant="text"
          color="primary"
          icon="mdi-pencil"
          size="small"
          @click="onEdit"
        />
        <v-btn
          variant="text"
          color="red"
          icon="mdi-delete"
          size="small"
          @click="onDelete"
        />
      </div>
    </v-card-title>

    <v-list class="pa-0">
      <v-list-item class="pa-0" min-height="36px">
        <template v-slot:prepend> Total </template>
        <template v-slot:append>
          <v-chip color="primary" size="small" class="mr-2">
            {{ sumTotal }} <v-icon>mdi-currency-uah</v-icon>
          </v-chip>
          <v-chip color="green" size="small">
            {{ kWhTotal }} <v-icon>mdi-lightning-bolt</v-icon>
          </v-chip>
        </template>
      </v-list-item>
      <v-list-item class="pa-0" min-height="36px">
        <template v-slot:prepend>
          <div class="text-subtitle-2">{{ uiStore.getDayNightLabels.day }}</div>
        </template>
        <template v-slot:append>
          <v-chip color="primary" size="small" class="mr-2">
            {{ sumTotalDayNight.day }} <v-icon>mdi-currency-uah</v-icon>
          </v-chip>
          <v-chip color="green" size="small">
            {{ data.day }} <v-icon>mdi-lightning-bolt</v-icon>
          </v-chip>
        </template>
      </v-list-item>
      <v-list-item class="pa-0" min-height="36px">
        <template v-slot:prepend>
          <div class="text-subtitle-2">
            {{ uiStore.getDayNightLabels.night }}
          </div>
        </template>
        <template v-slot:append>
          <v-chip color="primary" size="small" class="mr-2">
            {{ sumTotalDayNight.night }} <v-icon>mdi-currency-uah</v-icon>
          </v-chip>
          <v-chip color="green" size="small">
            {{ data.night }} <v-icon>mdi-lightning-bolt</v-icon>
          </v-chip>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped></style>
