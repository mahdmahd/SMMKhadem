import { useParams } from 'react-router'

/**
 * Project detail stub — Task 5 renders the carried-over prose and the
 * conditional Paper/Code/Demo buttons for this slug.
 */
export default function ProjectDetail() {
  const { slug } = useParams()

  return (
    <article className="shell section">
      <p className="eyebrow">Project</p>
      <h1 className="display">{slug}</h1>
      <p className="section__placeholder">Project detail lands in a later task.</p>
    </article>
  )
}
