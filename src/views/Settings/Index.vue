<script setup lang="ts">
import { useUIStore } from '@/store/ui'
import { ref } from 'vue'

const uiStore = useUIStore()

const version = ref(__APP_VERSION__)
</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-title>Theme</v-list-item-title>
      <template #append>
        <div class="d-flex align-center">
          <v-switch
            v-model="uiStore.isThemeDark"
            color="primary"
            hide-details
            density="compact"
            inset
            true-icon="mdi-brightness-2"
            false-icon="mdi-brightness-5"
          />
        </div>
      </template>
    </v-list-item>

    <v-list-item>
      <v-list-item-title>Show codes (15.8.2/15.8.1)</v-list-item-title>
      <template #append>
        <v-switch
          v-model="uiStore.isShowDayNightCodes"
          color="primary"
          hide-details
          density="compact"
        />
      </template>
    </v-list-item>

    <v-list-item>
      <v-list-item-title>Version</v-list-item-title>
      <template #append>
        <v-chip color="warning" variant="outlined" size="small">
          {{ version }}
        </v-chip>
      </template>
    </v-list-item>
  </v-list>
</template>
