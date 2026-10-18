/**
 * Typing for the `.mdx` modules Vite compiles with `@mdx-js/rollup`.
 *
 * Hand-rolled rather than `@types/mdx`: that package re-exports from the `mdx`
 * types package, which this project does not depend on, and `tsconfig.app.json`
 * pins `types: ["vite/client"]`, so an `@types` package would not be picked up
 * automatically anyway. MDX files here are bodies only — title and date live in
 * `src/data/portfolio.ts` — so the default export is all the app needs.
 */
declare module '*.mdx' {
  import type { ComponentType } from 'react'

  const MDXContent: ComponentType<{
    /** Component overrides, unused today but part of the MDX contract. */
    components?: Record<string, unknown>
  }>

  export default MDXContent
}
