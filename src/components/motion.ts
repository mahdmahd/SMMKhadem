/**
 * Motion-preference helpers.
 *
 * Two different questions live here, and the difference matters:
 *
 * - `prefersReducedMotion()` answers "did the viewer ask for less motion?".
 *   A DOM that cannot answer at all (no `matchMedia`) reports `false`, so
 *   callers that *degrade* a decoration keep working — `Reveal` still shows its
 *   children, `ConnectomeBrain` still draws a still frame.
 * - `canDetectMotionPreference()` answers "could we honour the preference if it
 *   were set?". Callers that would spend seconds of animation on the viewer
 *   (the opening sequence) ask this one too and skip entirely when the answer
 *   is no, because the alternative is a takeover nobody can turn off.
 */

export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

/** True when the environment can report a motion preference at all. */
export function canDetectMotionPreference(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
}

/** True when the viewer asked for less motion. A missing API reports `false`. */
export function prefersReducedMotion(): boolean {
  return canDetectMotionPreference() && window.matchMedia(REDUCED_MOTION_QUERY).matches
}
