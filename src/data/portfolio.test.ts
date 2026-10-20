/// <reference types="node" />
import { existsSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  allProjects,
  channels,
  featuredProjects,
  formAction,
  formatPostDate,
  nav,
  posts,
  profile,
  publications,
  researchAreas,
  teaching,
  toolkit,
  type Project,
  type Publication,
} from './portfolio'

/**
 * The body of a Hugo file: everything after the closing `+++` of its TOML
 * frontmatter. Both the `about.md` and the post sources are `+++` files, so one
 * helper covers them.
 */
function bodyAfterFrontmatter(text: string): string {
  const lines = text.split('\n')

  expect(lines[0]).toBe('+++')

  const end = lines.indexOf('+++', 1)

  expect(end).toBeGreaterThan(0)

  return lines.slice(end + 1).join('\n')
}

/** Reads a repo file, with the single trailing newline normalised away. */
function readNormalised(...segments: string[]): string {
  return readFileSync(join(process.cwd(), ...segments), 'utf8').replace(/\n$/, '')
}

describe('profile', () => {
  it('carries the owner identity verbatim', () => {
    expect(profile.name).toBe('Mohammad Mahdi Khadem')
    expect(profile.title).toBe('M.D. · Medical AI Researcher')
    expect(profile.location).toBe('Tehran, Iran')
    expect(profile.email).toBe('Smmehdikhadem@gmail.com')
  })

  it('carries a single-line arc statement', () => {
    expect(profile.tagline).not.toMatch(/\n/)
    expect(profile.tagline).toMatch(/medicine and machine learning/i)
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
    expect(toolkit[0]).toEqual(['Python', 'R', 'MATLAB', 'SQL', 'Git', 'Linux', 'Docker', 'JavaScript', 'HTML/CSS'])
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

  it('describes area 05 by method, not by a vendor attribution claim', () => {
    // Carryover ruling: the toolkit may keep `SHAP` as a skill chip, but a
    // research bullet must not claim SHAP/LIME interpretability as the method.
    const bullets = researchAreas[4].bullets.join(' ')

    expect(bullets).toMatch(/Interpretability methods \(attribution scores, rule-based scores\)/)
    expect(bullets).not.toMatch(/\bSHAP\b/)
    expect(bullets).not.toMatch(/\bLIME\b/)
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

describe('projects', () => {
  it('features four case studies and archives the other seven', () => {
    expect(featuredProjects).toHaveLength(4)
    expect(allProjects).toHaveLength(7)

    const slugs = [...featuredProjects, ...allProjects].map((entry) => entry.slug)

    expect(new Set(slugs).size).toBe(11)
  })

  it('gives every project the fields the cards and the detail routes read', () => {
    for (const entry of [...featuredProjects, ...allProjects]) {
      expect(entry.slug).toMatch(/^project-[a-z0-9-]+$/)
      expect(entry.index).toMatch(/^\d{2}$/)
      expect(entry.title.trim().length).toBeGreaterThan(0)
      expect(entry.summary.trim().length).toBeGreaterThan(0)
      expect(entry.year).toBeGreaterThan(2000)
      expect(entry.overview?.trim().length).toBeGreaterThan(80)
      expect(entry.details?.length).toBeGreaterThan(0)
      expect(entry.technologies?.length).toBeGreaterThan(0)
    }
  })

  it('keeps technology tokens verbatim — no naive comma split', () => {
    // "R (meta, metafor)" has a comma inside the token; a plain split broke it
    // into "R (meta" + "metafor)".
    const uricacid = allProjects.find((entry) => entry.slug === 'project-uricacid')

    expect(uricacid?.technologies).toContain('R (meta, metafor)')
    expect(uricacid?.technologies?.some((token) => token === 'R (meta' || token === 'metafor)')).toBe(false)
  })


  it('keeps every link and the carried prose optional on the type', () => {
    expect(projectSample.image).toBeUndefined()
    expect(projectSample.paperUrl).toBeUndefined()
    expect(projectSample.codeUrl).toBeUndefined()
    expect(projectSample.demoUrl).toBeUndefined()
    expect(projectSample.overview).toBeUndefined()
    expect(projectSample.details).toBeUndefined()
  })

  it('carries only URLs verified for that same project', () => {
    // project-weightlosstrajectory's frontmatter reuses project-8's PMID and
    // points code_url at the SnapExplain repo — both dropped by owner ruling.
    const weightTrajectory = allProjects.find(
      (entry) => entry.slug === 'project-weightlosstrajectory',
    )

    expect(weightTrajectory?.paperUrl).toBeUndefined()
    expect(weightTrajectory?.codeUrl).toBeUndefined()

    // medrag.liararun.ir no longer resolves, so project-5 ships no Demo button.
    const rag = featuredProjects.find((entry) => entry.slug === 'project-5')

    expect(rag?.demoUrl).toBeUndefined()
  })

  it('keeps every attached URL on https', () => {
    const urls = [...featuredProjects, ...allProjects].flatMap((entry) =>
      [entry.paperUrl, entry.codeUrl, entry.demoUrl].filter((url): url is string => Boolean(url)),
    )

    expect(urls.length).toBeGreaterThan(0)

    for (const url of urls) {
      expect(url).toMatch(/^https:\/\//)
    }
  })

  it('points every figure at a file that ships in public/', () => {
    const figures = [...featuredProjects, ...allProjects].filter((entry) => entry.image)

    expect(figures.length).toBeGreaterThan(0)

    for (const entry of figures) {
      expect(entry.image).toMatch(/^\/images\/projects\/[\w.-]+$/)
      expect(existsSync(join(process.cwd(), 'public', entry.image ?? ''))).toBe(true)
    }
  })

  /**
   * The figures are charts and screenshots, not decoration: the study-design
   * flow chart and the PRISMA diagram carry numbers the prose does not
   * restate. An `alt=""` on one of them would drop that from a screen reader,
   * so the pairing is an invariant, not a nicety.
   */
  it('describes every figure it ships', () => {
    const figures = [...featuredProjects, ...allProjects].filter((entry) => entry.image)

    expect(figures.length).toBeGreaterThan(0)

    for (const entry of figures) {
      expect(entry.imageAlt, `${entry.slug} has an image but no imageAlt`).toBeTruthy()
      expect((entry.imageAlt ?? '').length).toBeGreaterThan(40)
    }
  })

  /**
   * The image budget from the Task 8 perf pass. `persimed_flowchart_Page2.png`
   * (1.07 MB) and `Screenshot2.jpg` (743 KB) dominated the payload; both are
   * WebP now, and this stops a future full-size PNG from creeping back in.
   */
  it('keeps every shipped figure under 300 KB', () => {
    const figures = [...featuredProjects, ...allProjects].filter((entry) => entry.image)

    expect(figures.length).toBeGreaterThan(0)

    for (const entry of figures) {
      const path = join(process.cwd(), 'public', entry.image ?? '')
      const { size } = statSync(path)

      expect(size, `${entry.slug} → ${entry.image} is ${Math.round(size / 1024)} KB`).toBeLessThan(
        300 * 1024,
      )
    }
  })

  it('keeps the optional publication fields optional on the type', () => {
    expect(publicationSample.impact).toBeUndefined()
    expect(publicationSample.url).toBeUndefined()
    expect(publicationSample.note).toBeUndefined()
  })
})

describe('publications', () => {
  it('lists eight manuscripts: four published and four ongoing', () => {
    expect(publications).toHaveLength(8)
    expect(publications.filter((entry) => entry.status === 'published')).toHaveLength(4)
    expect(publications.filter((entry) => entry.status !== 'published')).toHaveLength(4)
  })

  it('names him on every paper, and marks exactly one corresponding author', () => {
    for (const entry of publications) {
      expect(entry.authors.some((author) => author.startsWith('SMM Khadem'))).toBe(true)
      expect(entry.authors.every((author) => author.trim().length > 0)).toBe(true)
      expect(entry.authors.filter((author) => author.endsWith('*'))).toHaveLength(1)
    }
  })

  it('credits the pemphigus paper’s corresponding author as the paper prints it', () => {
    const pemphigus = publications.find((entry) => entry.title.includes('Pemphigus'))

    expect(pemphigus?.authors).toContain('Afsaneh Sadeghzadeh Bazargan*')
    expect(pemphigus?.authors).toContain('SMM Khadem')
  })

  it('names Obesity Surgery for the two bariatric papers, and only those', () => {
    const bariatric = publications.filter((entry) => entry.venue.includes('Obesity Surgery'))

    expect(bariatric).toHaveLength(2)
    expect(bariatric.map((entry) => entry.year).sort()).toEqual([2025, 2026])
  })

  it('carries the verified PubMed and civilica links', () => {
    const hypoalbuminemia = publications.find((entry) =>
      entry.title.startsWith('Unveiling Predictors of Hypoalbuminemia'),
    )
    const persimed = publications.find((entry) => entry.title.startsWith('PERSiMED'))

    expect(hypoalbuminemia?.url).toBe('https://pubmed.ncbi.nlm.nih.gov/41201758/')
    expect(persimed?.url).toBe('https://en.civilica.com/doc/2472372/')
  })

  it('keeps every publication link on https', () => {
    const urls = publications
      .map((entry) => entry.url)
      .filter((url): url is string => Boolean(url))

    expect(urls.length).toBeGreaterThan(0)

    for (const url of urls) {
      expect(url).toMatch(/^https:\/\//)
    }
  })

  it('marks the RAG manuscript under review and the rest of the ongoing set in preparation', () => {
    const ongoing = publications.filter((entry) => entry.status !== 'published')

    expect(ongoing.map((entry) => entry.status).sort()).toEqual([
      'in-preparation',
      'in-preparation',
      'in-preparation',
      'under-review',
    ])
  })
})

describe('teaching & service', () => {
  it('lists four teaching entries, in CV order', () => {
    expect(teaching.teaching).toHaveLength(4)
    expect(teaching.teaching.map((entry) => entry.period)).toEqual(['2023', '2018', '2017', '2017'])
  })

  it('lists the two reviewer journals', () => {
    expect(teaching.reviewing.map((entry) => entry.journal)).toEqual([
      'The American Journal of Case Reports',
      'Medical Science Monitor',
    ])
  })

  it('lists five grants and awards, with the funded amounts', () => {
    expect(teaching.grants).toHaveLength(5)
    expect(teaching.grants.filter((entry) => entry.amount === '€300')).toHaveLength(2)
    expect(teaching.grants.some((entry) => entry.amount === '€1,000')).toBe(true)
  })

  it('lists the two memberships — IRIMC and the AI x MS community', () => {
    expect(teaching.memberships).toHaveLength(2)

    const names = teaching.memberships.map((entry) => entry.name).join(' ')

    expect(names).toContain('IRIMC')
    expect(names).toMatch(/AI x MS/)
  })
})

describe('CV asset', () => {
  it('ships the CV PDF in public/, ready for the build to copy through', () => {
    expect(existsSync(join(process.cwd(), 'public', 'cv.pdf'))).toBe(true)
  })
})

describe('posts', () => {
  it('lists the four preserved posts, newest first', () => {
    expect(posts).toHaveLength(4)

    const dates = posts.map((post) => post.date)

    expect([...dates].sort().reverse()).toEqual(dates)
    expect(posts.map((post) => post.slug)).toEqual([
      'a-greeting-from-the-depths-of-the-voiceless',
      'a-tragedy-part-1',
      'my-linear-model-thinks-getting-older-makes-you-poorer-and-other-statistical-tragedies',
      'how-to-build-a-hugo-site',
    ])
  })

  it('carries the frontmatter titles and dates verbatim', () => {
    const byslug = new Map(posts.map((post) => [post.slug, post]))

    expect(byslug.get('a-tragedy-part-1')?.title).toBe('A tragedy - part 1')
    expect(byslug.get('a-tragedy-part-1')?.date).toBe('2026-02-16')
    expect(byslug.get('a-greeting-from-the-depths-of-the-voiceless')?.date).toBe('2026-04-12')
    expect(byslug.get('how-to-build-a-hugo-site')?.date).toBe('2025-01-17')
  })

  it('keeps every slug URL-safe', () => {
    for (const post of posts) {
      expect(post.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }
  })

  it('formats the date without leaning on the host locale', () => {
    expect(formatPostDate('2026-04-12')).toBe('12 April 2026')
    expect(formatPostDate('2026-02-16')).toBe('16 February 2026')
    expect(formatPostDate('2025-01-17')).toBe('17 January 2025')
  })
})

/**
 * The spec's "survives" rule: post and about prose stays byte-identical, only
 * the format changes. These read both the MDX that ships and the Hugo backup it
 * was carried from, so a well-meaning edit to one side cannot drift silently.
 */
describe('MDX bodies against the Hugo backup', () => {
  const BACKUP = ['docs', 'superpowers', 'specs', 'content-backup']
  const POSTS = ['src', 'content', 'posts']

  const SOURCES: Array<[label: string, backup: string[], mdx: string[]]> = [
    [
      'how-to-build-a-hugo-site',
      [...BACKUP, 'posts', 'hugo.md'],
      [...POSTS, 'how-to-build-a-hugo-site.mdx'],
    ],
    [
      'a-tragedy-part-1',
      [...BACKUP, 'posts', 'Mem1.md'],
      [...POSTS, 'a-tragedy-part-1.mdx'],
    ],
    [
      'the statistical tragedies',
      [...BACKUP, 'posts', 'pitfall.md'],
      [
        ...POSTS,
        'my-linear-model-thinks-getting-older-makes-you-poorer-and-other-statistical-tragedies.mdx',
      ],
    ],
    [
      'the voiceless greeting',
      [...BACKUP, 'posts', 'Voiceless.md'],
      [...POSTS, 'a-greeting-from-the-depths-of-the-voiceless.mdx'],
    ],
    ['the about story', [...BACKUP, 'about.md'], ['src', 'content', 'about.mdx']],
  ]

  it.each(SOURCES)('reprints %s byte-for-byte', (_label, backup, mdx) => {
    expect(readNormalised(...mdx)).toBe(bodyAfterFrontmatter(readNormalised(...backup)))
  })

  it('ships one MDX file per post', () => {
    for (const post of posts) {
      expect(existsSync(join(process.cwd(), 'src', 'content', 'posts', `${post.slug}.mdx`))).toBe(
        true,
      )
    }
  })
})

describe('contact form endpoint', () => {
  it('is either a verified Formspree URL or null for the mailto fallback', () => {
    expect(formAction === null || /^https:\/\/formspree\.io\/f\/[a-z0-9]+$/.test(formAction)).toBe(
      true,
    )
  })
})
