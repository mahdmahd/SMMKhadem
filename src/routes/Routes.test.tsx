import { cleanup, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import App from '../App'
import ContactForm from '../components/ContactForm'
import { formAction, posts, profile } from '../data/portfolio'
import { POST_BODIES } from './PostPage'

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

// ScrollToTop calls `window.scrollTo` on mount; jsdom does not implement it.
beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe('PostPage', () => {
  it('renders the chrome: display title, mono date, prose body', async () => {
    renderAt('/posts/a-tragedy-part-1')

    const title = screen.getByRole('heading', { level: 1 })

    expect(title).toHaveTextContent('A tragedy - part 1')
    expect(title).toHaveClass('display')

    const time = document.querySelector('time')

    expect(time).toHaveAttribute('datetime', '2026-02-16')
    expect(time).toHaveTextContent('16 February 2026')

    await screen.findByText(/Amir—one of the kind-hearted kids/)

    expect(document.querySelector('.prose')).not.toBeNull()
  })

  it('renders the part-1 tragedy prose verbatim', async () => {
    renderAt('/posts/a-tragedy-part-1')

    expect(await screen.findByText(/Amir—one of the kind-hearted kids/)).toBeInTheDocument()
    expect(screen.getByText(/to be continued\.\.\./)).toBeInTheDocument()
  })

  it('renders the voiceless post, whose body opens on the blackout count', async () => {
    renderAt('/posts/a-greeting-from-the-depths-of-the-voiceless')

    expect(
      await screen.findByText(/45 days since the internet was cut off/),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'A greeting from the depths of the voiceless',
    )
  })

  it('renders markdown structure — headings, lists and fenced code — not a text dump', async () => {
    renderAt('/posts/how-to-build-a-hugo-site')

    const heading = await screen.findByRole('heading', { level: 2, name: /install hugo with winget/i })

    expect(heading).toBeInTheDocument()

    const code = document.querySelectorAll('.prose pre code')

    expect(code.length).toBeGreaterThan(0)
    expect(code[0].textContent).toContain('winget install Hugo.Hugo.Extended')
    expect(document.querySelectorAll('.prose ul li').length).toBeGreaterThan(0)
  })

  it('keeps fenced code intact — angle brackets and template braces survive MDX', async () => {
    renderAt('/posts/how-to-build-a-hugo-site')

    await screen.findByRole('heading', { level: 2, name: /install hugo with winget/i })

    const text = document.querySelector('.prose')?.textContent ?? ''

    // The two constructs that would break if the fences were ever parsed as
    // markup: a JSX-shaped placeholder and a GitHub-Actions expression.
    expect(text).toContain('https://github.com/<theme-author>/<theme-repo>.git')
    expect(text).toContain('${{ secrets.ACTIONS_DEPLOY_KEY }}')
    expect(text).toContain('winget install Hugo.Hugo.Extended')
    expect(text).not.toContain('&amp;')
    expect(text).not.toContain('&lt;')
  })

  it('renders the statistical-tragedies post', async () => {
    renderAt('/posts/my-linear-model-thinks-getting-older-makes-you-poorer-and-other-statistical-tragedies')

    expect(
      await screen.findByText(/every birthday makes you \$0\.31 poorer per hour/i),
    ).toBeInTheDocument()
  })

  it('falls back to NotFound for an unknown post slug', () => {
    renderAt('/posts/no-such-post')

    expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument()
  })

  it('carries exactly one body per post — the map and the data cannot drift', () => {
    expect(Object.keys(POST_BODIES).sort()).toEqual(posts.map((post) => post.slug).sort())
  })
})

describe('PostsIndex', () => {
  it('lists all four posts, newest first', () => {
    renderAt('/posts')

    const items = Array.from(document.querySelectorAll<HTMLElement>('#posts .post-card'))

    expect(posts).toHaveLength(4)
    expect(items).toHaveLength(4)

    expect(items.map((item) => item.querySelector('.post-card__title')?.textContent)).toEqual(
      posts.map((post) => post.title),
    )

    // Newest first: the ISO dates run strictly downwards down the list.
    const dates = items.map((item) => item.querySelector('time')?.getAttribute('datetime') ?? '')

    expect(dates).toEqual(posts.map((post) => post.date))
    expect([...dates].sort().reverse()).toEqual(dates)
  })

  it('links every row to its post route', () => {
    renderAt('/posts')

    for (const post of posts) {
      expect(document.querySelector(`#posts a[href="/posts/${post.slug}"]`)).not.toBeNull()
    }
  })

  it('names itself for the header nav', () => {
    renderAt('/posts')

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/writing/i)
  })
})

describe('AboutPage', () => {
  it('carries the full long-form story, not the condensed bio', async () => {
    renderAt('/about')

    expect(await screen.findByText(/1\.5T low-resolution/)).toBeInTheDocument()

    const text = document.querySelector('#about')?.textContent ?? ''

    for (const section of [
      'About Me',
      'My Story',
      'Interests',
      'Work Experience',
      'Education',
      // The owner's typographic apostrophe, preserved verbatim.
      'Let’s Connect',
    ]) {
      expect(text).toContain(section)
    }

    expect(text).toContain('frontotemporal dementia')
    expect(text).toContain('Dr. Mohammad Kermansaravi')
    expect(text).toContain('Saman Insurance Company')
    expect(text).toContain('hippocampal shape analysis')
    expect(text).toContain('🎶 Music')
  })

  it('renders the story inside the prose container', () => {
    renderAt('/about')

    expect(document.querySelector('#about .prose')).not.toBeNull()
  })
})

describe('ContactPage', () => {
  it('renders the four contact channels with icons', () => {
    renderAt('/contact')

    const channels = Array.from(document.querySelectorAll<HTMLElement>('.channel-row .channel'))

    expect(channels).toHaveLength(4)
    expect(channels.map((channel) => channel.textContent)).toEqual([
      'Email',
      'LinkedIn',
      'GitHub',
      'ORCID',
    ])

    for (const channel of channels) {
      expect(channel.querySelector('.channel-icon')).not.toBeNull()
    }

    expect(document.querySelector('.channel-row a[href^="mailto:"]')).not.toBeNull()
    expect(document.querySelector('.channel-row a[href*="github.com"]')).not.toBeNull()
    expect(document.querySelector('.channel-row a[href*="orcid.org"]')).not.toBeNull()
  })

  it('paints the shipped SVGs as masks and draws mail inline', () => {
    renderAt('/contact')

    // The three raster icons ship black-filled, so they are painted as a mask
    // over `currentColor` — without the modifier class they render invisible.
    const masked = Array.from(
      document.querySelectorAll<HTMLElement>('.channel-row .channel-icon--mask'),
    )
    const raster = ['linkedin', 'github', 'orcid']

    expect(masked).toHaveLength(raster.length)

    masked.forEach((icon, index) => {
      const style = icon.getAttribute('style') ?? ''

      expect(icon.tagName.toLowerCase()).toBe('span')
      expect(style).toContain('mask-image')
      expect(style).toContain(`/images/icons/${raster[index]}.svg`)
    })

    // mail has no asset: a stroked envelope, and no mask.
    const mail = document.querySelector('.channel-row a[href^="mailto:"] .channel-icon')

    expect(mail?.tagName.toLowerCase()).toBe('svg')
    expect(mail).not.toHaveClass('channel-icon--mask')
  })

  it('states where he is based', () => {
    renderAt('/contact')

    expect(document.querySelector('#contact')?.textContent).toContain('Tehran, Iran')
  })

  it('renders the Formspree form the endpoint check cleared', () => {
    renderAt('/contact')

    const form = document.querySelector<HTMLFormElement>('form.contact-form')

    expect(formAction).toBe('https://formspree.io/f/xkonleag')
    expect(form).not.toBeNull()
    expect(form).toHaveAttribute('action', formAction)
    expect(form?.getAttribute('method')?.toLowerCase()).toBe('post')

    expect(within(form as HTMLFormElement).getByLabelText(/name/i)).toBeInTheDocument()
    expect(within(form as HTMLFormElement).getByLabelText(/email/i)).toBeInTheDocument()
    expect(within(form as HTMLFormElement).getByLabelText(/message/i)).toBeInTheDocument()
    expect(within(form as HTMLFormElement).getByRole('button', { name: /send/i })).toBeInTheDocument()
  })
})

/**
 * The fallback branch the spec asks for: if the Formspree endpoint is ever
 * dead, the form must be replaced by a mailto call to action rather than
 * swallowing submissions. The live-endpoint branch is covered above.
 */
describe('ContactForm', () => {
  it('posts to Formspree when the endpoint is live', () => {
    render(<ContactForm action={formAction} email={profile.email} />)

    expect(document.querySelector('form')).toHaveAttribute('action', formAction)
  })

  it('falls back to a mailto call to action when the endpoint is dead', () => {
    render(<ContactForm action={null} email={profile.email} />)

    expect(document.querySelector('form')).toBeNull()

    const cta = screen.getByRole('link', { name: /email/i })

    expect(cta).toHaveAttribute('href', `mailto:${profile.email}`)
  })
})
