import { createApp } from 'vue'
import router from './router/index'
import './eventBus'
import './global'
import './types.d'
import App from './App/Index.vue'
import { registerSW } from 'virtual:pwa-register'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './assets/vant.css'
import './assets/style.css'
// import { useGoogleAuthStore } from '@/store/auth/google'

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

// const googleAuthStore = useGoogleAuthStore()
//
// googleAuthStore.auth().then(() => {
//   app.mount('#app')
// })

app.mount('#app')
