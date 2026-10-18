/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { compiledStylesheet, ruleBody } from './test/compiled-css'

// The stylesheet as authored (Vitest does not process `?raw` CSS imports while
// `css` is disabled, so read it from disk).
const source = readFileSync(resolve(process.cwd(), 'src/index.css'), 'utf8')

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
function blockBody(stylesheet: string, needle: string): string {
  const prelude = stylesheet.indexOf(needle)
  if (prelude === -1) return ''

  const open = stylesheet.indexOf('{', prelude)
  if (open === -1) return ''

  let depth = 0
  for (let index = open; index < stylesheet.length; index += 1) {
    if (stylesheet[index] === '{') depth += 1
    else if (stylesheet[index] === '}') {
      depth -= 1
      if (depth === 0) return stylesheet.slice(open + 1, index)
    }
  }

  return stylesheet.slice(open + 1)
}

describe('design tokens', () => {
  const root = blockBody(source, ':root')

  it('declares the tokens inside :root', () => {
    expect(root).not.toBe('')
  })

  it.each(Object.entries(TOKENS))('declares %s as %s', (token, value) => {
    const pattern = new RegExp(`${token}\\s*:\\s*${value.replace(/[.()]/g, '\\$&')}\\s*;`)

    expect(root).toMatch(pattern)
  })

  it('imports Tailwind v4', () => {
    expect(source).toMatch(/@import\s+["']tailwindcss["']/)
  })
})

/**
 * These run against the stylesheet Vite + Tailwind actually emit. Source-text
 * assertions cannot see the two ways this CSS can go dead on the way out:
 * a Tailwind core utility of the same name shadowing a components-layer class,
 * and Lightning CSS rewriting declarations.
 */
describe('compiled stylesheet', () => {
  it('caps the page shell at 72rem, with no competing rule for the class', async () => {
    const css = await compiledStylesheet()

    expect(ruleBody(css, '.shell')).toMatch(/max-width:\s*72rem/)

    // Exactly one rule may target `.shell`: a second one (e.g. a Tailwind core
    // utility of the same name) would win the cascade and kill the cap.
    expect(css.match(/\.shell[^{]*\{/g)).toHaveLength(1)
  })

  it('keeps the reduced-motion overrides in the shipped CSS', async () => {
    const css = await compiledStylesheet()
    const block = blockBody(css, 'prefers-reduced-motion')

    expect(block).not.toBe('')
    expect(block).toMatch(/\.marquee[^{]*\{[^}]*animation:\s*none/)
    expect(block).toMatch(/\.reveal[^{]*\{[^}]*transition:\s*none/)
    expect(block).toMatch(/\.reveal[^{]*\{[^}]*transform:\s*none/)
    expect(block).toMatch(/\.tilt[^{]*\{[^}]*transform:\s*none/)
    expect(block).toMatch(/animation-duration:\s*0?\.?\d*m?s/)
    expect(block).toMatch(/scroll-behavior:\s*auto/)
  })
})

describe('reduced motion', () => {
  it('ships a prefers-reduced-motion block', () => {
    expect(source).toContain('prefers-reduced-motion: reduce')
  })

  it('disables marquee, reveal and tilt animation inside that block', () => {
    const block = blockBody(source, '@media (prefers-reduced-motion: reduce)')

    expect(block).not.toBe('')
    expect(block).toMatch(/\.marquee[^{]*\{[^}]*animation:\s*none/)
    expect(block).toMatch(/\.reveal[^{]*\{[^}]*transition:\s*none/)
    expect(block).toMatch(/\.reveal[^{]*\{[^}]*transform:\s*none/)
    expect(block).toMatch(/animation-duration:\s*0?\.?\d*m?s/)
    expect(block).toMatch(/scroll-behavior:\s*auto/)
  })
})
