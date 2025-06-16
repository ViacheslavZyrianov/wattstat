// axios.js
import axios from 'axios'
import { useGoogleAuthStore } from '@/store/auth/google'
import eventBus from '@/eventBus'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_AXIOS_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const googleAuth = localStorage.getItem('googleAuth')
    const tokenParsed = googleAuth ? JSON.parse(googleAuth).token : null
    if (tokenParsed) {
      config.headers.Authorization = `Bearer ${tokenParsed}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiUrl = error.config?.url || 'Unknown URL'
    const noErrorApiUrls = ['/auth/status']

    if (error.status === 403) {
      const googleAuthStore = useGoogleAuthStore()
      googleAuthStore.logout()
    } else if (!noErrorApiUrls.includes(apiUrl)) {
      eventBus.emit('showErrorSnackbar', {
        text: `ERROR: ${error.message}\nURL: ${apiUrl}`,
      })
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
