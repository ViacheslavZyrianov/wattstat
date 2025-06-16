import { createApp } from 'vue'
import router from './router/index'
import './eventBus'
import './types.d'
import App from './App/Index.vue'
import { registerSW } from 'virtual:pwa-register'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/style.css'
import { useGoogleAuthStore } from '@/store/auth/google'
import vuetify from './plugins/vuetify'

registerSW({
  onNeedRefresh() {
    console.log('New content available, refresh to update.')
  },
  onOfflineReady() {
    console.log('App ready to work offline.')
  },
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(vuetify)

const googleAuthStore = useGoogleAuthStore()

googleAuthStore.isFallbackRenderButtonUsed = false
app.mount('#app')
