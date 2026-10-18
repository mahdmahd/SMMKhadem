import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import { nav, profile } from '../data/portfolio'
import Footer from './Footer'

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )
}

afterEach(cleanup)

describe('Footer', () => {
  it('renders the copyright line with the owner name and year', () => {
    renderFooter()

    // The brief pins 2026 (the current year); deriving it keeps the test from rotting.
    const year = new Date().getFullYear()
    expect(year).toBe(2026)

    const footer = screen.getByRole('contentinfo')
    expect(footer).toHaveTextContent(new RegExp(`©\\s*${year}\\s+${profile.name}`))
  })

  it('renders the section nav links', () => {
    renderFooter()

    const footer = screen.getByRole('contentinfo')
    const navigation = within(footer).getByRole('navigation', { name: /footer/i })

    for (const item of nav) {
      expect(within(navigation).getByRole('link', { name: item.label })).toHaveAttribute(
        'href',
        item.href,
      )
    }
    expect(within(navigation).getAllByRole('link')).toHaveLength(nav.length)
  })
})
