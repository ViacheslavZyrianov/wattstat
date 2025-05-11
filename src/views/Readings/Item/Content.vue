<script setup lang="ts">
import { computed, ComputedRef } from 'vue'

const props = defineProps({
  day: {
    type: String,
    default: '0',
  },
  night: {
    type: String,
    default: '0',
  },
})

const sumTotal: ComputedRef<Record<string, string>> = computed(() => ({
  day: (Number(props.day) * 4.32).toFixed(2),
  night: (Number(props.night) * 2.16).toFixed(2),
}))
</script>

<template>
  <section>
    <van-row justify="space-between" align="center">
      <van-col>
        <label> Day (15.8.2) </label>
      </van-col>
      <van-col>
        <van-tag type="primary" style="margin-right: 8px">
          {{ day }} kWh
        </van-tag>
        <van-tag type="success">{{ sumTotal.day }} UAH</van-tag>
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
        <van-tag type="success">{{ sumTotal.night }} UAH</van-tag>
      </van-col>
    </van-row>
  </section>
</template>
