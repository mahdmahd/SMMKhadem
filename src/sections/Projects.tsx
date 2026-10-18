import { Link } from 'react-router'

import ProjectCard from '../components/ProjectCard'
import Reveal from '../components/Reveal'
import { allProjects, featuredProjects } from '../data/portfolio'

/**
 * "Selected work": four alternating case-study cards, then the archive grid of
 * the remaining projects. Both lists link to the `/projects/:slug` routes.
 */
export default function Projects() {
  return (
    <section id="projects" className="shell section">
      <Reveal>
        <h2 className="eyebrow">Selected work</h2>
      </Reveal>

      <div className="projects__featured">
        {featuredProjects.map((project, index) => (
          <Reveal key={project.slug} delay={index * 40}>
            <ProjectCard project={project} imageSide={index % 2 === 0 ? 'right' : 'left'} />
          </Reveal>
        ))}
      </div>

      <Reveal className="projects__archive" delay={80}>
        <h3 className="eyebrow">Archive</h3>

        <ul className="archive">
          {allProjects.map((project) => (
            <li key={project.slug} className="archive__item">
              <Link className="archive__link" to={`/projects/${project.slug}`}>
                <span className="archive__meta">
                  <span className="archive__index">{project.index}</span>
                  {project.year && <span className="archive__year">{project.year}</span>}
                </span>
                <span className="archive__title">{project.title}</span>
                <span className="archive__summary">{project.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
