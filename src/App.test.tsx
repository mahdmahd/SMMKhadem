import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest'

import App from './App'

const HOME_SECTIONS = [
  'top',
  'about',
  'toolkit',
  'research',
  'projects',
  'publications',
  'teaching',
  'blog',
  'contact',
]

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

/**
 * The post slugs the Hugo site served, and the canonical post each one has to
 * resolve to. Inbound links and citations point at these; `PostPage` aliases
 * them rather than letting them fall through to the 404 page.
 */
const LEGACY_POSTS: Array<[path: string, title: string, needle: RegExp]> = [
  ['/posts/mem1', 'A tragedy - part 1', /Amir—one of the kind-hearted kids/],
  // Not the `winget install …` line: it appears twice (fence and inline code).
  ['/posts/hugo', 'How to Build a Hugo Site', /official Windows install docs explicitly list/],
  [
    '/posts/pitfall',
    'My Linear Model Thinks Getting Older Makes You Poorer (And Other Statistical Tragedies)',
    /every birthday makes you \$0\.31 poorer per hour/,
  ],
  [
    '/posts/voiceless',
    'A greeting from the depths of the voiceless',
    /45 days since the internet was cut off/,
  ],
]

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
  it('renders the home shell with all nine section anchors', () => {
    renderAt('/')

    expect(HOME_SECTIONS).toHaveLength(9)

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

  it('renders the MDX post at /posts/:slug', async () => {
    renderAt('/posts/a-tragedy-part-1')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('A tragedy - part 1')
    expect(await screen.findByText(/Amir—one of the kind-hearted kids/)).toBeInTheDocument()
  })

  it.each(LEGACY_POSTS)('serves the frozen legacy slug %s', async (path, title, needle) => {
    renderAt(path)

    // The alias resolves to the canonical post: title and body both.
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
    expect(await screen.findByText(needle)).toBeInTheDocument()
  })

  it.each(LEGACY_POSTS)('serves the legacy slug %s with a trailing slash', async (path, title) => {
    renderAt(`${path}/`)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title)
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
