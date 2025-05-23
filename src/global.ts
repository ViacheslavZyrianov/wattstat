import { NotifyOptions, showNotify } from 'vant'
import eventBus from '@/eventBus'

eventBus.on('notify', (options) => {
  showNotify(options as NotifyOptions)
})
