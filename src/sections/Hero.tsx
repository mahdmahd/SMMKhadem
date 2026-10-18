import { profile } from '../data/portfolio'

/**
 * Split-line title: one word per line. "Mohammad Mahdi Khadem" becomes
 * MOHAMMAD / MAHDI / KHADEM — the compound given name is long enough that
 * pairing it with the family name overflows the column at display size.
 */
function nameLines(name: string): string[] {
  return name.trim().split(/\s+/).filter(Boolean)
}

/**
 * Generated duotone panel: a dot-grid mosaic under a soft radial wash. The
 * hero ships no photograph — the only portrait on hand is 266px wide, which is
 * unusable at this scale (owner decision), and no template imagery is allowed.
 * Deterministic on purpose: no randomness, so the render is stable.
 */
function HeroArt() {
  return (
    <svg
      className="hero__art"
      viewBox="0 0 320 400"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id="hero-dots" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="8" cy="8" r="1.5" fill="var(--text-dim, #a3a3a2)" opacity="0.55" />
        </pattern>
        <linearGradient id="hero-duotone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent, #e8e4dc)" stopOpacity="0.16" />
          <stop offset="100%" stopColor="var(--accent, #e8e4dc)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="hero-glow" cx="30%" cy="18%" r="85%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.42" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="320" height="400" fill="var(--panel, #0b0b0b)" />
      <rect width="320" height="400" fill="url(#hero-dots)" />
      <rect width="320" height="400" fill="url(#hero-duotone)" />
      <rect width="320" height="400" fill="url(#hero-glow)" />
    </svg>
  )
}

/**
 * Full-viewport hero: the name as split-line display type, the title, the
 * one-line arc, a scroll cue and the contact pill.
 */
export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="shell hero__inner">
        <div className="hero__text">
          <h1 className="display hero__title">
            {nameLines(profile.name).map((line) => (
              <span key={line} className="hero__line">
                {line}
              </span>
            ))}
          </h1>

          <p className="eyebrow hero__subtitle">{profile.title.toUpperCase()}</p>
          <p className="hero__tagline">{profile.tagline}</p>

          <div className="hero__actions">
            <a className="pill" href="/#contact">
              Get in touch
            </a>

            <a className="hero__cue" href="#about">
              <span className="eyebrow">Scroll</span>
              <svg
                className="hero__cue-arrow"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M7 1v11M2.5 7.5 7 12l4.5-4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <HeroArt />
      </div>
    </section>
  )
}
