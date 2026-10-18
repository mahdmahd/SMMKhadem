import ChannelIcon from '../components/ChannelIcon'
import ContactForm from '../components/ContactForm'
import Reveal from '../components/Reveal'
import { channels, formAction, profile } from '../data/portfolio'

/**
 * `/contact` — the four channels and the message form.
 *
 * The form posts to Formspree when the endpoint is verified live; `formAction`
 * is `null` when it is not, and `ContactForm` then renders a `mailto:` call to
 * action instead. Either way the page never offers a control that silently
 * discards a message.
 */
export default function ContactPage() {
  return (
    <section id="contact" className="shell section contact-page">
      <Reveal>
        <p className="eyebrow">Contact</p>
        <h1 className="display contact-page__title">Get in touch</h1>
        <p className="contact-page__lead">
          Collaborations, reviewing, and research inquiries. Based in {profile.location}.
        </p>
      </Reveal>

      <Reveal delay={40}>
        <ul className="channel-row">
          {channels.map((channel) => (
            <li key={channel.name} className="channel">
              <a
                className="channel__link"
                href={channel.url}
                {...(channel.icon === 'mail'
                  ? {}
                  : { target: '_blank', rel: 'noopener noreferrer' })}
              >
                <ChannelIcon icon={channel.icon} className="channel__icon" />
                <span className="channel__name">{channel.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={80}>
        <ContactForm action={formAction} email={profile.email} />
      </Reveal>
    </section>
  )
}
