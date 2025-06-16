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
import { useUIStore } from '@/store/ui'
import dayjs from 'dayjs'

const readingsStore = useReadingsStore()
const uiStore = useUIStore()

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
const isDatepickerOpen: Ref<boolean> = ref(false)
const isDatepickerSaveDisabled: Ref<boolean> = ref(true)

const rules = {
  day: [
    (value: string) => !!value || 'Please enter day reading',
    (value: string) => /^[0-9]*$/.test(value) || 'Please enter a valid number',
    (value: string) => value.length <= 8 || 'Max 8 numbers',
  ],
  night: [
    (value: string) => !!value || 'Please enter night reading',
    (value: string) => /^[0-9]*$/.test(value) || 'Please enter a valid number',
    (value: string) => value.length <= 8 || 'Max 8 numbers',
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

const dateLabel: ComputedRef<string> = computed(() =>
  dayjs(form.date).format('DD MMMM YYYY'),
)

const datepickerConfirmEditDisabled: ComputedRef<
  boolean | ('save' | 'cancel')[]
> = computed(() => {
  if (isDatepickerSaveDisabled.value) return ['save']
  return []
})

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

    const formPayload: Reading = {
      ...form,
      date: dayjs(form.date).format('YYYY-MM-DD'),
    }

    if (basedOnMode.value[actionSheetMode.value].action === 'add') {
      await readingsStore.postReading(formPayload)
    }

    if (basedOnMode.value[actionSheetMode.value].action === 'edit') {
      await readingsStore.patchReading(id.value, formPayload)
    }

    onActionSheetAddReadingClose()
    await readingsStore.fetchReadings()
  } finally {
    isButtonSubmitDisabled.value = false
    isButtonSubmitLoading.value = false
  }
}

const onDatepickerClose = () => {
  isDatepickerOpen.value = false
  isDatepickerSaveDisabled.value = true
}

const onUpdateFormDate = () => {
  isDatepickerSaveDisabled.value = false
}

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
  <v-fab
    color="success"
    location="bottom end"
    extended
    app
    prepend-icon="mdi-flash"
    text="Add reading"
    position="relative"
    @click="onActionSheetAddReadingOpen"
  />
  <v-bottom-sheet v-model="isActionSheetReadingOpen">
    <v-card>
      <v-form validate-on="invalid-input">
        <v-text-field
          v-model="form.day"
          name="day"
          :label="uiStore.getDayNightLabels.day"
          type="number"
          placeholder="Enter day reading"
          suffix="kWh"
          hide-details="auto"
          class="mb-4"
          :rules="rules.day"
        />
        <v-text-field
          v-model="form.night"
          name="night"
          :label="uiStore.getDayNightLabels.night"
          type="number"
          placeholder="Enter night reading"
          suffix="kWh"
          hide-details="auto"
          class="mb-4"
          :rules="rules.night"
        />

        <v-menu v-model="isDatepickerOpen" :close-on-content-click="false">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              block
              color="primary"
              variant="outlined"
              prepend-icon="mdi-calendar-month-outline"
              class="mb-4"
            >
              {{ dateLabel }}
            </v-btn>
          </template>
          <v-confirm-edit
            v-model="form.date"
            ok-text="Confirm"
            cancel-text="Cancel"
            color="primary"
            :disabled="datepickerConfirmEditDisabled"
            @cancel="onDatepickerClose"
            @save="onDatepickerClose"
          >
            <template v-slot:default="{ model: proxyModel, actions }">
              <v-date-picker
                v-model="proxyModel.value"
                hide-header
                @update:model-value="onUpdateFormDate"
              >
                <template v-slot:actions>
                  <component :is="actions" />
                </template>
              </v-date-picker>
            </template>
          </v-confirm-edit>
        </v-menu>
      </v-form>
      <v-card-actions>
        <v-btn @click="onActionSheetAddReadingClose">Cancel</v-btn>
        <v-btn
          variant="elevated"
          color="primary"
          :disabled="isButtonSubmitDisabled"
          :loading="isButtonSubmitLoading"
          @click="onSubmit"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-bottom-sheet>
</template>
