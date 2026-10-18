import type { Project } from '../data/portfolio'

export type ProjectActionsProps = {
  project: Project
}

/**
 * The verified-link row shared by the case-study card and the detail route.
 * Renders a fragment so each caller keeps its own wrapper (and its own spacing
 * class): a button exists only when the project carries that URL, and a project
 * with no verified links contributes nothing at all.
 */
export default function ProjectActions({ project }: ProjectActionsProps) {
  return (
    <>
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
    </>
  )
}
