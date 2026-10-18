import { Link, useParams } from 'react-router'

import ProjectActions from '../components/ProjectActions'
import { allProjects, featuredProjects } from '../data/portfolio'
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

  if (!project) return <NotFound />

  const meta = [project.year, project.technologies?.join(' · ')].filter(Boolean).join(' — ')

  return (
    <article className="shell section project-detail">
      <p className="eyebrow">Project · {project.index}</p>

      <h1 className="display project-detail__title">{project.title}</h1>

      {meta && <p className="project-detail__meta">{meta}</p>}

      {project.image && (
        <div className="project-detail__figure">
          {/* Decorative: the heading and prose carry the meaning. */}
          <img src={project.image} alt="" />
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
