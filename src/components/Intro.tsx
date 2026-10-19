import gsap from 'gsap'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

import portrait from '../assets/mehdi-portrait.jpg'
import ConnectomeBrain from './ConnectomeBrain'
import { canDetectMotionPreference, prefersReducedMotion } from './motion'

/** sessionStorage key: the sequence plays once per browser session. */
export const INTRO_STORAGE_KEY = 'intro-played'

/**
 * Absolute positions on the master timeline, in seconds. Every tween is placed
 * rather than chained so the sequence has a fixed length no matter how many
 * stages it grows: the last position plus the curtain is the whole runtime.
 */
const TIMING = {
  name: 0,
  bang: 0.3,
  nameOut: 0.95,
  greeting: 1.15,
  greetingOut: 1.75,
  photo: 1.95,
  // Late enough to hold the finished print for a beat, early enough to
  // cross-fade with the connectome rather than cut to it.
  photoOut: 3.15,
  brain: 3.2,
  brainOut: 4.5,
  curtain: 5.0,
} as const

const CURTAIN_SECONDS = 0.5

/** Total runtime of the sequence. The owner's ceiling is 5.5s. */
export const INTRO_TOTAL_SECONDS = TIMING.curtain + CURTAIN_SECONDS

/**
 * The overlay must never outlive its own animation, so a watchdog tears it down
 * even if the ticker stalls (a throttled tab, a thrown tween). The margin is
 * what a viewer would not notice missing; without it a stalled timeline would
 * leave the site behind a curtain forever.
 */
const WATCHDOG_SECONDS = INTRO_TOTAL_SECONDS + 1.5

export type IntroProps = {
  /** Called once, after the curtain lifts or the viewer skips. */
  onDone?: () => void
}

/**
 * Whether the opening sequence should play at all.
 *
 * Three ways to say no. The session already played it. The viewer asked for
 * less motion. Or the DOM cannot report a motion preference at all — in which
 * case a five-second takeover could not be turned off, so it does not run.
 */
export function shouldPlayIntro(): boolean {
  if (!canDetectMotionPreference() || prefersReducedMotion()) return false

  try {
    return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== '1'
  } catch {
    // Storage blocked (private mode, an embedded frame): treat it as already
    // played, rather than replaying the takeover on every visit.
    return false
  }
}

/**
 * The opening sequence: the name, the greeting, the portrait, the connectome,
 * then the curtain. Renders nothing — and schedules nothing — when
 * `shouldPlayIntro()` says no, which is why the check happens before any hook.
 */
export default function Intro({ onDone }: IntroProps) {
  if (!shouldPlayIntro()) return null

  return <IntroSequence onDone={onDone} />
}

function IntroSequence({ onDone }: IntroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const finishedRef = useRef(false)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  const finish = useCallback(() => {
    if (finishedRef.current) return

    finishedRef.current = true

    try {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1')
    } catch {
      // Storage blocked: the sequence simply plays again next visit.
    }

    onDoneRef.current?.()
  }, [])

  // A layout effect, not an effect: the timeline applies every "from" value
  // synchronously, and that has to happen before the browser paints the
  // overlay. Otherwise the first frame shows the whole sequence at rest.
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    // The page behind the overlay must not scroll while the curtain is down.
    const { documentElement } = document
    const previousOverflow = documentElement.style.overflow
    documentElement.style.overflow = 'hidden'

    const timeline = buildIntroTimeline(root, finish)
    timelineRef.current = timeline

    const watchdog = window.setTimeout(finish, WATCHDOG_SECONDS * 1000)

    return () => {
      window.clearTimeout(watchdog)
      timeline.kill()
      timelineRef.current = null
      documentElement.style.overflow = previousOverflow
    }
  }, [finish])

  const skip = useCallback(() => {
    // Jump the playhead to the end, then finish explicitly: whether seeking
    // fires onComplete is an implementation detail, and `finish` is idempotent.
    timelineRef.current?.progress(1)
    finish()
  }, [finish])

  return (
    // Click anywhere to skip. The button below is the control assistive tech
    // reaches; the div handler is the shortcut for everyone else.
    <div ref={rootRef} className="intro" onClick={skip}>
      <div className="intro__stage intro__stage--name" data-intro="stage-1">
        <span className="intro__mask">
          <span className="intro__word display" data-intro="name" aria-hidden="true">
            Mehdi
          </span>
        </span>
        <span className="intro__bang display" data-intro="bang" aria-hidden="true">
          !
        </span>
      </div>

      <div className="intro__stage" data-intro="stage-2">
        <span className="intro__mask">
          <span className="intro__word display" data-intro="greeting" aria-hidden="true">
            Homepage
          </span>
        </span>
      </div>

      <div className="intro__stage" data-intro="stage-3">
        <div className="intro__photo" data-intro="photo">
          <img
            className="intro__photo-img"
            data-intro="photo-img"
            src={portrait}
            alt=""
            width={266}
            height={266}
          />
        </div>
      </div>

      <div className="intro__stage intro__stage--brain" data-intro="stage-4">
        <div className="intro__brain" data-intro="brain">
          <ConnectomeBrain />
        </div>
      </div>

      <button type="button" className="pill pill--ghost intro__skip">
        Skip
      </button>
    </div>
  )
}

/**
 * The master timeline. Exported so its length is testable: the ≤5.5s budget is
 * a requirement, not a comment.
 */
export function buildIntroTimeline(root: HTMLElement, onComplete: () => void): gsap.core.Timeline {
  const target = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, root)

  const stageOne = target('[data-intro="stage-1"]')
  const name = target('[data-intro="name"]')
  const bang = target('[data-intro="bang"]')
  const stageTwo = target('[data-intro="stage-2"]')
  const greeting = target('[data-intro="greeting"]')
  const stageThree = target('[data-intro="stage-3"]')
  const photo = target('[data-intro="photo"]')
  const photoImage = target('[data-intro="photo-img"]')
  const stageFour = target('[data-intro="stage-4"]')
  const brain = target('[data-intro="brain"]')

  const timeline = gsap.timeline({ defaults: { ease: 'expo.out' }, onComplete })

  timeline
    // Stage 1 — the name rises out of its mask, then the "!" lands behind it.
    .fromTo(stageOne, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: 'none' }, TIMING.name)
    .fromTo(name, { yPercent: 115 }, { yPercent: 0, duration: 0.8, stagger: 0.08 }, TIMING.name)
    .fromTo(
      bang,
      { autoAlpha: 0, yPercent: 55, scale: 0.4 },
      { autoAlpha: 1, yPercent: 0, scale: 1, duration: 0.6, ease: 'back.out(2.2)' },
      TIMING.bang,
    )
    .to(stageOne, { autoAlpha: 0, yPercent: -18, duration: 0.35, ease: 'power2.in' }, TIMING.nameOut)

    // Stage 2 — the same reveal, once.
    .fromTo(
      stageTwo,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2, ease: 'none' },
      TIMING.greeting,
    )
    .fromTo(
      greeting,
      { yPercent: 115 },
      { yPercent: 0, duration: 0.7, stagger: 0.08 },
      TIMING.greeting,
    )
    .to(
      stageTwo,
      { autoAlpha: 0, yPercent: -18, duration: 0.3, ease: 'power2.in' },
      TIMING.greetingOut,
    )

    // Stage 3 — the portrait, wiped open from the bottom, the print settling
    // back from 1.3x as it lands.
    .fromTo(
      stageThree,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.15, ease: 'none' },
      TIMING.photo,
    )
    .fromTo(
      photo,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.85, ease: 'expo.inOut' },
      TIMING.photo,
    )
    .fromTo(photoImage, { scale: 1.3 }, { scale: 1, duration: 1.15 }, TIMING.photo)
    .to(photo, { autoAlpha: 0, scale: 0.97, duration: 0.35, ease: 'power2.in' }, TIMING.photoOut)

    // Stage 4 — the connectome tilts in and breathes.
    .fromTo(
      stageFour,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.15, ease: 'none' },
      TIMING.brain,
    )
    .fromTo(
      brain,
      { autoAlpha: 0, scale: 0.86 },
      { autoAlpha: 1, scale: 1, duration: 0.6 },
      TIMING.brain,
    )
    .fromTo(
      brain,
      { rotationY: 16, rotationX: -7 },
      { rotationY: 4, rotationX: -3, duration: 0.95, ease: 'sine.inOut', yoyo: true, repeat: 1 },
      TIMING.brain,
    )
    .to(brain, { autoAlpha: 0, scale: 1.22, duration: 0.5, ease: 'power2.in' }, TIMING.brainOut)

    // Exit — the curtain lifts off the page.
    .to(
      root,
      { clipPath: 'inset(0% 0% 100% 0%)', duration: CURTAIN_SECONDS, ease: 'expo.inOut' },
      TIMING.curtain,
    )
    .set(root, { autoAlpha: 0 }, INTRO_TOTAL_SECONDS)

  return timeline
}
