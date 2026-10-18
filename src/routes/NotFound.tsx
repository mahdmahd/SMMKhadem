import { Link } from 'react-router'

/** 404 fallback route (and the SPA shell GitHub Pages serves for legacy URLs). */
export default function NotFound() {
  return (
    <section id="not-found" className="container section">
      <p className="eyebrow">404</p>
      <h1 className="display">Not found</h1>
      <p className="section__placeholder">
        That page does not exist. It may have moved in the redesign.
      </p>
      <p>
        <Link className="pill" to="/">
          Back home
        </Link>
      </p>
    </section>
  )
}
