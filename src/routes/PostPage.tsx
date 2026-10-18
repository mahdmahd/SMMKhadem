import { useParams } from 'react-router'

/**
 * Post stub — Task 7 renders the MDX body for this slug. The route pattern
 * (`/posts/:slug`, legacy trailing slash included) is the load-bearing part.
 */
export default function PostPage() {
  const { slug } = useParams()

  return (
    <article className="container section">
      <p className="eyebrow">Post</p>
      <h1 className="display">{slug}</h1>
      <p className="section__placeholder">Post body lands in a later task.</p>
    </article>
  )
}
