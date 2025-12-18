import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  preview: {
    port: 3004,
    // Enable SPA fallback for preview
    strictPort: false,
  },
  server: {
    port: 5173,
    // Enable SPA fallback for dev server
    historyApiFallback: true,
  },
  publicDir: 'public',
})
