// The stage number shared by the opening's DOM and its point field. Kept apart
// from PointField so the page can use it without loading three.js.

export const STAGE_COUNT = 3 // stars, avatar, brain

/**
 * Stage = intro + scroll. The intro animates 0 → 1 on its own (stars →
 * avatar); scroll (0..1) then adds the avatar → brain morph, holding 15%
 * at each end so both shapes get a rest.
 */
export function scrollToMorph(p: number) {
  const t = Math.min(Math.max((p - 0.15) / 0.7, 0), 1)
  return t * t * (3 - 2 * t)
}
