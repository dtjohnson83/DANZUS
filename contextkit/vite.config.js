import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/contextkit/',
  build: { outDir: '../public/contextkit', emptyOutDir: true }
})
