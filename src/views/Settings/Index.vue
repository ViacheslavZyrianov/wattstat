<script setup lang="ts">
import { useUIStore } from '@/store/ui'
import { ref } from 'vue'

const uiStore = useUIStore()

const version = ref(__APP_VERSION__)
</script>

<template>
  <van-cell-group>
    <van-cell center title="Theme">
      <template #right-icon>
        Light
        <van-switch
          v-model="uiStore.isThemeDark"
          size="20px"
          style="margin-inline: 8px"
        />
        Dark
      </template>
    </van-cell>
  </van-cell-group>
  <van-cell-group>
    <van-cell center title="Version">
      <template #value>
        <van-tag round type="warning">
          {{ version }}
        </van-tag>
      </template>
    </van-cell>
  </van-cell-group>
</template>
