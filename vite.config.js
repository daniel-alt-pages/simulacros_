import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    charset: 'utf8',
    // Optimizaciones para producción
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'charts': ['recharts'],
          'ui': ['framer-motion', 'lucide-react']
        }
      }
    },
    // Aumentar límite de advertencia de chunk size
    chunkSizeWarningLimit: 1000
  },
  // Configuración para deployment
  base: './',
  // Optimizar assets
  assetsInclude: ['**/*.csv'],
  server: {
    port: 5173,
    open: true
  },
  preview: {
    port: 4173,
    open: true
  }
})
