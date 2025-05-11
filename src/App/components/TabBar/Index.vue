<script setup lang="ts">
import { ref, Ref } from 'vue'
import tabBarItems from '@/App/components/TabBar/Items'
import eventBus from '@/eventBus'

const active: Ref<number> = ref(0)

const onActionSheetAddReadingOpen = () => {
  eventBus.emit('openActionSheetAddReading')
}
</script>

<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item
      v-for="tabBarItem in tabBarItems"
      :key="tabBarItem.name"
      :to="tabBarItem.path"
      :icon="tabBarItem.icon"
      :color="tabBarItem.color"
    >
      <template v-if="tabBarItem.icon === 'add'" #icon>
        <van-icon
          :name="tabBarItem.icon"
          :color="tabBarItem.color"
          size="40"
          @click="onActionSheetAddReadingOpen"
        />
      </template>
      {{ tabBarItem.name }}
    </van-tabbar-item>
  </van-tabbar>
</template>
