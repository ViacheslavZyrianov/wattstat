import { createApp } from 'vue'
import './eventBus'
import './global'
import App from './App/Index.vue'
import router from './router'
import { registerSW } from 'virtual:pwa-register'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/style.css'

registerSW({
  onNeedRefresh() {
    console.log('New content available, refresh to update.')
  },
  onOfflineReady() {
    console.log('App ready to work offline.')
  },
})

const pinia = createPinia()
const app = createApp(App)

app.use(router)
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

app.mount('#app')
