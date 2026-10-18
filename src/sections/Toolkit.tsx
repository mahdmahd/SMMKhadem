import Marquee, { DEFAULT_MARQUEE_DURATION } from '../components/Marquee'
import Reveal from '../components/Reveal'
import { toolkit } from '../data/portfolio'

/** Seconds each row below the first adds to its loop, so the rows drift apart. */
const DURATION_STEP = 6

/**
 * "The toolkit": one marquee row per method family, alternating direction so
 * the block reads as a woven texture rather than four parallel belts.
 */
export default function Toolkit() {
  return (
    <section id="toolkit" className="shell section">
      <Reveal>
        <h2 className="eyebrow">The toolkit</h2>
      </Reveal>

      <Reveal delay={60}>
        <div className="toolkit__rows">
          {toolkit.map((row, index) => (
            <Marquee
              key={row[0]}
              items={row}
              label={`Toolkit row ${index + 1}`}
              reverse={index % 2 === 1}
              duration={DEFAULT_MARQUEE_DURATION + index * DURATION_STEP}
            />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
