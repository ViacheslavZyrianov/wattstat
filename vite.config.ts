import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import pkg from './package.json' with { type: 'json' }
import vuetify from 'vite-plugin-vuetify'

const version = pkg.version

// ⬇️ Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ⬇️ Load icons.json from public folder
const iconsPath = path.resolve(__dirname, 'public/icons/icons.json')
const icons = JSON.parse(fs.readFileSync(iconsPath, 'utf-8')).icons

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(version),
  },
  build: {
    outDir: 'dist', // Custom build output directory
    emptyOutDir: true, // Empty the output directory before building
  },
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
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#6DACFF',
        theme_color: '#6DACFF',
        icons,
      },
      devOptions: {
        enabled: process.env.NODE_ENV === 'development',
      },
    }),
    vuetify(),
  ],
})
