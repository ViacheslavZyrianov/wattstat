<script setup lang="ts">
import { useUIStore } from '@/store/ui'

const uiStore = useUIStore()
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
</template>
