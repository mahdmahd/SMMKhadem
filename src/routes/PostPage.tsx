import { lazy, Suspense, type ComponentType } from 'react'
import { Link, useParams } from 'react-router'

import { formatPostDate, posts } from '../data/portfolio'
import NotFound from './NotFound'

/**
 * Frozen legacy slugs — the Hugo filenames the site served before the
 * redesign (`/posts/mem1/`, `/posts/hugo/`, `/posts/pitfall/`,
 * `/posts/voiceless/`). Inbound links and citations point at these, so they
 * resolve to the canonical post instead of the 404 page. Keys are the old
 * slugs, values the canonical kebab-cased ones; nothing here is a route of its
 * own, so there is still exactly one URL per post.
 */
const LEGACY_SLUGS: Record<string, string> = {
  mem1: 'a-tragedy-part-1',
  hugo: 'how-to-build-a-hugo-site',
  pitfall: 'my-linear-model-thinks-getting-older-makes-you-poorer-and-other-statistical-tragedies',
  voiceless: 'a-greeting-from-the-depths-of-the-voiceless',
}

/**
 * Canonical slug → body, as a static map of lazy imports.
 *
 * Static so the bundler can see all four targets and code-split them (each post
 * is its own chunk, loaded only when its route is opened); lazy so the index
 * page does not carry every body. The map is also the route's own guard: an
 * unknown slug has no entry and falls through to NotFound. Exported so a test
 * can pin it against the `posts` array — a post added to one and not the other
 * would otherwise 404 silently.
 */
export const POST_BODIES: Record<string, ComponentType> = {
  'how-to-build-a-hugo-site': lazy(
    () => import('../content/posts/how-to-build-a-hugo-site.mdx'),
  ),
  'a-tragedy-part-1': lazy(() => import('../content/posts/a-tragedy-part-1.mdx')),
  'my-linear-model-thinks-getting-older-makes-you-poorer-and-other-statistical-tragedies': lazy(
    () =>
      import(
        '../content/posts/my-linear-model-thinks-getting-older-makes-you-poorer-and-other-statistical-tragedies.mdx'
      ),
  ),
  'a-greeting-from-the-depths-of-the-voiceless': lazy(
    () => import('../content/posts/a-greeting-from-the-depths-of-the-voiceless.mdx'),
  ),
}

/**
 * A single post. Title and date are page chrome from the data model — the MDX
 * file holds the prose and nothing else, so the body stays byte-identical to
 * the Hugo original.
 *
 * The alias resolves before either lookup, so both the metadata and the body
 * come from the canonical slug; a legacy URL renders the post, not a variant.
 */
export default function PostPage() {
  const { slug } = useParams()
  const canonical = slug ? (LEGACY_SLUGS[slug] ?? slug) : undefined
  const post = posts.find((entry) => entry.slug === canonical)
  const Body = canonical ? POST_BODIES[canonical] : undefined

  if (!post || !Body) return <NotFound />

  return (
    <article className="shell section post">
      <p className="eyebrow">Writing</p>

      <h1 className="display post__title">{post.title}</h1>

      <p className="post__meta">
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </p>

      <div className="prose">
        <Suspense fallback={<p className="post__loading">Loading the post…</p>}>
          <Body />
        </Suspense>
      </div>

      <p className="post__back">
        <Link className="pill pill--ghost" to="/posts">
          ← All writing
        </Link>
      </p>
    </article>
  )
}
