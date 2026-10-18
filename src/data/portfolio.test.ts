import { describe, expect, it } from 'vitest'

import {
  allProjects,
  channels,
  featuredProjects,
  nav,
  profile,
  publications,
  researchAreas,
  teaching,
  toolkit,
  type Project,
  type Publication,
} from './portfolio'

describe('profile', () => {
  it('carries the owner identity verbatim', () => {
    expect(profile.name).toBe('Mohammad Mahdi Khadem')
    expect(profile.title).toBe('M.D. · AI Researcher')
    expect(profile.location).toBe('Tehran, Iran')
    expect(profile.email).toBe('Smmehdikhadem@gmail.com')
  })

  it('carries a single-line arc statement', () => {
    expect(profile.tagline).not.toMatch(/\n/)
    expect(profile.tagline).toMatch(/clinical medicine and AI/i)
    expect(profile.tagline.length).toBeGreaterThan(60)
  })

  it('points the CV download at the bundled asset', () => {
    expect(profile.cvUrl).toBe('/cv.pdf')
  })
})

describe('nav', () => {
  it('lists the five sections in order', () => {
    expect(nav.map((item) => item.label)).toEqual([
      'Research',
      'Projects',
      'Publications',
      'Blog',
      'Contact',
    ])
  })

  it('uses root-relative hashes so the links resolve from subroutes', () => {
    expect(nav.map((item) => item.href)).toEqual([
      '/#research',
      '/#projects',
      '/#publications',
      '/#blog',
      '/#contact',
    ])

    for (const item of nav) {
      expect(item.href.startsWith('/#')).toBe(true)
    }
  })
})

describe('channels', () => {
  it('has exactly the four core channels, with exact URLs', () => {
    expect(channels).toHaveLength(4)
    expect(channels.map((channel) => channel.name)).toEqual([
      'Email',
      'LinkedIn',
      'GitHub',
      'ORCID',
    ])
    expect(channels.map((channel) => channel.url)).toEqual([
      'mailto:Smmehdikhadem@gmail.com',
      'https://www.linkedin.com/in/mohammad-mehdi-khadem-09bb8910b/',
      'https://github.com/mahdmahd',
      'https://orcid.org/0009-0005-4294-7934',
    ])
  })

  it('gives every channel an icon key', () => {
    expect(channels.map((channel) => channel.icon)).toEqual([
      'mail',
      'linkedin',
      'github',
      'orcid',
    ])
  })

  it('carries none of the retired or placeholder handles', () => {
    const haystack = channels
      .map((channel) => `${channel.name} ${channel.url}`)
      .join(' ')
      .toLowerCase()

    for (const retired of ['telegram', 'twitter', 'instagram', 'johndoe']) {
      expect(haystack).not.toContain(retired)
    }
  })
})

describe('toolkit', () => {
  it('has four rows, one per method family, in CV order', () => {
    expect(toolkit).toHaveLength(4)
    expect(toolkit[0]).toEqual(['Python', 'R', 'MATLAB', 'SQL', 'Git', 'Linux', 'Docker'])
    expect(toolkit[1]).toEqual(['FreeSurfer', 'SPM', 'ITK-SNAP', 'SVRTK', 'SynthSeg'])
    expect(toolkit[2]).toEqual(['Meta-analysis', 'SEM', 'Mplus', 'Stata', 'SPSS', 'Study Design'])
    expect(toolkit[3]).toEqual([
      'LangChain',
      'RAG Pipelines',
      'ChromaDB',
      'Ollama',
      'Scikit-learn',
      'SHAP',
    ])
  })

  it('has no empty or duplicated chips', () => {
    const chips = toolkit.flat()

    expect(chips.every((chip) => chip.trim().length > 0)).toBe(true)
    expect(new Set(chips).size).toBe(chips.length)
  })
})

describe('researchAreas', () => {
  it('has exactly five areas, numbered 01 through 05', () => {
    expect(researchAreas).toHaveLength(5)
    expect(researchAreas.map((area) => area.index)).toEqual(['01', '02', '03', '04', '05'])
    expect(researchAreas.map((area) => area.title)).toEqual([
      'Neuroimaging & Neurodegeneration',
      'Surgical Data Science & Bariatric AI',
      'Clinical NLP & Medical Documents',
      'Evidence Synthesis & Meta-Analysis',
      'Explainable ML & Clinical Prediction',
    ])
  })

  it('gives every area a unique id and three to five bullets', () => {
    expect(new Set(researchAreas.map((area) => area.id)).size).toBe(researchAreas.length)

    for (const area of researchAreas) {
      expect(area.id).toMatch(/^[a-z][a-z0-9-]*$/)
      expect(area.bullets.length).toBeGreaterThanOrEqual(3)
      expect(area.bullets.length).toBeLessThanOrEqual(5)

      for (const bullet of area.bullets) {
        expect(bullet.trim()).toBe(bullet)
        expect(bullet.length).toBeGreaterThan(40)
      }
    }
  })
})

// Type-level assertions: `tsc -b` typechecks this file during `npm run build`, so
// the compiler — not a runtime matcher — is what fails if these shapes drift.
const projectSample: Project = {
  slug: 'sample',
  index: '01',
  title: 'Sample',
  summary: 'Sample summary',
}

const publicationSample: Publication = {
  title: 'Sample',
  authors: ['A. Author'],
  venue: 'Sample Journal',
  year: 2026,
  status: 'published',
}

describe('collections later tasks fill', () => {
  it('ships the project slots as empty, optional-link-aware arrays', () => {
    expect(featuredProjects).toHaveLength(0)
    expect(allProjects).toHaveLength(0)
    expect(projectSample.image).toBeUndefined()
    expect(projectSample.paperUrl).toBeUndefined()
    expect(projectSample.codeUrl).toBeUndefined()
    expect(projectSample.demoUrl).toBeUndefined()
  })

  it('ships the publication slot as an empty array', () => {
    expect(publications).toHaveLength(0)
    expect(publicationSample.impact).toBeUndefined()
    expect(publicationSample.url).toBeUndefined()
  })

  it('exposes the teaching/service buckets as arrays', () => {
    expect(Array.isArray(teaching.teaching)).toBe(true)
    expect(Array.isArray(teaching.reviewing)).toBe(true)
    expect(Array.isArray(teaching.grants)).toBe(true)
    expect(Array.isArray(teaching.memberships)).toBe(true)
  })
})
