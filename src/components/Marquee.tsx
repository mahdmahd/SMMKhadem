import type { CSSProperties } from 'react'

export type MarqueeProps = {
  /** Chips to scroll, in order. */
  items: string[]
  /** Accessible name for the visible chip list. */
  label: string
  /** Run the loop the other way. */
  reverse?: boolean
  /** Seconds for one full loop. */
  duration?: number
}

/**
 * How many copies of the chip list the track holds. The animation shifts the
 * track by exactly one copy, so the loop only reads as seamless while the
 * remaining copies still span the container — four copies of the shortest row
 * are comfortably wider than the 72rem shell.
 */
const COPIES = 4

const DEFAULT_DURATION = 44

/**
 * One marquee row: a chip list repeated `COPIES` times inside an overflowing
 * track, animated by the `marquee-scroll` keyframes in `src/index.css`. Every
 * copy but the first is `aria-hidden`, so assistive tech reads the list once.
 */
export default function Marquee({
  items,
  label,
  reverse = false,
  duration = DEFAULT_DURATION,
}: MarqueeProps) {
  const style = {
    '--marquee-duration': `${duration}s`,
    '--marquee-direction': reverse ? 'reverse' : 'normal',
    // Exactly one copy of the track, as a percentage of its width. The
    // keyframes translate by this, so the two can never drift apart.
    '--marquee-shift': `-${100 / COPIES}%`,
  } as CSSProperties

  return (
    <div className="marquee">
      <div className="marquee__track" style={style}>
        {Array.from({ length: COPIES }, (_, copy) => (
          <ul
            // The copies are interchangeable, so the index is the only stable key.
            key={copy}
            className="marquee__group"
            aria-hidden={copy > 0 ? 'true' : undefined}
            aria-label={copy === 0 ? label : undefined}
          >
            {items.map((item) => (
              <li key={item} className="marquee__chip">
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
