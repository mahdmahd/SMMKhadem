import '@testing-library/jest-dom/vitest'

/**
 * jsdom ships no canvas backend, so every `getContext('2d')` reports "Not
 * implemented" to the virtual console — and the hero portrait and the
 * connectome both ask for one on mount. Returning `null` is what a browser
 * without a 2D context does, and both components already guard for it.
 *
 * Tests that need a context install one with `stubCanvasContext` (see
 * `src/test/stubs.ts`), which spies on this same method.
 */
HTMLCanvasElement.prototype.getContext = (() => null) as HTMLCanvasElement['getContext']
