import { useState } from 'react'

import Intro, { shouldPlayIntro } from '../components/Intro'
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
 *
 * The opening sequence is mounted above them, not instead of them: the page
 * underneath is fully rendered and ready to scroll the moment the curtain
 * lifts. It is a sibling rather than a wrapper so that nothing about the
 * sections depends on it.
 *
 * While the curtain is down the sections are `inert`: they are behind an opaque
 * overlay, so leaving them in the tab order would walk a keyboard user through
 * links they cannot see. `inert` also takes them out of the accessibility tree,
 * which is the same statement.
 */
export default function Home() {
  const [intro, setIntro] = useState(shouldPlayIntro)

  return (
    <>
      {intro ? <Intro onDone={() => setIntro(false)} /> : null}
      <div inert={intro}>
        <Hero />
        <About />
        <Toolkit />
        <Research />
        <Projects />
        <Publications />
        <Teaching />
        <LatestWriting />
        <Contact />
      </div>
    </>
  )
}
