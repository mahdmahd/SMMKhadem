#!/usr/bin/env node
/**
 * Route verification — builds the app, serves `dist/` the way GitHub Pages
 * would, and walks every shipped URL with a real browser, asserting the content
 * that makes each one *that* page and not the shell.
 *
 * Why a browser and not `fetch`: this is a client-rendered SPA. `dist/index.html`
 * is an empty `<div id="root">`, so a raw fetch of `/projects/project-6/`
 * answers 200 with the same bytes as `/` — the HTTP status proves only that the
 * fallback fired, never that the route resolved. The content needle is the
 * assertion that actually has information in it, and it only exists after React
 * has run. So the script does both: `fetch` for the status, Chromium for the
 * text. The needles are pulled from `src/data/portfolio.ts` rather than
 * hand-copied, so a renamed project or a re-slugged post fails here instead of
 * silently passing against a stale string.
 *
 * The fallback: unknown paths answer `index.html` with **200**. GitHub Pages is
 * slightly different — it answers an unknown path with a **404** status and the
 * body of `dist/404.html`, which the `postbuild` step copies from `index.html`.
 * The status therefore carries no information in production either; what matters
 * is that the SPA boots and the route resolves, which is exactly what the needle
 * check below covers.
 *
 * Usage:  node scripts/verify-routes.mjs            (or: npm run verify:routes)
 *         node scripts/verify-routes.mjs --no-build (reuse an existing dist/)
 * Exit:   0 when every route answered 200 and carried its content, 1 otherwise.
 *
 * Needs a Playwright Chromium. It is resolved from the project, the enclosing
 * `node_modules` chain, or the global npm root; `PLAYWRIGHT_PATH` overrides all
 * three. Without one the script fails loudly rather than downgrading to the
 * status-only check that cannot tell the routes apart.
 */

import { spawnSync } from 'node:child_process'
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, extname, join, normalize, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const DATA_MODULE = new URL('../src/data/portfolio.ts', import.meta.url)

/** How long a route may take to render its needle before it counts as missing. */
const NEEDLE_TIMEOUT_MS = 15_000

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

/* ------------------------------------------------------------------ needles */

/**
 * Collapses whitespace so a needle written as one line matches markup that
 * wrapped it across several, and so the curly apostrophes and en dashes that
 * the source data really uses are compared byte-for-byte rather than
 * approximately.
 */
function normalise(text) {
  return text.replace(/\s+/g, ' ').trim()
}

/* ------------------------------------------------------------------- server */

/**
 * Static file server over `dist/` with an SPA fallback, which is what the
 * GitHub Pages setup amounts to: real files win, everything else boots the app.
 */
function createStaticServer(distDir) {
  return createServer((request, response) => {
    const { pathname } = new URL(request.url ?? '/', 'http://localhost')
    const decoded = decodeURIComponent(pathname)

    // Resolve inside distDir only: `..` in a request must not escape it.
    const candidate = resolve(distDir, `.${normalize(decoded)}`)
    const insideDist = candidate === distDir || candidate.startsWith(distDir + sep)

    let file = insideDist ? candidate : null

    if (file && existsSync(file) && statSync(file).isDirectory()) {
      const index = join(file, 'index.html')
      file = existsSync(index) ? index : null
    }

    if (file && existsSync(file) && statSync(file).isFile()) {
      const body = readFileSync(file)
      response.writeHead(200, {
        'content-type': MIME[extname(file)] ?? 'application/octet-stream',
        'content-length': body.byteLength,
      })
      response.end(request.method === 'HEAD' ? undefined : body)
      return
    }

    const shell = readFileSync(join(distDir, 'index.html'))
    response.writeHead(200, {
      'content-type': 'text/html; charset=utf-8',
      'content-length': shell.byteLength,
    })
    response.end(request.method === 'HEAD' ? undefined : shell)
  })
}

/* ------------------------------------------------------------------ browser */

/** Tries the obvious module specifiers, then the global npm root. */
async function loadPlaywright() {
  const attempts = []

  if (process.env.PLAYWRIGHT_PATH) {
    attempts.push(process.env.PLAYWRIGHT_PATH)
  }

  attempts.push('playwright', 'playwright-core', '@playwright/test')

  const npmRoot = spawnSync('npm', ['root', '-g'], { encoding: 'utf8' })
  if (npmRoot.status === 0) {
    const globalRoot = npmRoot.stdout.trim()
    if (globalRoot) attempts.push(join(globalRoot, 'playwright'))
  }

  for (const specifier of attempts) {
    try {
      const mod = await import(specifier)
      if (mod.chromium) return mod
    } catch {
      // Try the next candidate; the error is reported once, below.
    }
  }

  throw new Error(
    `could not load Playwright (tried: ${attempts.join(', ')}).\n` +
      'Install it (npm i -D playwright && npx playwright install chromium) or set PLAYWRIGHT_PATH.',
  )
}

/**
 * Both readings of the page text. `innerText` inserts the breaks between block
 * elements that a needle written as prose expects; `textContent` still sees
 * nodes that CSS has hidden. Checking the needle against either means a
 * correctly-rendered string is never missed because of how it was wrapped.
 */
async function pageText(page) {
  const { inner, raw } = await page.evaluate(() => ({
    inner: document.body.innerText ?? '',
    raw: document.body.textContent ?? '',
  }))

  return `${normalise(inner)}\n${normalise(raw)}`
}

/** Polls until every needle is present, so lazily-loaded route chunks count. */
async function waitForNeedles(page, needles) {
  const deadline = Date.now() + NEEDLE_TIMEOUT_MS
  let missing = needles

  for (;;) {
    const haystack = await pageText(page)
    missing = needles.filter((needle) => !haystack.includes(normalise(needle)))

    if (missing.length === 0) return []
    if (Date.now() >= deadline) return missing

    await new Promise((done) => setTimeout(done, 100))
  }
}

/* ------------------------------------------------------------------- checks */

/**
 * The legacy alias map, read out of `src/routes/PostPage.tsx` rather than
 * restated here: a hardcoded copy is exactly the thing that drifts, and an
 * alias the app dropped would keep passing against a list this script owns.
 * Only the `LEGACY_SLUGS` literal is read, and every target must be a slug the
 * `posts` array actually ships — so a rename on either side fails here.
 */
function readLegacySlugs(posts) {
  const source = readFileSync(join(ROOT, 'src/routes/PostPage.tsx'), 'utf8')
  const start = source.indexOf('LEGACY_SLUGS')

  if (start === -1) {
    throw new Error('could not find LEGACY_SLUGS in src/routes/PostPage.tsx')
  }

  const block = source.slice(start, source.indexOf('}', start))
  const slugs = new Set(posts.map((post) => post.slug))
  const entries = [...block.matchAll(/(\w+):\s*'([^']+)'/g)]
    .map(([, alias, canonical]) => [alias, canonical])
    .filter(([, canonical]) => slugs.has(canonical))

  if (entries.length === 0) {
    throw new Error('LEGACY_SLUGS in src/routes/PostPage.tsx holds no known post slug')
  }

  return Object.fromEntries(entries)
}

/**
 * Builds the route table from the shipped data. Every entry is
 * `{ path, label, needles }`; the home route adds a structural check for its
 * nine section anchors, and `/cv.pdf` is checked for its content type instead
 * of its text.
 */
async function buildRoutes() {
  const { profile, featuredProjects, allProjects, posts, formAction } = await import(
    DATA_MODULE.href
  )

  const projects = [...featuredProjects, ...allProjects]
  const aliases = readLegacySlugs(posts)

  /** Per-post needles, the two literal ones plus a heading from each of the rest. */
  const postNeedles = {
    'a-tragedy-part-1': 'Amir—one of the kind-hearted kids',
    'a-greeting-from-the-depths-of-the-voiceless': '45 days since the internet was cut off',
    'how-to-build-a-hugo-site': 'Add a theme template using a git submodule',
    'my-linear-model-thinks-getting-older-makes-you-poorer-and-other-statistical-tragedies':
      'The Great Coefficient Unit War',
  }

  const postBySlug = new Map(posts.map((post) => [post.slug, post]))

  const routes = [
    {
      path: '/',
      label: 'home',
      needles: [profile.name],
      sections: ['top', 'about', 'toolkit', 'research', 'projects', 'publications', 'teaching', 'blog', 'contact'],
    },
    { path: '/about/', label: 'about page', needles: ['1.5T low-resolution'] },
    {
      path: '/contact/',
      label: 'contact page',
      needles: [],
      // Formspree when the endpoint is live, otherwise the mailto fallback —
      // either way the page must offer a way to actually reach him.
      selector: formAction
        ? `form[action*="formspree.io"]`
        : `a[href^="mailto:"]`,
      selectorLabel: formAction ? 'Formspree form' : 'mailto link',
    },
    {
      path: '/posts/',
      label: 'posts index',
      needles: posts.map((post) => post.title),
    },
  ]

  for (const post of posts) {
    const needle = postNeedles[post.slug] ?? post.title
    routes.push({ path: `/posts/${post.slug}/`, label: `post: ${post.slug}`, needles: [needle] })
  }

  for (const [alias, canonical] of Object.entries(aliases)) {
    const post = postBySlug.get(canonical)
    routes.push({
      path: `/posts/${alias}/`,
      label: `legacy: ${alias} → ${canonical}`,
      needles: [postNeedles[canonical] ?? post?.title ?? canonical],
    })
  }

  for (const project of projects) {
    routes.push({
      path: `/projects/${project.slug}/`,
      label: `project: ${project.slug}`,
      needles: [project.title],
    })
  }

  return { routes, projects }
}

/* --------------------------------------------------------------------- main */

async function main() {
  const skipBuild = process.argv.includes('--no-build')

  if (!skipBuild) {
    console.log('verify-routes: building (npm run build)')
    const build = spawnSync('npm', ['run', 'build'], { cwd: ROOT, stdio: 'inherit' })
    if (build.status !== 0) {
      console.error('verify-routes: build failed')
      return 1
    }
  }

  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('verify-routes: no dist/index.html — run without --no-build first')
    return 1
  }

  const { routes, projects } = await buildRoutes()
  const { chromium } = await loadPlaywright()

  const server = createStaticServer(DIST)
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  const { port } = server.address()
  const base = `http://127.0.0.1:${port}`

  console.log(`verify-routes: serving dist/ on ${base}`)
  console.log(`verify-routes: ${routes.length} route(s) + /cv.pdf`)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  const failures = []

  try {
    for (const route of routes) {
      const url = `${base}${route.path}`
      const problems = []

      // 1. The status, which proves the fallback answered at all.
      let status = 0
      try {
        const response = await fetch(url, { redirect: 'manual' })
        status = response.status
        await response.body?.cancel()
      } catch (error) {
        problems.push(`fetch failed: ${error instanceof Error ? error.message : error}`)
      }

      if (status !== 200) problems.push(`HTTP ${status}`)

      // 2. The content, which is what tells the routes apart.
      await page.goto(url, { waitUntil: 'load' })

      if (route.sections) {
        const found = await page.evaluate(
          (ids) => ids.filter((id) => document.getElementById(id) !== null),
          route.sections,
        )
        const missing = route.sections.filter((id) => !found.includes(id))
        if (missing.length > 0) problems.push(`missing section id(s): ${missing.join(', ')}`)
      }

      if (route.selector) {
        const present = await page.evaluate((selector) => document.querySelector(selector) !== null, route.selector)
        if (!present) problems.push(`missing ${route.selectorLabel}`)
      }

      if (route.needles.length > 0) {
        const missing = await waitForNeedles(page, route.needles)
        for (const needle of missing) {
          problems.push(`missing text: "${needle.slice(0, 60)}${needle.length > 60 ? '…' : ''}"`)
        }
      }

      if (problems.length === 0) {
        console.log(`PASS  ${route.path}  (${route.label})`)
      } else {
        failures.push({ path: route.path, problems })
        console.log(`FAIL  ${route.path}  (${route.label})`)
        for (const problem of problems) console.log(`        ${problem}`)
      }
    }

    // 3. The CV: a real file, served as a PDF, not the SPA fallback.
    {
      const response = await fetch(`${base}/cv.pdf`)
      const type = response.headers.get('content-type') ?? ''
      // `arrayBuffer()` already drained the body; cancelling afterwards would
      // throw on the now-locked stream.
      const bytes = (await response.arrayBuffer()).byteLength

      const problems = []
      if (response.status !== 200) problems.push(`HTTP ${response.status}`)
      if (type !== 'application/pdf') problems.push(`content-type ${type}`)
      if (bytes === 0) problems.push('empty body')

      if (problems.length === 0) {
        console.log(`PASS  /cv.pdf  (application/pdf, ${bytes} bytes)`)
      } else {
        failures.push({ path: '/cv.pdf', problems })
        console.log('FAIL  /cv.pdf')
        for (const problem of problems) console.log(`        ${problem}`)
      }
    }
  } finally {
    await browser.close()
    await new Promise((done) => server.close(done))
  }

  const total = routes.length + 1
  const projectCount = projects.length

  console.log(
    failures.length === 0
      ? `verify-routes: all ${total} route(s) pass (${projectCount} project slug(s), 4 canonical post(s) + 4 legacy alias(es))`
      : `verify-routes: ${failures.length} of ${total} route(s) failed`,
  )

  return failures.length === 0 ? 0 : 1
}

try {
  process.exitCode = await main()
} catch (error) {
  console.error(`verify-routes: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
