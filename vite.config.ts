import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: { chunkSizeWarningLimit: 4000, },
  plugins: [react()],
  base: '/Anime3x3/',
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
})