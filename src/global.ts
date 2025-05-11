import { NotifyType, showNotify } from 'vant'
import eventBus from '@/eventBus'

eventBus.on('notify', (message: string, type: NotifyType) => {
  showNotify({
    type,
    message,
  })
})
