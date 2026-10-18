import { Link } from 'react-router'

import ChannelIcon from '../components/ChannelIcon'
import Reveal from '../components/Reveal'
import { channels, profile } from '../data/portfolio'

/**
 * "Contact" on the homepage: availability, the gradient call to action, the two
 * fastest channels, and the details card.
 *
 * The framing is academic — the chip says what kind of approach is welcome
 * (PhD supervision, research collaborations), not that he is for hire. The form
 * itself lives on `/contact`; this block is the signpost to it.
 */
export default function Contact() {
  const email = channels.find((channel) => channel.icon === 'mail')
  const linkedin = channels.find((channel) => channel.icon === 'linkedin')
  const elsewhere = channels.filter((channel) => channel.icon !== 'mail' && channel.icon !== 'linkedin')

  return (
    <section id="contact" className="shell section contact">
      <Reveal>
        <p className="availability">
          <span className="availability__dot" aria-hidden="true" />
          Open to PhD and research collaborations
        </p>
      </Reveal>

      <div className="contact__grid">
        <Reveal className="contact__intro" delay={40}>
          <h2 className="display contact__title">Get in touch</h2>
          <p className="contact__line">{profile.tagline}</p>

          <div className="contact__actions">
            {email && (
              <a className="pill" href={email.url}>
                <ChannelIcon icon="mail" />
                Email
              </a>
            )}

            {linkedin && (
              <a className="pill pill--ghost" href={linkedin.url} target="_blank" rel="noopener noreferrer">
                <ChannelIcon icon="linkedin" />
                LinkedIn
              </a>
            )}

            <Link className="pill pill--ghost" to="/contact">
              Contact form
            </Link>
          </div>
        </Reveal>

        <Reveal className="contact__details" delay={80}>
          <dl className="details">
            <div className="details__row">
              <dt className="eyebrow details__term">Email</dt>
              <dd className="details__value">
                {email ? <a href={email.url}>{profile.email}</a> : profile.email}
              </dd>
            </div>

            <div className="details__row">
              <dt className="eyebrow details__term">Based in</dt>
              <dd className="details__value">{profile.location}</dd>
            </div>

            {elsewhere.length > 0 && (
              <div className="details__row">
                <dt className="eyebrow details__term">Elsewhere</dt>
                <dd className="details__value details__value--row">
                  {elsewhere.map((channel) => (
                    <a key={channel.name} href={channel.url} target="_blank" rel="noopener noreferrer">
                      {channel.name} <span aria-hidden="true">↗</span>
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
