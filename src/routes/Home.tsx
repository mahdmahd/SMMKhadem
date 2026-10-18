import Reveal from '../components/Reveal'

/**
 * Home stub — Task 2 only ships the section anchors the header nav targets.
 * Tasks 4–7 fill these with Hero, About, Toolkit, Research, Projects,
 * Publications, Blog and Contact blocks.
 */
const HOME_SECTIONS = [
  { id: 'research', label: 'Research' },
  { id: 'projects', label: 'Projects' },
  { id: 'publications', label: 'Publications' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

export default function Home() {
  return (
    <>
      {HOME_SECTIONS.map((section, index) => (
        <section key={section.id} id={section.id} className="shell section">
          <Reveal delay={index * 40}>
            <p className="eyebrow">{section.label}</p>
            <p className="section__placeholder">
              {section.label} content lands in a later task.
            </p>
          </Reveal>
        </section>
      ))}
    </>
  )
}
