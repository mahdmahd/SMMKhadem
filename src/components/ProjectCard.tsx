import { Link } from 'react-router'

import type { Project } from '../data/portfolio'
import ProjectActions from './ProjectActions'
import ProjectHighlights from './ProjectHighlights'

export type ProjectCardProps = {
  project: Project
  /** Side the figure sits on at wide widths. The section alternates it. */
  imageSide?: 'left' | 'right'
}

/**
 * Splits a case-study title into the bold-caps lead and the italic-soft
 * remainder. The split is presentation only: `lead + ' ' + rest` reproduces the
 * title exactly, so the full title survives in the DOM and in search.
 */
export function splitTitle(title: string): [string, string] {
  const space = title.indexOf(' ')

  if (space !== -1) return [title.slice(0, space), title.slice(space + 1)]

  return [title, '']
}

/**
 * Featured case-study card: number and venue, mixed-case title, summary, the
 * headline numbers, his role, the verified Paper/Code/Demo buttons that exist,
 * and a link to the full-prose route.
 */
export default function ProjectCard({ project, imageSide = 'right' }: ProjectCardProps) {
  const [lead, rest] = splitTitle(project.title)
  const classes = [
    'project-card',
    `project-card--image-${imageSide}`,
    project.image ? '' : 'project-card--no-image',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <article className={classes}>
      <div className="project-card__body">
        <p className="eyebrow project-card__index">
          {project.index}
          {project.venue && <span className="project-card__venue"> · {project.venue}</span>}
        </p>

        <h3 className="project-card__title">
          <span className="project-card__title-lead">{lead}</span>{' '}
          <span className="project-card__title-soft">{rest}</span>
        </h3>

        <p className="project-card__summary">{project.summary}</p>

        <ProjectHighlights highlights={project.highlights} />

        {project.role && <p className="project-card__role">{project.role}</p>}

        <div className="project-card__actions">
          <ProjectActions project={project} />

          <Link className="pill" to={`/projects/${project.slug}`}>
            Read more
            {/* Four cards share the visible label, so the link name has to come
                from somewhere else: the project itself. Screen readers then
                announce four different links instead of four "Read more"s, and
                the crawler-facing text stops being generic. */}
            <span className="sr-only"> about {project.title}</span>
          </Link>
        </div>
      </div>

      {project.image && (
        <div className="project-card__figure">
          <img src={project.image} alt={project.imageAlt} loading="lazy" />
        </div>
      )}
    </article>
  )
}
