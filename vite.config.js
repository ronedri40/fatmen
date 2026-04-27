import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The preview server runs in production on Railway. Allow any host so the
  // *.up.railway.app domain (and any future custom domain) isn't rejected by
  // Vite's host check.
  preview: {
    host: true,
    allowedHosts: true,
  },
  server: {
    host: true,
  },
})
