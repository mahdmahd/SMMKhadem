import { Link } from 'react-router'

import { channels, nav, profile } from '../data/portfolio'

/** Footer: name mark, quick section links, contact channels, © line. */
export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="shell site-footer__inner">
        <Link className="mark" to="/">
          {profile.name}
        </Link>

        <nav className="site-footer__nav" aria-label="Footer">
          {nav.map((item) => (
            <a key={item.label} className="eyebrow" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        {channels.length > 0 ? (
          <ul className="site-footer__channels">
            {channels.map((channel) => (
              <li key={channel.name}>
                <a className="eyebrow" href={channel.url}>
                  {channel.name}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="eyebrow site-footer__copy">
          © {year} {profile.name}
        </p>
      </div>
    </footer>
  )
}
