import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: { chunkSizeWarningLimit: 4000, },
  plugins: [react()],
  optimizeDeps: {
    exclude: ['js-big-decimal']
  },
})