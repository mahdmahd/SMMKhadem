import AboutStory from '../content/about.mdx'

/**
 * `/about` — the full long-form story, not the condensed homepage bio.
 *
 * The body is the owner's `content/about.md`, carried into MDX byte-identical
 * after its Hugo frontmatter (`docs/superpowers/specs/content-backup/about.md`,
 * asserted in `src/data/portfolio.test.ts`), so the sections he wrote — About
 * Me, My Story, Interests, Work Experience, Education, Let's Connect — all
 * survive. Only the framing chrome is new.
 */
export default function AboutPage() {
  return (
    <article id="about" className="shell section about-page">
      <p className="eyebrow">About</p>
      <h1 className="display about-page__title">About</h1>

      <div className="prose">
        <AboutStory />
      </div>
    </article>
  )
}
