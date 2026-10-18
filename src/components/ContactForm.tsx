export type ContactFormProps = {
  /** Formspree endpoint, or `null` when the endpoint was verified dead. */
  action: string | null
  /** Address the fallback call to action writes to. */
  email: string
}

/**
 * The contact form, in both of its lives.
 *
 * The endpoint is verified by hand (see `formAction` in `src/data/portfolio.ts`)
 * and the branch is a prop rather than a runtime fetch, so the fallback is a
 * real, testable render path: when `action` is `null` the page shows a `mailto:`
 * call to action instead of a form that would swallow submissions.
 */
export default function ContactForm({ action, email }: ContactFormProps) {
  if (!action) {
    return (
      <div className="contact-form contact-form--fallback">
        <p className="contact-form__lead">
          The message form is offline. Email works exactly as well — it reaches the same inbox.
        </p>
        <p>
          <a className="pill" href={`mailto:${email}`}>
            Email {email}
          </a>
        </p>
      </div>
    )
  }

  return (
    <form className="contact-form" action={action} method="post">
      <div className="contact-form__fields">
        <label className="field">
          <span className="eyebrow field__label">Name</span>
          <input className="field__input" type="text" name="name" autoComplete="name" required />
        </label>

        <label className="field">
          <span className="eyebrow field__label">Email</span>
          <input
            className="field__input"
            type="email"
            name="email"
            autoComplete="email"
            required
          />
        </label>

        <label className="field field--wide">
          <span className="eyebrow field__label">Message</span>
          <textarea className="field__input" name="message" rows={5} required />
        </label>
      </div>

      <button className="pill" type="submit">
        Send message
      </button>
    </form>
  )
}
