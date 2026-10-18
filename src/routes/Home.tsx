import Reveal from '../components/Reveal'
import About from '../sections/About'
import Hero from '../sections/Hero'
import Toolkit from '../sections/Toolkit'

/**
 * Home — Tasks 4–7 fill the blocks in spec order. Hero, About and Toolkit ship
 * here; the remaining anchors still hold the Task 2 stubs, so the header nav
 * targets stay live while those tasks land.
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
      <Hero />
      <About />
      <Toolkit />

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
