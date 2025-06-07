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

    // Sort by date ASCENDING (oldest to newest)
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
    Object.keys(readingsStore.readings).length === 1 &&
    readingsStore.readings[Object.keys(readingsStore.readings)[0]].length === 1,
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
    confirmButtonType: 'danger',
  })

  eventBus.on('confirm', async () => {
    await readingsStore.deleteReading(initialReading.value.id)
    await readingsStore.fetchReadings()
  })
}

onMounted(async () => {
  await fetchReadings()
  isReady.value = true
})
</script>

<template>
  <template v-if="isReady">
    <reading-item
      :data="latestReading"
      title="Total"
      :has-swipe-cell="false"
      style="margin-bottom: 16px"
    />
    <template v-if="isOnlyInitialReading">
      <h3 style="margin-bottom: 16px">
        You have only initial reading, please enter second reading to see your
        usage!
      </h3>
      <h4 style="margin-bottom: 16px">
        If you want to change initial reading, click on "Edit initial reading"
      </h4>
      <van-button
        type="primary"
        block
        style="margin-bottom: 16px"
        @click="onEditInitialReading"
      >
        Edit initial reading
      </van-button>
      <h4 style="margin-bottom: 16px">
        If you want to delete initial reading, click on "Delete initial reading"
      </h4>
      <van-button
        type="danger"
        block
        style="margin-bottom: 16px"
        @click="onDeleteInitialReading"
      >
        Delete initial reading
      </van-button>
    </template>
    <van-tabs
      v-else-if="isReadingsNotEmpty"
      v-model:active="activeTabYear"
      type="card"
      animated
    >
      <van-tab
        v-for="(readingDataForYear, readingYear) in monthlyUsage"
        :key="readingYear"
        :title="`${readingYear}`"
        :name="readingYear"
      >
        <div class="content">
          <reading-item
            v-for="readingDataForYearItem in readingDataForYear"
            :key="readingDataForYearItem.id"
            :data="readingDataForYearItem"
            class="reading-item"
          />
        </div>
      </van-tab>
    </van-tabs>
    <h3 v-else>
      You still have no electricity readings!
      <br />
      Add it by pressing big green button below!
    </h3>
  </template>
</template>

<style lang="scss" scoped>
.content {
  height: calc(100vh - 266px);
  overflow: auto;
  padding-top: 16px;

  .reading-item {
    margin-bottom: 16px;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
