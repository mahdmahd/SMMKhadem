import Reveal from '../components/Reveal'
import { publications, type Publication, type PublicationStatus } from '../data/portfolio'

const STATUS_LABEL: Record<PublicationStatus, string> = {
  published: 'Published',
  'under-review': 'Under review',
  'in-preparation': 'In preparation',
}

/**
 * One manuscript row. Same grammar as a project card — meta line, title,
 * supporting line — but the authors run verbatim, asterisks included, so the
 * corresponding-author mark the legend explains survives on the page.
 */
function PublicationRow({ publication }: { publication: Publication }) {
  return (
    <li className={`publication publication--${publication.status}`}>
      <p className="publication__meta">
        <span className="publication__year">{publication.year}</span>
        <span className={`publication__status publication__status--${publication.status}`}>
          {STATUS_LABEL[publication.status]}
        </span>
      </p>

      <h3 className="publication__title">{publication.title}</h3>

      <p className="publication__authors">{publication.authors.join(', ')}</p>

      <p className="publication__venue">
        <span className="publication__journal">{publication.venue}</span>
        {publication.impact && <span className="publication__impact">{publication.impact}</span>}
      </p>

      {publication.note && <p className="publication__note">{publication.note}</p>}

      {publication.url && (
        <p className="publication__actions">
          <a
            className="pill pill--ghost"
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            View <span aria-hidden="true">↗</span>
          </a>
        </p>
      )}
    </li>
  )
}

/**
 * "Publications": the CV's list, published first, then the ongoing
 * manuscripts, closed by the corresponding-authorship legend. Both groups read
 * from the one `publications` array, filtered by status.
 */
export default function Publications() {
  const published = publications.filter((entry) => entry.status === 'published')
  const ongoing = publications.filter((entry) => entry.status !== 'published')

  return (
    <section id="publications" className="shell section">
      <Reveal>
        <h2 className="eyebrow">Publications</h2>
      </Reveal>

      <Reveal className="publications__group" delay={40}>
        <h3 className="eyebrow publications__group-heading">Published</h3>
        <ul className="publications__list">
          {published.map((publication) => (
            <PublicationRow key={publication.title} publication={publication} />
          ))}
        </ul>
      </Reveal>

      <Reveal className="publications__group" delay={60}>
        <h3 className="eyebrow publications__group-heading">Under review &amp; in preparation</h3>
        <ul className="publications__list">
          {ongoing.map((publication) => (
            <PublicationRow key={publication.title} publication={publication} />
          ))}
        </ul>
      </Reveal>

      <Reveal delay={80}>
        <p className="publications__legend">* indicates corresponding authorship</p>
      </Reveal>
    </section>
  )
}
