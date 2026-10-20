import type { Highlight } from '../data/portfolio'

export type ProjectHighlightsProps = {
  highlights?: Highlight[]
}

/**
 * The stat row shared by the case-study card and the detail route: each
 * headline number in display type over its mono label. A project without
 * highlights renders nothing, so neither caller has to guard.
 */
export default function ProjectHighlights({ highlights }: ProjectHighlightsProps) {
  if (!highlights || highlights.length === 0) return null

  return (
    <dl className="highlights">
      {highlights.map((highlight) => (
        <div key={highlight.label} className="highlights__item">
          <dt className="eyebrow highlights__label">{highlight.label}</dt>
          <dd className="highlights__value">{highlight.value}</dd>
        </div>
      ))}
    </dl>
  )
}
