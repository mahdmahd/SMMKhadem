import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import { nav, profile } from '../data/portfolio'

const NAV_ID = 'site-nav'
const SCROLL_THRESHOLD = 8

/**
 * Fixed header: name mark, section nav, CV download.
 * Adds `.is-scrolled` (background blur) once the page is scrolled past a
 * few pixels, and collapses the nav behind a disclosure button on mobile.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <header className={scrolled ? 'site-header is-scrolled' : 'site-header'}>
      <div className="shell site-header__inner">
        <Link className="mark" to="/">
          {profile.name}
        </Link>

        <nav
          id={NAV_ID}
          className={open ? 'site-nav is-open' : 'site-nav'}
          aria-label="Sections"
        >
          {nav.map((item) => (
            <a key={item.label} className="eyebrow site-nav__link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <a className="pill" href="/cv.pdf" download>
            CV
          </a>
          <button
            type="button"
            className="eyebrow site-nav-toggle"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls={NAV_ID}
            onClick={() => {
              setOpen((value) => !value)
            }}
          >
            Menu
          </button>
        </div>
      </div>
    </header>
  )
}
