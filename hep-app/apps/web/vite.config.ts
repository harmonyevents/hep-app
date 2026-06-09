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
        description: "India's first B2B/C2B event management platform",
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
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'vendor-motion'
          if (id.includes('@radix-ui')) return 'vendor-radix'
          if (id.includes('@tanstack')) return 'vendor-query'
          if (id.includes('i18next')) return 'vendor-i18n'
          if (id.includes('react-router') || id.includes('react-dom') || (id.includes('/react/') && !id.includes('react-i18next'))) return 'vendor-react'
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
