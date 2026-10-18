import Reveal from '../components/Reveal'
import { profile, teaching } from '../data/portfolio'

/**
 * "Teaching & Service": four compact cards — teaching, peer review, grants and
 * awards, memberships — then the CV download the header also carries. The
 * eyebrow `<h2>` names the section; each card leads with an `<h3>`.
 */
export default function Teaching() {
  return (
    <section id="teaching" className="shell section">
      <Reveal>
        <h2 className="eyebrow">Teaching &amp; Service</h2>
      </Reveal>

      <div className="teaching__grid">
        <Reveal className="teaching__card" delay={0}>
          <h3 className="teaching__heading">Teaching</h3>
          <ul className="teaching__list">
            {teaching.teaching.map((entry) => (
              <li key={`${entry.role}-${entry.period}`} className="teaching__item">
                <p className="teaching__item-title">{entry.role}</p>
                <p className="teaching__item-meta">
                  {entry.organisation} · {entry.period}
                </p>
                {entry.detail && <p className="teaching__item-detail">{entry.detail}</p>}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="teaching__card" delay={40}>
          <h3 className="teaching__heading">Peer review</h3>
          <ul className="reviewer__list">
            {teaching.reviewing.map((entry) => (
              <li key={entry.journal} className="reviewer__item">
                <p className="reviewer__journal">{entry.journal}</p>
                <p className="reviewer__role">{entry.role}</p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="teaching__card" delay={80}>
          <h3 className="teaching__heading">Grants &amp; awards</h3>
          <ul className="grant__list">
            {teaching.grants.map((entry) => (
              <li key={entry.title} className="grant__item">
                <p className="grant__title">{entry.title}</p>
                <p className="grant__meta">
                  <span className="grant__year">{entry.year}</span>
                  {entry.funder && <span className="grant__funder">{entry.funder}</span>}
                  {entry.amount && <span className="grant__amount">{entry.amount}</span>}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="teaching__card" delay={120}>
          <h3 className="teaching__heading">Memberships</h3>
          <ul className="membership__list">
            {teaching.memberships.map((entry) => (
              <li key={entry.name} className="membership__item">
                <p className="membership__name">{entry.name}</p>
                {entry.role && <p className="membership__role">{entry.role}</p>}
                {entry.since && <p className="membership__since">{entry.since}</p>}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="teaching__actions" delay={160}>
        <a className="pill" href={profile.cvUrl} download>
          Download CV
        </a>
      </Reveal>
    </section>
  )
}
