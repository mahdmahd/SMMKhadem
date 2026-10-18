import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'

import App from './App'

const HOME_SECTIONS = ['research', 'projects', 'publications', 'blog', 'contact']

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

// ScrollToTop calls `window.scrollTo` on mount; jsdom does not implement it.
let scrollTo: MockInstance

beforeEach(() => {
  scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('App routing', () => {
  it('renders the home shell with the five section anchors', () => {
    renderAt('/')

    for (const id of HOME_SECTIONS) {
      expect(document.getElementById(id)).toBeInTheDocument()
    }
  })

  it('renders the about stub at /about and at the legacy /about/ path', () => {
    renderAt('/about')
    expect(document.getElementById('about')).toBeInTheDocument()

    cleanup()
    renderAt('/about/')
    expect(document.getElementById('about')).toBeInTheDocument()
  })

  it('renders the contact stub at /contact', () => {
    renderAt('/contact')

    expect(document.getElementById('contact')).toBeInTheDocument()
  })

  it('renders the posts index at /posts and at the legacy /posts/ path', () => {
    renderAt('/posts')
    expect(document.getElementById('posts')).toBeInTheDocument()

    cleanup()
    renderAt('/posts/')
    expect(document.getElementById('posts')).toBeInTheDocument()
  })

  it('renders the post stub for legacy /posts/:slug paths', () => {
    renderAt('/posts/mem1')

    expect(screen.getByText(/mem1/)).toBeInTheDocument()
  })

  it('renders the PERSiMED case study for legacy /projects/:slug paths', () => {
    renderAt('/projects/project-6')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/PERSiMED/)
  })

  it('renders NotFound with a link home for unknown paths', () => {
    renderAt('/no/such/page')

    expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
  })

  it('renders the header and footer chrome on every route', () => {
    renderAt('/no/such/page')

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})

describe('scroll restoration', () => {
  let scrollTargets: Element[]

  beforeEach(() => {
    scrollTargets = []

    // jsdom has no Element.scrollIntoView.
    Element.prototype.scrollIntoView = function scrollIntoView(this: Element) {
      scrollTargets.push(this)
    }
  })

  afterEach(() => {
    delete (Element.prototype as { scrollIntoView?: () => void }).scrollIntoView
  })

  it('scrolls to the top when a card opens its detail route', () => {
    renderAt('/')
    scrollTo.mockClear()

    fireEvent.click(screen.getAllByRole('link', { name: /read more/i })[0])

    expect(window.location.pathname).toBe('/projects/project-6')
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })

  it('leaves a hash navigation anchored to its section', () => {
    renderAt('/projects/project-6')
    scrollTo.mockClear()

    fireEvent.click(screen.getByRole('link', { name: /back to projects/i }))

    expect(window.location.pathname).toBe('/')
    expect(window.location.hash).toBe('#projects')
    expect(scrollTo).not.toHaveBeenCalled()
    expect(scrollTargets).toContain(document.getElementById('projects'))
  })
})
