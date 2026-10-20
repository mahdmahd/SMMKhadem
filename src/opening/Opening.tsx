import { useEffect, useLayoutEffect, useRef } from 'react'
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion'

import { prefersReducedMotion } from '../components/motion'
import { opening } from '../data/portfolio'
import { drawDotWord } from './dotWord'
import type { PointField } from './PointField'
import { scrollToMorph, STAGE_COUNT } from './stage'

/** sessionStorage key: the intro plays once per browser session. */
export const OPENING_STORAGE_KEY = 'opening-played'

const [WORD_A, WORD_B] = opening.words
const POWER3_IN_OUT = [0.65, 0, 0.35, 1] as const
const POWER3_OUT = [0.215, 0.61, 0.355, 1] as const

/** The letter swap: the first `k` letters are already the new word. */
export function swapLetters(from: string, to: string, k: number): string {
  const length = Math.max(from.length, to.length)
  let out = ''
  for (let r = 0; r < length; r++) out += r < k ? (to[r] ?? '') : (from[r] ?? '')
  return out
}

function introAlreadyPlayed(): boolean {
  try {
    return window.sessionStorage.getItem(OPENING_STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function markIntroPlayed() {
  try {
    window.sessionStorage.setItem(OPENING_STORAGE_KEY, '1')
  } catch {
    // Storage blocked: the intro simply plays again next visit.
  }
}

/** Captions for the scroll part: the portrait's at the top, the brain's at the end. */
function Caption({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const brain = index === STAGE_COUNT - 1
  const opacity = useTransform(
    progress,
    // Offsets must stay in [0, 1] and non-decreasing (native ScrollTimeline).
    brain ? [0.55, 0.7, 1, 1] : [0, 0, 0.3, 0.45],
    brain ? [0, 1, 1, 1] : [1, 1, 1, 0],
  )
  const y = useTransform(opacity, [0, 1], [16, 0])
  const stage = opening.stages[index]

  return (
    <motion.div className="opening__caption" style={{ opacity, y }}>
      <span className="eyebrow">{stage.eyebrow}</span>
      <p>{stage.line}</p>
    </motion.div>
  )
}

/**
 * The homepage opening. An automatic intro (the name drawn in dots, made
 * solid, letter-swapped to the full name, then settled and split while the
 * stars assemble into the portrait), after which scroll morphs the portrait's
 * own dots into a brain.
 *
 * The stage number the point field reads is `intro + scroll`: the intro
 * animates 0 → 1 on its own while scrolling is locked, then scroll adds the
 * portrait → brain morph. Nothing here re-renders on scroll; motion values are
 * read in the frame loop and HUD text is written to the DOM directly.
 */
export default function Opening() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLOListElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const leftRef = useRef<HTMLSpanElement>(null)
  const rightRef = useRef<HTMLSpanElement>(null)
  const dotsRef = useRef<HTMLCanvasElement>(null)
  const roleRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const hintRef = useRef<HTMLDivElement>(null)
  const captionsRef = useRef<HTMLDivElement>(null)
  const skipRef = useRef<HTMLButtonElement>(null)

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  // The intro's share of the stage: 0 = starfield, 1 = portrait assembled.
  const introStage = useMotionValue(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // three.js arrives in its own chunk, only on the page that draws dots.
    let field: PointField | null = null
    let cancelled = false
    void import('./PointField').then(({ PointField: Field }) => {
      if (cancelled) return
      try {
        field = new Field(canvas, {
          getStage: () => introStage.get() + scrollToMorph(scrollYProgress.get()),
          avatarUrl: opening.avatarUrl,
          brainUrl: opening.brainUrl,
          reducedMotion: prefersReducedMotion(),
        })
        void field.init()
      } catch {
        // No WebGL (old browser, test DOM): the page works without the dots.
      }
    })

    return () => {
      cancelled = true
      field?.dispose()
    }
  }, [scrollYProgress, introStage])

  // The automatic intro: dots → solid → letter swap → settle & split. A layout
  // effect, so the start state (first word, hidden heading) lands before the
  // first paint instead of flashing the finished name for a frame.
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const heading = headingRef.current
    const left = leftRef.current
    const right = rightRef.current
    const dots = dotsRef.current
    const role = roleRef.current
    const actions = actionsRef.current
    const hint = hintRef.current
    const captions = captionsRef.current
    const skip = skipRef.current
    if (!wrap || !heading || !left || !right || !dots || !role || !actions || !hint || !captions || !skip) {
      return
    }

    const abort = new AbortController()
    const controls: { stop: () => void }[] = []
    let swapTimer = 0
    const root = document.documentElement
    const previousOverflow = root.style.overflow

    const setWord = (text: string) => {
      left.textContent = text.slice(0, opening.splitAt)
      right.textContent = text.slice(opening.splitAt)
    }
    const isMobile = window.innerWidth < 768
    const spread = isMobile ? window.innerWidth * 0.12 : Math.min(220, window.innerWidth * 0.14)
    const settledTop = isMobile ? '20%' : '74%'
    const unlock = () => {
      root.style.overflow = previousOverflow
    }

    /** The finished state, for reduced motion, a replay, or a skip. */
    const settle = () => {
      abort.abort()
      clearInterval(swapTimer)
      controls.forEach((control) => control.stop())
      setWord(WORD_B)
      wrap.style.top = settledTop
      left.style.transform = `translateX(${-spread / 2}px)`
      right.style.transform = `translateX(${spread / 2}px)`
      dots.style.opacity = '0'
      heading.style.opacity = '1'
      for (const el of [role, actions, hint, captions]) {
        el.style.opacity = '1'
        el.style.transform = 'none'
      }
      skip.hidden = true
      introStage.set(1)
      markIntroPlayed()
      unlock()
    }

    // A deep link to a section (`/#projects`, a "back to projects" link) must
    // land on that section, not be pulled to the top for the intro.
    if (prefersReducedMotion() || introAlreadyPlayed() || window.location.hash) {
      settle()
      return
    }

    // Lock scrolling while it plays, from the top of the page.
    window.scrollTo(0, 0)
    root.style.overflow = 'hidden'
    setWord(WORD_A)
    heading.style.opacity = '0'
    for (const el of [role, actions, hint, captions]) el.style.opacity = '0'
    skip.hidden = false
    skip.addEventListener('click', settle)

    void (async () => {
      await document.fonts?.ready
      await drawDotWord(dots, heading, 1100, abort.signal)
      if (abort.signal.aborted) return
      // Solid type replaces the dots.
      heading.style.opacity = '1'
      dots.style.opacity = '0'
      await new Promise((resolve) => setTimeout(resolve, 320))
      if (abort.signal.aborted) return

      // Letter swap: a third of a letter every 50 ms.
      await new Promise<void>((resolve) => {
        let i = 0
        const length = Math.max(WORD_A.length, WORD_B.length)
        swapTimer = window.setInterval(() => {
          setWord(swapLetters(WORD_A, WORD_B, Math.floor(i)))
          if (i >= length) {
            clearInterval(swapTimer)
            resolve()
          }
          i += 1 / 3
        }, 50)
      })
      if (abort.signal.aborted) return

      // Settle: glide down, split apart, bring in the role line and actions,
      // and let the stars assemble into the portrait.
      const portrait = animate(introStage, 1, { duration: 2.6, ease: 'easeInOut', delay: 0.3 })
      controls.push(portrait)
      controls.push(animate(wrap, { top: settledTop }, { duration: 1.5, ease: POWER3_IN_OUT, delay: 0.2 }))
      controls.push(animate(left, { x: -spread / 2 }, { duration: 1.5, ease: POWER3_OUT, delay: 0.7 }))
      controls.push(animate(right, { x: spread / 2 }, { duration: 1.5, ease: POWER3_OUT, delay: 0.7 }))
      for (const [k, el] of [role, actions].entries()) {
        controls.push(
          animate(
            el,
            { opacity: [0, 1], y: [50, 0] },
            { duration: 1.2, ease: POWER3_OUT, delay: 0.7 + k * 0.2 },
          ),
        )
      }
      controls.push(animate(captions, { opacity: [0, 1] }, { duration: 0.8, delay: 2.2 }))
      const cue = animate(hint, { opacity: [0, 1] }, { duration: 0.6, delay: 2.4 })
      controls.push(cue)
      await Promise.all([portrait, cue])
      if (abort.signal.aborted) return
      skip.hidden = true
      markIntroPlayed()
      unlock()
    })()

    return () => {
      abort.abort()
      clearInterval(swapTimer)
      controls.forEach((control) => control.stop())
      skip.removeEventListener('click', settle)
      unlock()
    }
  }, [introStage])

  // HUD: written straight to the DOM, so scrolling never re-renders React.
  const updateHud = () => {
    const active = Math.round(introStage.get() + scrollToMorph(scrollYProgress.get()))
    if (readoutRef.current) readoutRef.current.textContent = scrollYProgress.get().toFixed(2)
    if (counterRef.current) counterRef.current.textContent = String(active + 1).padStart(2, '0')
    listRef.current?.querySelectorAll('li').forEach((li, i) => li.classList.toggle('is-active', i === active))
  }
  useMotionValueEvent(scrollYProgress, 'change', updateHud)
  useMotionValueEvent(introStage, 'change', updateHud)

  // The name stays over the portrait and leaves as the brain forms.
  const nameOpacity = useTransform(
    scrollYProgress,
    (p) => 1 - Math.min(Math.max((scrollToMorph(p) - 0.2) / 0.4, 0), 1),
  )
  const hintFade = useTransform(scrollYProgress, [0, 0.06], [1, 0])
  const enterOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1])

  return (
    <section
      ref={sectionRef}
      id="top"
      className="opening"
      aria-label={`${WORD_B}, ${opening.role.bold} ${opening.role.light}`}
    >
      <div className="opening__stage">
        <canvas ref={canvasRef} className="opening__field" aria-hidden="true" />

        <motion.div className="opening__layer" style={{ opacity: nameOpacity }}>
          <div ref={wrapRef} className="opening__wordmark-wrap">
            <h1 ref={headingRef} className="display opening__wordmark" aria-label={WORD_B}>
              <span ref={leftRef} className="opening__half" aria-hidden="true">
                {WORD_B.slice(0, opening.splitAt)}
              </span>
              <span ref={rightRef} className="opening__half" aria-hidden="true">
                {WORD_B.slice(opening.splitAt)}
              </span>
            </h1>
            <canvas ref={dotsRef} className="opening__dots" aria-hidden="true" />
            <p ref={roleRef} className="opening__role">
              <b>{opening.role.bold}</b> <i>{opening.role.light}</i>
            </p>
            <div ref={actionsRef} className="opening__actions">
              <a className="pill pill--ghost opening__round" href="#about" aria-label="Scroll to about">
                <span aria-hidden="true">↙</span>
              </a>
              <a className="pill pill--ghost" href="/#contact">
                Contact
              </a>
            </div>
          </div>
        </motion.div>

        <div ref={captionsRef} className="opening__captions">
          {opening.stages.slice(1).map((stage, i) => (
            <Caption key={stage.label} progress={scrollYProgress} index={i + 1} />
          ))}
        </div>

        <ol ref={listRef} className="eyebrow opening__stages" aria-hidden="true">
          {opening.stages.map((stage, i) => (
            <li key={stage.label} className={i === 0 ? 'is-active' : ''}>
              {String(i + 1).padStart(2, '0')} {stage.label}
            </li>
          ))}
        </ol>

        <div className="eyebrow opening__hud" aria-hidden="true">
          <span>
            <span ref={counterRef}>01</span> / {String(STAGE_COUNT).padStart(2, '0')}
          </span>
          <span className="opening__rule" />
          <span>
            Scroll = morph · P <span ref={readoutRef}>0.00</span>
          </span>
        </div>

        <motion.div className="opening__hint-wrap" style={{ opacity: hintFade }} aria-hidden="true">
          <div ref={hintRef} className="eyebrow opening__hint">
            ↓ Scroll
          </div>
        </motion.div>

        <motion.a className="pill opening__enter" href="#about" style={{ opacity: enterOpacity }}>
          Enter ↘
        </motion.a>

        <button ref={skipRef} type="button" className="pill pill--ghost opening__skip" hidden>
          Skip
        </button>
      </div>
    </section>
  )
}
