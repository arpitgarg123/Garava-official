import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../server/public',
    emptyOutDir: true,
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined
      }
    },
    // Force using the JS version of Rollup instead of native
    target: 'esnext',
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: ['rollup']
  },
  esbuild: {
    target: 'esnext'
  }
})
