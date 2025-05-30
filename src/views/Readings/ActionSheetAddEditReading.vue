<script setup lang="ts">
import {
  computed,
  ComputedRef,
  onMounted,
  reactive,
  Reactive,
  ref,
  Ref,
  watch,
} from 'vue'
import eventBus from '@/eventBus'
import { useReadingsStore } from '@/store/readings'
import { Reading, ReadingRead } from '@/store/readings/types'

const readingsStore = useReadingsStore()

const isActionSheetReadingOpen: Ref<boolean> = ref(false)
const isButtonSubmitDisabled: Ref<boolean> = ref(false)
const isButtonSubmitLoading: Ref<boolean> = ref(false)
const form: Reactive<Reading> = reactive({
  day: '',
  night: '',
  date: new Date().toISOString().split('T')[0],
})
const actionSheetMode: Ref<'add' | 'edit'> = ref('add')
const id: Ref<number | null> = ref(null)

const rules = {
  day: [
    { required: true, message: 'Please enter day reading' },
    { pattern: /^[0-9]*$/, message: 'Please enter a valid number' },
  ],
  night: [
    { required: true, message: 'Please enter night reading' },
    { pattern: /^[0-9]*$/, message: 'Please enter a valid number' },
  ],
}

const basedOnMode: ComputedRef<
  Record<'add' | 'edit', { title: string; action: string }>
> = computed(() => ({
  add: {
    title: 'Add Reading',
    action: 'add',
  },
  edit: {
    title: 'Edit Reading',
    action: 'edit',
  },
}))

const resetForm = () => {
  form.day = ''
  form.night = ''
  form.date = new Date().toISOString().split('T')[0]
}

const onActionSheetAddReadingOpen = () => {
  actionSheetMode.value = 'add'
  isActionSheetReadingOpen.value = true
  resetForm()
}

const onActionSheetEditReadingOpen = (reading: ReadingRead): void => {
  id.value = reading.id
  form.day = reading.day
  form.night = reading.night
  form.date = reading.date
  actionSheetMode.value = 'edit'
  isActionSheetReadingOpen.value = true
}

const onActionSheetAddReadingClose = () => {
  isActionSheetReadingOpen.value = false
  id.value = null
}

const onSubmit = async (): Promise<void> => {
  try {
    isButtonSubmitDisabled.value = true
    isButtonSubmitLoading.value = true

    if (basedOnMode.value[actionSheetMode.value].action === 'add') {
      await readingsStore.postReading(form)
    }

    if (basedOnMode.value[actionSheetMode.value].action === 'edit') {
      await readingsStore.patchReading(id.value, form)
    }

    onActionSheetAddReadingClose()
    await readingsStore.fetchReadings()
  } finally {
    isButtonSubmitDisabled.value = false
    isButtonSubmitLoading.value = false
  }
}

const onFailed = () => {}

watch(
  () => [form.day, form.night],
  ([day, night]) => {
    isButtonSubmitDisabled.value =
      !day || !night || day === '0' || night === '0'
  },
)

onMounted(() => {
  eventBus.on('openActionSheetAddReading', onActionSheetAddReadingOpen as any)
  eventBus.on('openActionSheetEditReading', onActionSheetEditReadingOpen as any)
})
</script>

<template>
  <van-action-sheet
    v-model:show="isActionSheetReadingOpen"
    :title="basedOnMode[actionSheetMode].title"
    :closeable="false"
    :close-on-click-overlay="false"
  >
    <van-form error-message-align="right" @failed="onFailed" @submit="onSubmit">
      <van-cell-group inset style="padding: 16px 0">
        <van-field
          v-model="form.day"
          name="day"
          label="Day (15.8.2)"
          type="number"
          placeholder="Enter day reading"
          input-align="right"
          :rules="rules.day"
        />
        <van-field
          v-model="form.night"
          name="night"
          label="Night (15.8.1)"
          type="number"
          placeholder="Enter night reading"
          input-align="right"
          :rules="rules.night"
        />
        <van-field
          v-model="form.date"
          name="date"
          label="Date"
          type="date"
          input-align="right"
        />
        <van-row gutter="16" style="margin-top: 16px">
          <van-col span="12">
            <van-button
              round
              type="danger"
              block
              plain
              @click="onActionSheetAddReadingClose"
            >
              Cancel
            </van-button>
          </van-col>
          <van-col span="12">
            <van-button
              round
              type="success"
              block
              native-type="submit"
              :loading="isButtonSubmitLoading"
              :disabled="isButtonSubmitDisabled"
            >
              Save
            </van-button>
          </van-col>
        </van-row>
      </van-cell-group>
    </van-form>
  </van-action-sheet>
</template>
