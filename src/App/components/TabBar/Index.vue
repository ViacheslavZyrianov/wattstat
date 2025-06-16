<script setup lang="ts">
import { ref, Ref } from 'vue'
import tabBarItems from '@/App/components/TabBar/Items'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentRoute: Ref<string> = ref(String(route.name))

const generateIconColor = (path: string): string =>
  currentRoute.value === path ? 'primary' : 'grey'
</script>

<template>
  <v-bottom-navigation v-model="currentRoute" app>
    <v-btn
      v-for="item in tabBarItems"
      :key="item.icon"
      :to="item.path"
      :value="item.path"
      :icon="item.icon"
      :size="item.iconSize"
      :color="generateIconColor(item.path)"
    />
  </v-bottom-navigation>
</template>
