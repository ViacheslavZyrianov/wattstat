import { createApp } from 'vue'
import router from './router/index'
import './eventBus'
import './global'
import App from './App/Index.vue'
import { registerSW } from 'virtual:pwa-register'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/vant.css'
import './assets/style.css'
import { useAuthStore } from '@/store/auth'

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

// Initialize auth status before mounting the app
const initApp = async () => {
  const authStore = useAuthStore()
  await authStore.checkAuthStatus()
  app.mount('#app')
}

await initApp()
