import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { nav, profile } from '../data/portfolio'
import Footer from './Footer'

function renderFooter() {
  return render(
    <MemoryRouter>
      <Footer />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  // Freeze only the clock (not timers, which React's scheduler needs) so the
  // © year is deterministic.
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-06-01T12:00:00Z'))
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
})

describe('Footer', () => {
  it('renders the copyright line with the owner name and the current year', () => {
    renderFooter()

    expect(screen.getByRole('contentinfo')).toHaveTextContent(
      `© 2026 ${profile.name}`,
    )
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
