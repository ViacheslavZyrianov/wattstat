<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from 'vue'
import dayjs from 'dayjs'
import { useReadingsStore } from '@/store/readings'
import ReadingItem from './Item/Index.vue'

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
  const result: Record<
    string,
    Array<{
      id: number | null
      day: string
      night: string
      date: string
      created_at: string
    }>
  > = {}

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
        night: Math.abs(parseInt(curr.night) - parseInt(prev.night)).toString(),
        date: curr.date, // usage occurred *in the month of this reading*
        created_at: curr.created_at,
      })
    }

    result[year] = usage.reverse() // Reverse to show the most recent month first
  }

  return result
})

const latestReading = computed(() => {
  const allEntries: Array<{
    id: number
    day: string
    night: string
    date: string
    created_at: string
  }> = []

  for (const entries of Object.values(readingsStore.readings)) {
    if (Array.isArray(entries)) {
      allEntries.push(...entries)
    }
  }

  const latestEntry = allEntries.reduce(
    (latest, entry) =>
      new Date(entry.date) > new Date(latest.date) ? entry : latest,
    allEntries[0],
  )

  latestEntry.date = 'Total'

  return latestEntry
})

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
    <van-tabs
      v-if="isReadingsNotEmpty"
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
