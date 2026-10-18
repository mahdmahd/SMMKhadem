/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

// Read the stylesheet from disk: these assertions are about the shipped CSS
// source (Vitest does not process `?raw` CSS imports when `css` is disabled).
const css = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')

const TOKENS: Record<string, string> = {
  '--bg': '#050505',
  '--panel': '#0b0b0b',
  '--border': 'rgba(255,255,255,.12)',
  '--text': '#f5f5f4',
  '--text-dim': '#a3a3a2',
  '--accent': '#e8e4dc',
  '--accent-hover': '#d6d1c6',
  '--on-accent': '#050505',
}

/** Returns the body of the first block whose prelude contains `needle`. */
function blockBody(source: string, needle: string): string {
  const prelude = source.indexOf(needle)
  if (prelude === -1) return ''

  const open = source.indexOf('{', prelude)
  if (open === -1) return ''

  let depth = 0
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === '{') depth += 1
    else if (source[index] === '}') {
      depth -= 1
      if (depth === 0) return source.slice(open + 1, index)
    }
  }

  return source.slice(open + 1)
}

describe('design tokens', () => {
  it.each(Object.entries(TOKENS))('declares %s as %s', (token, value) => {
    const pattern = new RegExp(`${token}\\s*:\\s*${value.replace(/[.()]/g, '\\$&')}\\s*;`)

    expect(css).toMatch(pattern)
  })

  it('imports Tailwind v4', () => {
    expect(css).toMatch(/@import\s+["']tailwindcss["']/)
  })

  it('caps the container at 72rem and uses pill buttons', () => {
    expect(blockBody(css, '.container')).toMatch(/max-width:\s*72rem/)
    expect(blockBody(css, '.pill')).toMatch(/border-radius:\s*9999px/)
  })
})

describe('reduced motion', () => {
  it('ships a prefers-reduced-motion block', () => {
    expect(css).toContain('prefers-reduced-motion: reduce')
  })

  it('disables marquee, reveal and tilt animation inside that block', () => {
    const block = blockBody(css, '@media (prefers-reduced-motion: reduce)')

    expect(block).not.toBe('')
    expect(block).toMatch(/\.marquee[^{]*\{[^}]*animation:\s*none/)
    expect(block).toMatch(/\.reveal[^{]*\{[^}]*transition:\s*none/)
    expect(block).toMatch(/\.reveal[^{]*\{[^}]*transform:\s*none/)
    expect(block).toMatch(/animation-duration:\s*0?\.?\d*m?s/)
    expect(block).toMatch(/scroll-behavior:\s*auto/)
  })
})
