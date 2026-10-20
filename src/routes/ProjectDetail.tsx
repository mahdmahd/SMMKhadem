import { Link, useParams } from 'react-router'

import ProjectActions from '../components/ProjectActions'
import ProjectHighlights from '../components/ProjectHighlights'
import { allProjects, featuredProjects } from '../data/portfolio'
import { usePageTitle } from '../hooks/usePageTitle'
import NotFound from './NotFound'

/**
 * Featured and archived projects in one lookup. Both arrays carry the same
 * shape, and the featured entries are also archived in spirit — the route does
 * not care which list a slug came from.
 */
const projects = [...featuredProjects, ...allProjects]

/**
 * Full-prose case study. The Overview and Project Details text is carried
 * verbatim from `docs/superpowers/specs/content-backup/projects/` (frontmatter
 * and `<!--more-->` stripped); Paper/Code/Demo render only when the data holds
 * a verified URL. An unknown slug falls through to the 404 page.
 */
export default function ProjectDetail() {
  const { slug } = useParams()
  const project = projects.find((entry) => entry.slug === slug)

  // Called before the guard so the hook order is stable; an unknown slug passes
  // null and leaves the document title alone.
  usePageTitle(project ? `${project.title} — Mahdi Khadem` : null)

  if (!project) return <NotFound />


  return (
    <article className="shell section project-detail">
      <p className="eyebrow">
        Project · {project.index}
        {project.year ? ` · ${project.year}` : ''}
      </p>

      <h1 className="display project-detail__title">{project.title}</h1>

      {(project.venue || project.role) && (
        <p className="project-detail__role">{[project.venue, project.role].filter(Boolean).join(' · ')}</p>
      )}

      <ProjectHighlights highlights={project.highlights} />

      {project.technologies && project.technologies.length > 0 && (
        <ul className="project-detail__tech" aria-label="Methods and tools">
          {project.technologies.map((technology) => (
            <li key={technology} className="eyebrow chip">
              {technology}
            </li>
          ))}
        </ul>
      )}

      {project.image && (
        <div className="project-detail__figure">
          <img src={project.image} alt={project.imageAlt} />
        </div>
      )}

      <div className="project-detail__actions">
        <ProjectActions project={project} />
      </div>

      {project.overview && (
        <section className="project-detail__section">
          <h2 className="project-detail__heading">Overview</h2>
          <p className="project-detail__paragraph">{project.overview}</p>
        </section>
      )}

      {project.details && project.details.length > 0 && (
        <section className="project-detail__section">
          <h2 className="project-detail__heading">Project Details</h2>
          {project.details.map((paragraph, index) => (
            // The backup is the source of truth and has no stable keys; the
            // paragraphs never reorder at runtime.
            <p key={index} className="project-detail__paragraph">
              {paragraph}
            </p>
          ))}
        </section>
      )}

      <p className="project-detail__back">
        <Link className="pill pill--ghost" to="/#projects">
          ← Back to projects
        </Link>
      </p>
    </article>
  )
}
