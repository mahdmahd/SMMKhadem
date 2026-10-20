/**
 * Recovery for stale code chunks after a deploy.
 *
 * Every build renames its chunks by content hash. A tab (or a CDN copy of
 * `index.html`) from the previous deploy then asks for chunk names that no
 * longer exist, and a lazy route such as a blog post renders nothing. Vite
 * announces exactly that failure as `vite:preloadError`; the fix is to reload
 * once, which fetches the current `index.html` and its current chunk names.
 *
 * The timestamp guard keeps it to one reload: if the fresh page fails too, the
 * problem is not staleness, and reloading forever would only hide it.
 */

export const CHUNK_RELOAD_KEY = 'chunk-reload-at'

/** A second failure within this window is a real error, not a stale deploy. */
const GUARD_MS = 10_000

export function installChunkReload(target: Window = window, reload: () => void = () => target.location.reload()) {
  const onPreloadError = (event: Event) => {
    let last = 0
    try {
      last = Number(target.sessionStorage.getItem(CHUNK_RELOAD_KEY) ?? 0)
    } catch {
      // Storage blocked: without a guard, never reload automatically.
      return
    }

    if (Date.now() - last < GUARD_MS) return

    event.preventDefault()
    try {
      target.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))
    } catch {
      return
    }
    reload()
  }

  target.addEventListener('vite:preloadError', onPreloadError)

  return () => target.removeEventListener('vite:preloadError', onPreloadError)
}
