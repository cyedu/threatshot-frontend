import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      // Forward all /api and /health requests to the EC2 backend
      // Change target here when switching to Cloudflare (api.threatshot.com)
      '/api': {
        target: 'http://13.235.14.239:8000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://13.235.14.239:8000',
        changeOrigin: true,
      },
    },
  },
})
