import { useEffect } from 'react'

/**
 * Set `document.title` for the current route.
 *
 * `index.html` ships one static title for the first paint; every routed page
 * overwrites it here so a tab, a bookmark, or a shared link names the page it
 * actually is. The write happens in an effect rather than during render so the
 * document is only mutated after commit, and a `null` title leaves the current
 * one untouched — a route that resolves to NotFound does not invent a name.
 */
export function usePageTitle(title: string | null) {
  useEffect(() => {
    if (title) document.title = title
  }, [title])
}
