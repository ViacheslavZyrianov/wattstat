import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from '@vant/auto-import-resolver'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

// ⬇️ Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ⬇️ Load icons.json from public folder
const iconsPath = path.resolve(__dirname, 'public/icons/icons.json')
const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf-8')).icons

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'WattStat',
        short_name: 'WattStat',
        start_url: '/',
        display: 'browser',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#42b883',
        icons,
      },
    }),
    AutoImport({
      resolvers: [VantResolver()],
    }),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
})
