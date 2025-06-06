import { defineStore } from 'pinia'
import axios from '@/axios'
import { ReadingCreate, ReadingState } from '@/store/readings/types'

export const useReadingsStore = defineStore('readings', {
  state: (): ReadingState => ({
    readings: {},
  }),
  actions: {
    async fetchReadings(): Promise<void> {
      try {
        const res = await axios.get('readings')

        this.readings = res.data
      } catch (error) {
        console.error('Error during fetching readings:', error)
      }
    },
    async postReading(reading: ReadingCreate): Promise<void> {
      try {
        await axios.post('readings', reading)
      } catch (error) {
        console.error('Error during posting reading:', error)
      }
    },
    async patchReading(
      id: number | null,
      reading: Partial<ReadingCreate>,
    ): Promise<void> {
      try {
        await axios.patch(`readings/${id}`, reading)
      } catch (error) {
        console.error('Error during patching reading:', error)
      }
    },
    async deleteReading(id: number | null): Promise<void> {
      try {
        await axios.delete(`readings/${id}`)
      } catch (error) {
        console.error('Error during deleting reading:', error)
      }
    },
  },
})
