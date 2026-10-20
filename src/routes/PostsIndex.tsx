import { Link } from 'react-router'

import Reveal from '../components/Reveal'
import { formatPostDate, posts } from '../data/portfolio'
import { usePageTitle } from '../hooks/usePageTitle'

/**
 * `/posts` — the full index, newest first. Same card grammar as the homepage
 * teaser, so the two never read as different collections; the homepage just
 * shows the first three.
 */
export default function PostsIndex() {
  usePageTitle('Writing — Mahdi Khadem')

  return (
    <section id="posts" className="shell section posts-index">
      <Reveal>
        <p className="eyebrow">Blog</p>
        <h1 className="display posts-index__title">Writing</h1>
        <p className="posts-index__lead">
          My personal thoughts and insights on AI, technology, neuroimaging, medicine, and more.
        </p>
      </Reveal>

      <ul className="writing__grid writing__grid--index">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Reveal delay={index * 40}>
              <article className="post-card">
                <time className="post-card__date" dateTime={post.date}>
                  {formatPostDate(post.date)}
                </time>

                <h2 className="post-card__title">
                  <Link className="post-card__link" to={`/posts/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="post-card__summary">{post.description}</p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
