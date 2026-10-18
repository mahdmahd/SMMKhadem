import About from '../sections/About'
import Contact from '../sections/Contact'
import Hero from '../sections/Hero'
import LatestWriting from '../sections/LatestWriting'
import Projects from '../sections/Projects'
import Publications from '../sections/Publications'
import Research from '../sections/Research'
import Teaching from '../sections/Teaching'
import Toolkit from '../sections/Toolkit'

/**
 * Home — the nine blocks of the design spec, in order:
 *
 *   hero → about → toolkit → research → projects → publications → teaching →
 *   writing → contact
 *
 * Eight of the nine carry the anchor the header nav and footer link to, so the
 * order here is also the page's table of contents.
 */
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
      <LatestWriting />
      <Contact />
    </>
  )
}
