import { cleanup, render, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import { about, profile, timeline, toolkit } from '../data/portfolio'
import Home from '../routes/Home'
import About from './About'
import Hero from './Hero'
import Toolkit from './Toolkit'

afterEach(cleanup)

/** The section a component owns, by anchor id. */
function section(id: string): HTMLElement {
  const element = document.getElementById(id)

  if (!element) throw new Error(`no section #${id} in the document`)

  return element
}

describe('Hero', () => {
  it('splits the name across display lines', () => {
    render(<Hero />)

    const hero = section('top')
    const lines = Array.from(hero.querySelectorAll('.hero__line')).map((line) => line.textContent)

    expect(hero.querySelector('.display')).not.toBeNull()
    expect(lines.length).toBeGreaterThan(1)
    // Rejoining the split lines must give the name back verbatim.
    expect(lines.join(' ')).toBe(profile.name)
  })

  it('states the title and the one-line arc', () => {
    render(<Hero />)

    const hero = section('top')

    expect(hero.textContent).toContain('M.D. · AI RESEARCHER')
    expect(hero.textContent).toContain(profile.tagline)
  })

  it('renders no raster portrait — the hero art is generated', () => {
    render(<Hero />)

    const hero = section('top')

    // avatar.jpg is 266px wide: unusable at hero scale (owner decision).
    expect(hero.querySelectorAll('img')).toHaveLength(0)
    expect(hero.innerHTML).not.toMatch(/avatar/i)
    expect(hero.querySelector('.hero__art')).not.toBeNull()
  })

  it('offers a scroll cue and a contact pill', () => {
    render(<Hero />)

    const hero = section('top')
    const contact = within(hero).getByRole('link', { name: /get in touch/i })

    expect(contact).toHaveAttribute('href', '/#contact')
    expect(within(hero).getByRole('link', { name: /scroll/i })).toBeInTheDocument()
  })
})

describe('About', () => {
  it('renders the eyebrow and the display word', () => {
    render(<About />)

    const aboutSection = section('about')

    expect(aboutSection.textContent).toMatch(/about me/i)
    expect(aboutSection.textContent).toMatch(/intro/i)
  })

  it('condenses the bio to roughly 150 words', () => {
    const words = about.join(' ').replace(/\*\*/g, '').trim().split(/\s+/)

    expect(words.length).toBeGreaterThanOrEqual(120)
    expect(words.length).toBeLessThanOrEqual(200)
  })

  it('highlights the eight load-bearing phrases in the bio', () => {
    render(<About />)

    const marks = Array.from(section('about').querySelectorAll('mark')).map(
      (mark) => mark.textContent ?? '',
    )

    expect(marks).toHaveLength(8)

    for (const phrase of [
      'frontotemporal dementia',
      'routine clinical MRI',
      'bariatric surgery',
      'explainable AI',
      'RAG',
      'Persian medical documents',
    ]) {
      expect(marks).toContain(phrase)
    }
  })

  it('renders the four-step timeline', () => {
    render(<About />)

    const aboutSection = section('about')
    const entries = Array.from(aboutSection.querySelectorAll('.timeline__entry'))
    const entryText = entries.map((entry) => entry.textContent ?? '')
    const text = aboutSection.textContent ?? ''

    expect(entries).toHaveLength(4)
    expect(timeline).toHaveLength(4)

    for (const entry of timeline) {
      expect(entryText.some((candidate) => candidate.includes(entry.organisation))).toBe(true)
    }

    for (const organisation of [
      'Iran University of Medical Sciences',
      'Foolad Clinic',
      'Minimally Invasive Research Center',
      'Saman Insurance',
    ]) {
      expect(text).toContain(organisation)
    }

    expect(text).toContain('2015')
    expect(text).toContain('2022')
    expect(text).toContain('2025')
  })
})

describe('Toolkit', () => {
  it('renders one marquee row per toolkit family', () => {
    const { container } = render(<Toolkit />)

    expect(toolkit).toHaveLength(4)
    expect(container.querySelectorAll('.marquee')).toHaveLength(toolkit.length)
  })

  it('duplicates the track and hides every copy but the first', () => {
    const { container } = render(<Toolkit />)

    const rows = Array.from(container.querySelectorAll('.marquee'))
    const firstRow = rows[0]
    const groups = Array.from(firstRow.querySelectorAll('.marquee__group'))

    // One visible list, the rest are the seamless-loop padding.
    expect(groups.length).toBeGreaterThan(1)
    expect(groups[0]).not.toHaveAttribute('aria-hidden')

    for (const duplicate of groups.slice(1)) {
      expect(duplicate).toHaveAttribute('aria-hidden', 'true')
      expect(duplicate.textContent).toBe(groups[0].textContent)
    }

    expect(groups[0].textContent).toBe(toolkit[0].join(''))
  })

  it('shifts the loop by exactly one copy of the track', () => {
    const { container } = render(<Toolkit />)

    const row = container.querySelector('.marquee')
    const track = row?.querySelector<HTMLElement>('.marquee__track')
    const copies = row?.querySelectorAll('.marquee__group').length ?? 0

    expect(track).not.toBeNull()
    expect(copies).toBeGreaterThan(1)
    // The keyframes translate by this variable: 100 / copies.
    expect(track?.style.getPropertyValue('--marquee-shift')).toBe(`-${100 / copies}%`)
  })

  it('alternates the scroll direction between rows', () => {
    const { container } = render(<Toolkit />)

    const directions = Array.from(container.querySelectorAll<HTMLElement>('.marquee__track')).map(
      (track) => track.style.getPropertyValue('--marquee-direction'),
    )

    expect(directions).toEqual(['normal', 'reverse', 'normal', 'reverse'])
  })

  it('renders every chip from the toolkit data', () => {
    const { container } = render(<Toolkit />)

    const chips = Array.from(container.querySelectorAll('.marquee__chip')).map(
      (chip) => chip.textContent,
    )

    for (const item of toolkit.flat()) {
      expect(chips).toContain(item)
    }
  })
})

describe('Home composition', () => {
  it('orders the new sections before the research stub', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const ids = Array.from(document.querySelectorAll('section[id]')).map((element) => element.id)

    expect(ids.slice(0, 4)).toEqual(['top', 'about', 'toolkit', 'research'])
    expect(ids).toContain('contact')
  })
})
