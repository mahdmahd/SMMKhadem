import type { ReactNode } from 'react'

import Reveal from '../components/Reveal'
import { about, timeline } from '../data/portfolio'

/**
 * Turns the `**phrase**` spans of a bio paragraph into `<mark>` highlights.
 * The copy stays a plain string in `src/data/portfolio.ts`, so the owner can
 * edit the wording without touching markup.
 */
function highlight(paragraph: string): ReactNode[] {
  const pattern = /\*\*(.+?)\*\*/g
  const nodes: ReactNode[] = []
  let cursor = 0
  let match = pattern.exec(paragraph)

  while (match !== null) {
    if (match.index > cursor) nodes.push(paragraph.slice(cursor, match.index))

    nodes.push(<mark key={match.index}>{match[1] ?? ''}</mark>)

    cursor = match.index + match[0].length
    match = pattern.exec(paragraph)
  }

  if (cursor < paragraph.length) nodes.push(paragraph.slice(cursor))

  return nodes
}

/**
 * "Intro": the condensed bio with its eight highlighted key phrases, then the
 * four-step education and appointments timeline.
 */
export default function About() {
  return (
    <section id="about" className="shell section">
      <Reveal>
        <p className="eyebrow">About me</p>
        <h2 className="display about__title">Intro</h2>
      </Reveal>

      <div className="about__grid">
        <Reveal className="about__bio" delay={60}>
          {about.map((paragraph, index) => (
            <p key={index}>{highlight(paragraph)}</p>
          ))}
        </Reveal>

        <Reveal delay={120}>
          <ol className="timeline">
            {timeline.map((entry) => (
              <li key={entry.organisation} className="timeline__entry">
                <span className="timeline__period">{entry.period}</span>
                <p className="timeline__role">{entry.role}</p>
                <p className="timeline__org">{entry.organisation}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
