/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { compiledStylesheet, declarations, ruleBody } from './test/compiled-css'

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
    expect(block).toMatch(/\.availability__dot[^{]*\{[^}]*animation:\s*none/)
    expect(block).toMatch(/animation-duration:\s*0?\.?\d*m?s/)
    expect(block).toMatch(/scroll-behavior:\s*auto/)
  })

  it('keeps a visible focus ring in the shipped CSS', async () => {
    const css = await compiledStylesheet()
    const ring = ruleBody(css, ':focus-visible')

    expect(ring).not.toBe('')
    expect(ring).toMatch(/outline:\s*2px solid/)
    expect(ring).toMatch(/outline-offset:\s*3px/)
  })

  /**
   * `.sr-only` carries the project name inside each "Read more" pill, which is
   * what stops four links from sharing one name. It comes from Tailwind, not
   * from this file, so the only way to know it survives the build is to look at
   * what the build emitted.
   */
  it('emits the screen-reader-only utility the Read more links depend on', async () => {
    const css = await compiledStylesheet()
    const utility = ruleBody(css, '.sr-only')

    expect(utility).not.toBe('')
    expect(utility).toMatch(/position:\s*absolute/)
    expect(utility).toMatch(/clip-path:\s*inset\(50%\)/)
  })
})

describe('marquee (Task 4)', () => {
  it('ships a keyframes loop that translates by one copy of the track', async () => {
    const css = await compiledStylesheet()

    expect(css).toContain('@keyframes marquee-scroll')

    const keyframes = ruleBody(css, '@keyframes marquee-scroll')

    expect(keyframes).toMatch(/transform:\s*translate/)
    // The distance is the component's `--marquee-shift` (100 / copies), so the
    // keyframes and the number of rendered copies can never drift apart.
    expect(keyframes).toMatch(/var\(--marquee-shift/)
  })

  it('drives the track from one rule, overridden only by reduced motion', async () => {
    const css = await compiledStylesheet()
    const trackRules = css.match(/\.marquee__track[^{]*\{/g) ?? []

    // One base rule + the reduced-motion override. A third would mean a
    // Tailwind core utility of the same name is shadowing the components layer.
    expect(trackRules).toHaveLength(2)

    const track = ruleBody(css, '.marquee__track')

    // Lightning CSS reorders the animation shorthand, so assert on the parts,
    // not on their order: the keyframes name, an endless loop, and a duration
    // that comes from the per-row custom property.
    expect(track).toMatch(/animation:[^;}]*marquee-scroll/)
    expect(track).toMatch(/animation:[^;}]*infinite/)
    expect(track).toMatch(/animation-duration:\s*var\(--marquee-duration/)
    expect(track).toMatch(/animation-direction:\s*var\(--marquee-direction/)

    const reducedMotion = blockBody(css, 'prefers-reduced-motion')

    expect(reducedMotion).toMatch(/\.marquee__track[^{]*\{[^}]*animation:\s*none/)
  })

  it('fades the marquee edges with a mask', async () => {
    const css = await compiledStylesheet()

    expect(css).toMatch(/\.marquee[^{]*\{[^}]*mask-image:\s*linear-gradient\(90deg/)
  })
})

describe('prose (Task 7)', () => {
  it('spaces blocks from one sibling rule, not from per-element margins', async () => {
    const css = await compiledStylesheet()

    expect(ruleBody(css, '.prose>*+*')).toMatch(/margin-top:\s*1\.2em/)

    // `.prose p { margin: 0 }` is the trap: at 0,1,1 it outranks the sibling
    // rule at 0,1,0, and every paragraph in a post runs into the next one.
    expect(source).not.toMatch(/\.prose\s+p\s*\{/)
    expect(css).not.toMatch(/\.prose p\{/)
  })

  it('paints the body, links and code from the tokens', async () => {
    const css = await compiledStylesheet()

    expect(ruleBody(css, '.prose{')).toMatch(/color:\s*var\(--text\)/)
    expect(ruleBody(css, '.prose a')).toMatch(/color:\s*var\(--accent\)/)
    expect(ruleBody(css, '.prose pre')).toMatch(/background:\s*var\(--panel\)/)
  })
})

describe('opening sequence (Task 9a)', () => {
  /**
   * GSAP resolves an element's computed transform when it starts a tween, so a
   * CSS `translateY` on the masked word is read back as a *pixel* offset and
   * becomes a base `y` that the timeline's `yPercent` stacks on top of — the
   * word then finishes 110px below its mask and never appears. The timeline
   * applies every start value in a layout effect instead, so this rule has to
   * stay free of transforms.
   */
  it('keeps the masked word free of any transform', async () => {
    const css = await compiledStylesheet()
    const word = ruleBody(css, '.intro__word')

    expect(word).not.toBe('')
    expect(declarations(word).filter((declaration) => declaration.startsWith('transform:'))).toEqual(
      [],
    )
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

  it('holds the availability light steady instead of blinking it', () => {
    const block = blockBody(source, '@media (prefers-reduced-motion: reduce)')

    // The dot must stay lit: killing the animation mid-keyframe would leave a
    // half-faded status light, so the rule resets it to full opacity too.
    expect(block).toMatch(/\.availability__dot[^{]*\{[^}]*animation:\s*none/)
    expect(block).toMatch(/\.availability__dot[^{]*\{[^}]*opacity:\s*1/)
  })
})
