import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'

const HOME_SECTIONS = ['research', 'projects', 'publications', 'blog', 'contact']

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

afterEach(cleanup)

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

  it('renders the project detail stub for legacy /projects/:slug paths', () => {
    renderAt('/projects/project-6')

    expect(screen.getByText(/project-6/)).toBeInTheDocument()
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
