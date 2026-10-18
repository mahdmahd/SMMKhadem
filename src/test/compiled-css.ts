/// <reference types="node" />
import tailwindcss from '@tailwindcss/vite'
import { build } from 'vite'

let cached: Promise<string> | null = null

/**
 * Compiles `src/index.css` through the real Vite + Tailwind v4 pipeline and
 * returns the emitted stylesheet.
 *
 * Assertions about the *shipped* CSS must run against this, not against the
 * source text: Tailwind's utilities layer can silently shadow a same-named
 * class from the components layer, and Lightning CSS rewrites declarations
 * (e.g. vendor prefixing) on the way out. Both failure modes are invisible in
 * the source file.
 */
export function compiledStylesheet(): Promise<string> {
  cached ??= compile()
  return cached
}

async function compile(): Promise<string> {
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [tailwindcss()],
    build: {
      write: false,
      rollupOptions: { input: `${process.cwd()}/src/index.css` },
    },
  })

  const outputs = Array.isArray(result) ? result : [result]

  for (const output of outputs) {
    if (!('output' in output)) continue

    for (const item of output.output) {
      if (item.type !== 'asset' || !item.fileName.endsWith('.css')) continue

      return typeof item.source === 'string' ? item.source : item.source.toString()
    }
  }

  throw new Error('Vite emitted no CSS asset for src/index.css')
}

/** Returns the declaration body of the first rule whose selector contains `selector`. */
export function ruleBody(stylesheet: string, selector: string): string {
  const index = stylesheet.indexOf(selector)
  if (index === -1) return ''

  const open = stylesheet.indexOf('{', index)
  if (open === -1) return ''

  let depth = 0
  for (let cursor = open; cursor < stylesheet.length; cursor += 1) {
    if (stylesheet[cursor] === '{') depth += 1
    else if (stylesheet[cursor] === '}') {
      depth -= 1
      if (depth === 0) return stylesheet.slice(open + 1, cursor)
    }
  }

  return stylesheet.slice(open + 1)
}

/** Splits a declaration body into individual `property: value` strings. */
export function declarations(body: string): string[] {
  return body
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
}
