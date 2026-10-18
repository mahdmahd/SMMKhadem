import { Link } from 'react-router'

import type { Project } from '../data/portfolio'

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
 * Featured case-study card: number, mixed-case title, summary, the verified
 * Paper/Code/Demo buttons that exist, and a link to the full-prose route.
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
        <p className="eyebrow project-card__index">{project.index}</p>

        <h3 className="project-card__title">
          <span className="project-card__title-lead">{lead}</span>{' '}
          <span className="project-card__title-soft">{rest}</span>
        </h3>

        <p className="project-card__summary">{project.summary}</p>

        <div className="project-card__actions">
          {project.paperUrl && (
            <a
              className="pill pill--ghost"
              href={project.paperUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Paper <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.codeUrl && (
            <a
              className="pill pill--ghost"
              href={project.codeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Code <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              className="pill pill--ghost"
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Demo <span aria-hidden="true">↗</span>
            </a>
          )}

          <Link className="pill" to={`/projects/${project.slug}`}>
            Read more
          </Link>
        </div>
      </div>

      {project.image && (
        <div className="project-card__figure">
          {/* Decorative: the card already names and summarizes the project. */}
          <img src={project.image} alt="" loading="lazy" />
        </div>
      )}
    </article>
  )
}
