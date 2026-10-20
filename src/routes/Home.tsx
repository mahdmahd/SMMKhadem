import { usePageTitle } from '../hooks/usePageTitle'
import Opening from '../opening/Opening'
import About from '../sections/About'
import Contact from '../sections/Contact'
import LatestWriting from '../sections/LatestWriting'
import Projects from '../sections/Projects'
import Publications from '../sections/Publications'
import Research from '../sections/Research'
import Teaching from '../sections/Teaching'
import Toolkit from '../sections/Toolkit'

/**
 * Home — the opening, then the eight blocks of the design spec, in order:
 *
 *   opening → about → toolkit → research → projects → publications →
 *   teaching → writing → contact
 *
 * The opening is the hero: an automatic intro (name, then the portrait in
 * dots) and a scroll-driven morph of the portrait into a brain. It locks
 * scrolling only while its intro plays, once per session; everything below it
 * is ordinary page that scrolls the moment the intro settles.
 */
export default function Home() {
  usePageTitle('Mohammad Mahdi Khadem — M.D. · Medical AI Researcher')

  return (
    <>
      <Opening />
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
