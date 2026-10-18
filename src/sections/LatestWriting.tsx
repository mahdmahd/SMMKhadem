import { Link } from 'react-router'

import Reveal from '../components/Reveal'
import { formatPostDate, posts } from '../data/portfolio'

/** How many of the newest posts the homepage teases before the index. */
const TEASER_COUNT = 3

/**
 * "Writing": the three newest posts as cards, then a link to the full index.
 * `posts` is stored newest-first, so the teaser is a slice, not a sort — the
 * order can only be wrong in one place.
 */
export default function LatestWriting() {
  const latest = posts.slice(0, TEASER_COUNT)

  return (
    <section id="blog" className="shell section">
      <Reveal>
        <h2 className="eyebrow">Writing</h2>
        <p className="writing__lead">
          Notes from the desk — statistics, clinical data, and the occasional statistical
          tragedy.
        </p>
      </Reveal>

      <div className="writing__grid">
        {latest.map((post, index) => (
          <Reveal key={post.slug} delay={index * 40}>
            <article className="post-card">
              <time className="post-card__date" dateTime={post.date}>
                {formatPostDate(post.date)}
              </time>

              <h3 className="post-card__title">
                <Link className="post-card__link" to={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              <p className="post-card__summary">{post.description}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="writing__actions" delay={120}>
        <Link className="pill pill--ghost" to="/posts">
          All posts
        </Link>
      </Reveal>
    </section>
  )
}
