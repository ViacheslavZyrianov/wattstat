<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from 'vue'
import dayjs from 'dayjs'
import { useReadingsStore } from '@/store/readings'
import { ReadingRead } from '@/store/readings/types'
import ReadingItem from './Item/Index.vue'
import eventBus from '@/eventBus'

const readingsStore = useReadingsStore()

const isReady: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const activeTabYear: Ref<string> = ref(
  dayjs().format('YYYY') || Object.keys(readingsStore.readings)[0],
)

const isReadingsNotEmpty: ComputedRef<boolean> = computed(
  () => Object.keys(readingsStore.readings).length > 0,
)

const fetchReadings = async () => {
  isLoading.value = true
  await readingsStore.fetchReadings()
  isLoading.value = false
}

const monthlyUsage = computed(() => {
  const result: Record<string, ReadingRead[]> = {}

  for (const [year, entries] of Object.entries(readingsStore.readings)) {
    if (!Array.isArray(entries) || entries.length < 2) continue

    const sorted = [...entries].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )

    const usage = []
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]
      const curr = sorted[i]

      usage.push({
        id: curr.id ?? i + 1000,
        day: Math.abs(parseInt(curr.day) - parseInt(prev.day)).toString(),
        enteredDay: curr.day,
        night: Math.abs(parseInt(curr.night) - parseInt(prev.night)).toString(),
        enteredNight: curr.night,
        date: curr.date,
      })
    }

    result[year] = usage.reverse() // Most recent first
  }

  return result
})

const initialReading = computed(() => {
  const allEntries: ReadingRead[] = []

  for (const entries of Object.values(readingsStore.readings)) {
    if (Array.isArray(entries)) {
      allEntries.push(...entries)
    }
  }

  return allEntries.reduce(
    (earliest, entry) =>
      new Date(entry.date) < new Date(earliest.date) ? entry : earliest,
    allEntries[0],
  )
})

const latestReading = computed(() => {
  const allEntries: ReadingRead[] = []

  for (const entries of Object.values(readingsStore.readings)) {
    if (Array.isArray(entries)) {
      allEntries.push(...entries)
    }
  }

  return allEntries.reduce(
    (latest, entry) =>
      new Date(entry.date) > new Date(latest.date) ? entry : latest,
    allEntries[0],
  )
})

const isOnlyInitialReading: ComputedRef<boolean> = computed(
  () =>
    activeTabYear.value === Object.keys(readingsStore.readings)[0] &&
    readingsStore.readings[Object.keys(readingsStore.readings)[0]].length === 1,
)

const years = computed(() =>
  Object.keys(readingsStore.readings).sort((a, b) => b.localeCompare(a)),
)

const onEditInitialReading = () => {
  eventBus.emit('openActionSheetEditReading', initialReading.value)
}

const onDeleteInitialReading = async () => {
  eventBus.emit('showDialogConfirm', {
    title: 'Delete reading',
    message: `Are you sure you want to delete reading from ${dayjs(initialReading.value.date).format('DD.MM.YYYY')}?`,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'No',
    confirmButtonColor: 'red',
  })

  eventBus.on('confirm', async () => {
    await readingsStore.deleteReading(initialReading.value.id)
    await readingsStore.fetchReadings()

    if (!readingsStore.readings[activeTabYear.value]) {
      activeTabYear.value = Object.keys(readingsStore.readings)[0]
    }
  })
}

onMounted(async () => {
  await fetchReadings()
  isReady.value = true
})
</script>

<template>
  <template v-if="isReady">
    <template v-if="isReadingsNotEmpty">
      <v-chip-group
        v-model="activeTabYear"
        row
        mandatory
        selected-class="bg-primary text-white mb-4"
      >
        <v-chip v-for="year in years" :key="year" :value="year">
          {{ year }}
        </v-chip>
      </v-chip-group>

      <template v-if="isOnlyInitialReading">
        <h3 style="margin-bottom: 16px">
          You have only initial reading for this year, please enter second
          reading to see your usage!
        </h3>
        <h4 style="margin-bottom: 16px">
          If you want to change initial reading, click on "Edit initial reading"
        </h4>
        <v-btn
          color="primary"
          block
          style="margin-bottom: 16px"
          @click="onEditInitialReading"
        >
          Edit initial reading
        </v-btn>
        <h4 style="margin-bottom: 16px">
          If you want to delete initial reading, click on "Delete initial
          reading"
        </h4>
        <v-btn
          color="red"
          block
          style="margin-bottom: 16px"
          @click="onDeleteInitialReading"
        >
          Delete initial reading
        </v-btn>
      </template>

      <reading-item
        v-for="readingDataForYearItem in monthlyUsage[activeTabYear]"
        :key="readingDataForYearItem.id"
        :data="readingDataForYearItem"
      />
    </template>
    <h3 v-else>
      You still have no electricity readings!
      <br />
      Add it by pressing big green button below!
    </h3>
  </template>
</template>
