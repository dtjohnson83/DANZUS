import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/context/',
  build: { outDir: '../public/context', emptyOutDir: true }
})
