import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import {
  about,
  allProjects,
  featuredProjects,
  profile,
  researchAreas,
  timeline,
  toolkit,
  type Project,
} from '../data/portfolio'
import Home from '../routes/Home'
import ProjectDetail from '../routes/ProjectDetail'
import About from './About'
import Hero from './Hero'
import Projects from './Projects'
import Research from './Research'
import Toolkit from './Toolkit'

afterEach(cleanup)

/** The section a component owns, by anchor id. */
function section(id: string): HTMLElement {
  const element = document.getElementById(id)

  if (!element) throw new Error(`no section #${id} in the document`)

  return element
}

/** The featured and archived projects in one lookup, as the routes see them. */
const projects: Project[] = [...featuredProjects, ...allProjects]

function project(slug: string): Project {
  const found = projects.find((entry) => entry.slug === slug)

  if (!found) throw new Error(`no project ${slug} in the data`)

  return found
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

describe('Research', () => {
  it('renders one numbered row per research area', () => {
    render(<Research />)

    const research = section('research')
    const rows = Array.from(research.querySelectorAll('.accordion__item'))

    expect(researchAreas).toHaveLength(5)
    expect(rows).toHaveLength(5)

    researchAreas.forEach((area, index) => {
      expect(rows[index].textContent).toContain(area.index)
      expect(rows[index].textContent).toContain(area.title)
    })
  })

  it('opens the first row and prints its bullets', () => {
    render(<Research />)

    const research = section('research')
    const triggers = Array.from(research.querySelectorAll<HTMLButtonElement>('.accordion__trigger'))

    expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')

    const openPanel = research.querySelector('.accordion__panel:not([hidden])')

    expect(openPanel).not.toBeNull()

    for (const bullet of researchAreas[0].bullets) {
      expect(openPanel?.textContent).toContain(bullet)
    }
  })

  it('toggles a row on click and keeps a single panel open', () => {
    render(<Research />)

    const research = section('research')
    const triggers = Array.from(research.querySelectorAll<HTMLButtonElement>('.accordion__trigger'))
    const openPanels = () => research.querySelectorAll('.accordion__panel:not([hidden])')

    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(triggers[1])

    expect(triggers[1]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')
    expect(openPanels()).toHaveLength(1)

    fireEvent.click(triggers[3])

    expect(openPanels()).toHaveLength(1)
    expect(triggers[3]).toHaveAttribute('aria-expanded', 'true')
    expect(triggers[1]).toHaveAttribute('aria-expanded', 'false')

    // Clicking the open row collapses it — nothing is forced open.
    fireEvent.click(triggers[3])

    expect(triggers[3]).toHaveAttribute('aria-expanded', 'false')
    expect(openPanels()).toHaveLength(0)
  })

  it('wires every trigger to a labelled region panel', () => {
    render(<Research />)

    const research = section('research')
    const triggers = Array.from(research.querySelectorAll('.accordion__trigger'))
    const panels = Array.from(research.querySelectorAll('[role="region"]'))

    expect(panels).toHaveLength(researchAreas.length)

    triggers.forEach((trigger, index) => {
      expect(trigger.getAttribute('aria-controls')).toBe(panels[index].id)
      expect(panels[index].getAttribute('aria-labelledby')).toBe(trigger.id)
    })
  })

  it('keeps the billboard word decorative', () => {
    render(<Research />)

    const billboard = section('research').querySelector('.research__billboard')

    expect(billboard).not.toBeNull()
    expect(billboard).toHaveAttribute('aria-hidden', 'true')
    expect(billboard?.classList.contains('display')).toBe(true)
    expect(billboard?.textContent).toBe('Research')
  })
})

function renderProjects() {
  return render(
    <MemoryRouter>
      <Projects />
    </MemoryRouter>,
  )
}

/** The featured card that links to a project's detail route. */
function featuredCard(slug: string): HTMLElement {
  const card = Array.from(section('projects').querySelectorAll<HTMLElement>('.project-card')).find(
    (element) => element.querySelector(`a[href="/projects/${slug}"]`),
  )

  if (!card) throw new Error(`no featured card links to ${slug}`)

  return card
}

describe('Projects', () => {
  it('renders the four featured case studies with alternating layouts', () => {
    renderProjects()

    const cards = Array.from(section('projects').querySelectorAll('.project-card'))

    expect(featuredProjects).toHaveLength(4)
    expect(cards).toHaveLength(4)
    expect(featuredProjects.map((entry) => entry.slug)).toEqual([
      'project-6',
      'project-5',
      'project-8',
      'project-3',
    ])

    const sides = cards.map((card) => {
      if (card.classList.contains('project-card--image-left')) return 'left'
      if (card.classList.contains('project-card--image-right')) return 'right'
      return 'none'
    })

    expect(sides).toEqual(['right', 'left', 'right', 'left'])
  })

  it('prints the number, title and summary of every featured project', () => {
    renderProjects()

    for (const entry of featuredProjects) {
      const card = featuredCard(entry.slug)

      expect(card.textContent).toContain(entry.index)
      expect(card.textContent).toContain(entry.title)
      expect(card.textContent).toContain(entry.summary)
    }
  })

  it('links every featured card to its detail route', () => {
    renderProjects()

    for (const entry of featuredProjects) {
      const card = featuredCard(entry.slug)

      expect(within(card).getByRole('link', { name: /read more/i })).toHaveAttribute(
        'href',
        `/projects/${entry.slug}`,
      )
    }
  })

  it('shows Paper and Code on PERSiMED, and no Demo', () => {
    renderProjects()

    const card = featuredCard('project-6')

    expect(within(card).getByRole('link', { name: /paper/i })).toHaveAttribute(
      'href',
      'https://en.civilica.com/doc/2472372/',
    )
    expect(within(card).getByRole('link', { name: /code/i })).toHaveAttribute(
      'href',
      'https://github.com/mahdmahd/PERSiMED',
    )
    expect(within(card).queryByRole('link', { name: /demo/i })).toBeNull()
  })

  it('renders no Demo button when the project has no demo URL', () => {
    renderProjects()

    // The OAGB score (project-8) carries a paperUrl only.
    const card = featuredCard('project-8')

    expect(within(card).getByRole('link', { name: /paper/i })).toBeInTheDocument()
    expect(within(card).queryByRole('link', { name: /code/i })).toBeNull()
    expect(within(card).queryByRole('link', { name: /demo/i })).toBeNull()
  })

  it('lists the seven archive projects, each linking to its detail route', () => {
    renderProjects()

    const items = Array.from(section('projects').querySelectorAll<HTMLElement>('.archive__item'))

    expect(allProjects).toHaveLength(7)
    expect(items).toHaveLength(7)

    items.forEach((item, index) => {
      const entry = allProjects[index]

      expect(item.textContent).toContain(entry.title)
      expect(item.textContent).toContain(String(entry.year))
      expect(item.querySelector(`a[href="/projects/${entry.slug}"]`)).not.toBeNull()
    })
  })
})

describe('ProjectDetail', () => {
  function renderDetail(slug: string) {
    return render(
      <MemoryRouter initialEntries={[`/projects/${slug}`]}>
        <Routes>
          <Route path="/projects/:slug" element={<ProjectDetail />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('reprints the full PERSiMED prose', () => {
    renderDetail('project-6')

    const article = document.querySelector('.project-detail')
    const entry = project('project-6')

    expect(article).not.toBeNull()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(entry.title)

    // A fragment that only exists in the Project Details section.
    expect(screen.getByText(/mixed Persian–English scripts/i)).toBeInTheDocument()

    expect(screen.getByRole('heading', { name: /^overview$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^project details$/i })).toBeInTheDocument()

    // The carried prose, paragraph for paragraph — not a stub.
    expect(article?.textContent).toContain(entry.overview)

    for (const paragraph of entry.details ?? []) {
      expect(article?.textContent).toContain(paragraph)
    }
  })

  it('states the year, the technologies and a way back', () => {
    renderDetail('project-3')

    const entry = project('project-3')
    const article = document.querySelector('.project-detail')

    expect(article?.textContent).toContain(String(entry.year))

    for (const technology of entry.technologies ?? []) {
      expect(article?.textContent).toContain(technology)
    }

    expect(screen.getByRole('link', { name: /back to projects/i })).toHaveAttribute(
      'href',
      '/#projects',
    )
  })

  it('carries the weight-trajectory prose but none of its wrong links', () => {
    renderDetail('project-weightlosstrajectory')

    const entry = project('project-weightlosstrajectory')
    const article = document.querySelector('.project-detail')

    expect(article?.textContent).toContain(entry.details?.[0] ?? '')
    expect(screen.queryByRole('link', { name: /paper/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /code/i })).toBeNull()
    expect(screen.queryByRole('link', { name: /demo/i })).toBeNull()
  })

  it('falls back to NotFound for an unknown slug', () => {
    renderDetail('project-does-not-exist')

    expect(screen.getByRole('heading', { name: /not found/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /back home/i })).toBeInTheDocument()
  })
})

describe('Home composition', () => {
  it('orders the new sections before the publications stub', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const ids = Array.from(document.querySelectorAll('section[id]')).map((element) => element.id)

    expect(ids.slice(0, 5)).toEqual(['top', 'about', 'toolkit', 'research', 'projects'])
    expect(ids).toContain('contact')
  })
})
