<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref } from 'vue'
import dayjs from 'dayjs'
import { useReadingsStore } from '@/store/readings'
import { ReadingRead } from '@/store/readings/types'
import ReadingItem from './Item/Index.vue'

const readingsStore = useReadingsStore()

const isReady: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(false)
const activeTabYear: Ref<string> = ref(
  dayjs().format('YYYY') || Object.keys(readingsStore.readings)[0],
)

const kWhTotal: ComputedRef<ReadingRead> = computed(() => {
  let day = 0
  let night = 0

  for (const year in readingsStore.readings) {
    if (Array.isArray(readingsStore.readings[year])) {
      for (const entry of readingsStore.readings[year]) {
        day += Number(entry.day)
        night += Number(entry.night)
      }
    }
  }

  return {
    id: 0,
    day: day.toString(),
    night: night.toString(),
    date: 'Total',
  }
})

const isReadingsNotEmpty: ComputedRef<boolean> = computed(
  () => Object.keys(readingsStore.readings).length > 0,
)

const fetchReadings = async () => {
  isLoading.value = true
  await readingsStore.fetchReadings()
  isLoading.value = false
}

onMounted(async () => {
  await fetchReadings()
  isReady.value = true
})
</script>

<template>
  <template v-if="isReady">
    <reading-item
      :data="kWhTotal"
      style="margin-bottom: 16px"
      :has-swipe-cell="false"
    />
    <van-tabs
      v-if="isReadingsNotEmpty"
      v-model:active="activeTabYear"
      type="card"
      animated
    >
      <van-tab
        v-for="(readingDataForYear, readingYear) in readingsStore.readings"
        :key="readingYear"
        :title="`${readingYear}`"
        :name="readingYear"
      >
        <van-pull-refresh
          v-model="isLoading"
          loading-text="Updating readings..."
          pulling-text="Pull to refresh"
          loosing-text="Pull to refresh"
          @refresh="fetchReadings"
        >
          <div class="content">
            <reading-item
              v-for="readingDataForYearItem in readingDataForYear"
              :key="readingDataForYearItem.id"
              :data="readingDataForYearItem"
              style="margin-top: 16px"
            />
          </div>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
    <h3 v-else>
      You still have no electricity readings!
      <br />
      Add it by pressing big green button below!
    </h3>
  </template>
</template>

<style scoped>
.content {
  height: calc(100vh - 266px);
  overflow: auto;
}
</style>
