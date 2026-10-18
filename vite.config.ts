import mdx from '@mdx-js/rollup'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // MDX runs first (`enforce: 'pre'`) so the compiled component reaches the
    // React plugin as ordinary JSX, the order @mdx-js/rollup documents.
    { enforce: 'pre', ...mdx() },
    react(),
    tailwindcss(),
  ],
})
