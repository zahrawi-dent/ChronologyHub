import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    solid(),
    tailwindcss(),
  ],
  base: process.env.VITE_BASE_PATH || "/chronohub/",
  build: {
    minify: 'terser',
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
