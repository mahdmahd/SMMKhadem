import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import { nav, profile } from '../data/portfolio'
import { compiledStylesheet, declarations, ruleBody } from '../test/compiled-css'
import Header from './Header'

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  )
}

function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value,
  })
}

afterEach(() => {
  cleanup()
  setScrollY(0)
})

describe('Header', () => {
  it('renders the name mark as a link home', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: profile.name })).toHaveAttribute('href', '/')
  })

  it('renders the five section nav links from the nav data', () => {
    renderHeader()

    expect(nav.map((item) => item.label)).toEqual([
      'Research',
      'Projects',
      'Publications',
      'Blog',
      'Contact',
    ])

    const navigation = screen.getByRole('navigation', { name: /sections/i })
    const links = within(navigation).getAllByRole('link')

    expect(links).toHaveLength(5)
    for (const item of nav) {
      expect(within(navigation).getByRole('link', { name: item.label })).toHaveAttribute(
        'href',
        item.href,
      )
    }
  })

  it('links the CV download button to /cv.pdf', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: /cv/i })).toHaveAttribute('href', '/cv.pdf')
  })

  it('adds the blurred background class only once scrolled past the threshold', () => {
    renderHeader()

    const header = screen.getByRole('banner')
    expect(header).not.toHaveClass('is-scrolled')

    setScrollY(9)
    fireEvent.scroll(window)
    expect(header).toHaveClass('is-scrolled')

    setScrollY(0)
    fireEvent.scroll(window)
    expect(header).not.toHaveClass('is-scrolled')
  })

  it('collapses the nav behind a disclosure button on small screens', () => {
    renderHeader()

    const toggle = screen.getByRole('button', { name: /menu/i })
    const navigation = screen.getByRole('navigation', { name: /sections/i })

    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', navigation.id)
    expect(navigation).not.toHaveClass('is-open')

    fireEvent.click(toggle)

    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(navigation).toHaveClass('is-open')
  })
})

/**
 * The blur lives in the stylesheet, so assert it against the CSS Vite + Tailwind
 * actually emit — Lightning CSS rewrites this declaration on the way out, and
 * hand-writing the -webkit- prefix alongside the standard one makes it drop the
 * standard property (which Chromium/Firefox then ignore).
 */
describe('Header scrolled background, in the shipped CSS', () => {
  it('applies a standard backdrop-filter once scrolled', async () => {
    const css = await compiledStylesheet()
    const properties = declarations(ruleBody(css, '.site-header.is-scrolled')).map(
      (declaration) => declaration.split(':')[0],
    )

    expect(properties).toContain('backdrop-filter')
  })
})
