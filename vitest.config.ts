import mdx from '@mdx-js/rollup'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  // Same plugin order as `vite.config.ts`: the tests import the MDX bodies too,
  // so the compiler has to be wired here as well.
  plugins: [{ enforce: 'pre', ...mdx() }, react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
