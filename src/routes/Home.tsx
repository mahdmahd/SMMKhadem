import Reveal from '../components/Reveal'
import About from '../sections/About'
import Hero from '../sections/Hero'
import Projects from '../sections/Projects'
import Publications from '../sections/Publications'
import Research from '../sections/Research'
import Teaching from '../sections/Teaching'
import Toolkit from '../sections/Toolkit'

/**
 * Home — Hero, About, Toolkit, Research, Projects, Publications and Teaching
 * ship here, in spec order. The remaining anchors still hold the Task 2 stubs,
 * so the header nav targets stay live while Task 7 lands.
 */
const HOME_STUBS = [
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
]

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Toolkit />
      <Research />
      <Projects />
      <Publications />
      <Teaching />

      {HOME_STUBS.map((section, index) => (
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
