import { useEffect } from 'react'
import { useLocation } from 'react-router'

/**
 * Restores the viewport on client-side navigation.
 *
 * A pathname change scrolls to the top. The homepage is several thousand pixels
 * tall, so without this a detail route opens at the previous page's offset —
 * sometimes at its own bottom, with the heading off-screen.
 *
 * Hash navigations are exempt: `/#projects` is an anchor, and `history.pushState`
 * does not trigger the browser's native jump, so the target section is scrolled
 * into view explicitly instead of forcing the page back to the top.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))

      if (target) {
        target.scrollIntoView()
        return
      }
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}
