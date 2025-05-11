<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: '0',
  },
  day: {
    type: String,
    default: '0',
  },
  night: {
    type: String,
    default: '0',
  },
})

const sumTotalDayNight: ComputedRef<{ day: string; night: string }> = computed(
  () => ({
    day: (Number(props.day) * 4.32).toFixed(2),
    night: (Number(props.night) * 2.16).toFixed(2),
  }),
)

const sumTotal: ComputedRef<string> = computed(() =>
  (
    Number(sumTotalDayNight.value.day) + Number(sumTotalDayNight.value.night)
  ).toFixed(2),
)

const kWhTotal: ComputedRef<number> = computed(
  () => Number(props.day) + Number(props.night),
)
</script>

<template>
  <section>
    <van-row justify="space-between" align="center">
      <van-col>
        <h4>{{ props.title }}</h4>
      </van-col>
      <van-col>
        <van-col>
          <van-tag type="primary" style="margin-right: 8px">
            {{ kWhTotal }} kWh
          </van-tag>
          <van-tag type="success">{{ sumTotal }} UAH</van-tag>
        </van-col>
      </van-col>
    </van-row>
    <van-divider :hairline="false" />
    <van-row justify="space-between" align="center">
      <van-col>
        <label> Day (15.8.2) </label>
      </van-col>
      <van-col>
        <van-tag type="primary" style="margin-right: 8px">
          {{ day }} kWh
        </van-tag>
        <van-tag type="success">{{ sumTotalDayNight.day }} UAH</van-tag>
      </van-col>
    </van-row>
    <van-row justify="space-between" align="center">
      <van-col>
        <label> Night (15.8.1) </label>
      </van-col>
      <van-col>
        <van-tag type="primary" style="margin-right: 8px">
          {{ night }} kWh
        </van-tag>
        <van-tag type="success">{{ sumTotalDayNight.night }} UAH</van-tag>
      </van-col>
    </van-row>
  </section>
</template>
