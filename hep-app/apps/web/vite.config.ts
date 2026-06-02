import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo_cropped.jpg', 'robots.txt'],
      manifest: {
        name: 'HE&P — Harmony Events & Platform',
        short_name: 'HE&P',
        description: "India's end-to-end event management platform",
        theme_color: '#051C2C',
        background_color: '#051C2C',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/logo_cropped.jpg', sizes: '192x192', type: 'image/jpeg' },
          { src: '/logo_cropped.jpg', sizes: '512x512', type: 'image/jpeg' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache' },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': '/src' },
  },
})
