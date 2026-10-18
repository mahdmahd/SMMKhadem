#!/usr/bin/env node
/**
 * Link audit — fetches every external URL in the portfolio data and fails loudly
 * on a dead one.
 *
 * The spec's rule is "a dead link is dropped, never guessed", and the review
 * focus is "a Paper/Code/Demo button points at a dead or wrong URL". So this
 * walks the *actual* exported data (not a hand-copied list that drifts) and
 * checks every `http(s)://` string it finds, at any nesting depth — which means
 * project and publication URLs added in Tasks 5–6 are covered for free.
 *
 * Usage:  node scripts/audit-links.mjs      (or: npm run audit:links)
 * Exit:   0 when every URL answered 2xx, 1 otherwise.
 *
 * Each URL is tried with a browser user-agent first and, only if that fails,
 * with a social-preview crawler agent. That second attempt is not an excuse
 * clause: LinkedIn answers `999` to any non-browser client — verified to be
 * the same answer for a nonexistent slug, so it carries no information about
 * the URL — while a crawler agent gets the truthful `200` for a live profile
 * and `404` for a dead one. The fallback therefore *verifies* instead of
 * allowlisting a host, and a genuinely dead link still fails here.
 *
 * Runs on Node's native TypeScript type stripping (Node >= 22.18 / 23.6), so
 * there is no tsx/bundler dependency. `mailto:` and in-page `/#…` hrefs are
 * deliberately out of scope: they are not fetchable.
 */

import { fileURLToPath } from 'node:url'

const DATA_MODULE = new URL('../src/data/portfolio.ts', import.meta.url)
const TIMEOUT_MS = 20_000

const USER_AGENTS = [
  {
    label: 'browser',
    value:
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  },
  {
    label: 'crawler',
    value: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  },
]

/** Recursively collects every absolute http(s) URL in a value. */
function collectUrls(value, found = new Set()) {
  if (typeof value === 'string') {
    if (/^https?:\/\//i.test(value)) found.add(value)
    return found
  }

  if (Array.isArray(value)) {
    for (const item of value) collectUrls(item, found)
    return found
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) collectUrls(item, found)
  }

  return found
}

async function attempt(url, userAgent) {
  try {
    const response = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { 'user-agent': userAgent.value, accept: 'text/html,*/*' },
    })

    // Release the socket without reading the body — status is all we need.
    await response.body?.cancel()

    return {
      ok: response.ok,
      detail: `${response.status} ${response.statusText}`.trim(),
    }
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return { ok: false, detail: reason }
  }
}

/** Tries each user-agent in order and reports the first that succeeds. */
async function check(url) {
  const failures = []

  for (const [index, userAgent] of USER_AGENTS.entries()) {
    const result = await attempt(url, userAgent)

    if (result.ok) {
      const via = index === 0 ? '' : `  (via ${userAgent.label} agent)`
      return { ok: true, detail: `${result.detail}${via}` }
    }

    failures.push(`${result.detail} (${userAgent.label})`)
  }

  return { ok: false, detail: failures.join(' / ') }
}

async function main() {
  // `formAction` is a form *endpoint*, not a link: Formspree answers a GET with
  // `405 Method Not Allowed` by design, which says nothing about whether the
  // endpoint is live. Its liveness was checked once with a POST (Task 7), and
  // the contact surfaces fall back to a mailto CTA whenever it is set to null.
  // Everything else in the module is a link and stays in scope.
  const { formAction, ...links } = await import(DATA_MODULE.href)

  if (formAction !== null && !/^https:\/\//.test(formAction)) {
    console.log(`audit-links: formAction is not https — ${formAction}`)
    return 1
  }

  const urls = [...collectUrls(links)].sort()

  if (urls.length === 0) {
    console.log('audit-links: no external URLs found in src/data/portfolio.ts')
    return 0
  }

  console.log(`audit-links: checking ${urls.length} URL(s) from ${fileURLToPath(DATA_MODULE)}`)

  let failures = 0

  for (const url of urls) {
    const { ok, detail } = await check(url)

    if (!ok) failures += 1
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${detail}  ${url}`)
  }

  console.log(
    failures === 0
      ? `audit-links: all ${urls.length} URL(s) reachable`
      : `audit-links: ${failures} of ${urls.length} URL(s) failed`,
  )

  return failures === 0 ? 0 : 1
}

try {
  process.exitCode = await main()
} catch (error) {
  const reason = error instanceof Error ? error.message : String(error)
  console.error(`audit-links: could not load the portfolio data — ${reason}`)
  process.exitCode = 1
}
