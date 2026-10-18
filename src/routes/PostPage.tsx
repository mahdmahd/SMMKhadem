import { lazy, Suspense, type ComponentType } from 'react'
import { Link, useParams } from 'react-router'

import { formatPostDate, posts } from '../data/portfolio'
import NotFound from './NotFound'

/**
 * Slug → body, as a static map of lazy imports.
 *
 * Static so the bundler can see all four targets and code-split them (each post
 * is its own chunk, loaded only when its route is opened); lazy so the index
 * page does not carry every body. The map is also the route's own guard: an
 * unknown slug has no entry and falls through to NotFound.
 */
const BODIES: Record<string, ComponentType> = {
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
 */
export default function PostPage() {
  const { slug } = useParams()
  const post = posts.find((entry) => entry.slug === slug)
  const Body = slug ? BODIES[slug] : undefined

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
