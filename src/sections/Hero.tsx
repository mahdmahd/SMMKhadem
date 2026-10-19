import portrait from '../assets/mehdi-portrait.jpg'
import DotPortrait from '../components/DotPortrait'
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

        {/* The portrait is sampled into a canvas of dots, so the frame only
            supplies the geometry and the crop. */}
        <div className="hero__art">
          <DotPortrait src={portrait} />
        </div>
      </div>
    </section>
  )
}
