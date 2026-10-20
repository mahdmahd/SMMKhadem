// Decide which avatar dot becomes which brain dot.
//
// A radial, monotone pairing: both shapes' lit dots are cut into equal-count
// angular sectors around their centroid, and inside each sector paired from
// the centre outwards. Centre goes to centre, rim to rim, direction to
// direction — so the face swells and reshapes into the brain without
// tearing. Lit pairs with lit; the surplus of the larger shape is born from
// (or folds into) its partner.

import type { Halftone, Vec3Array } from './shapes'

const SECTORS = 64

/** Lit dot indices, ordered sector by sector (by angle), then by radius. */
function litInRadialOrder(shape: Halftone): number[] {
  const lit: number[] = []
  let cx = 0,
    cy = 0
  for (let i = 0; i < shape.tone.length; i++) {
    if (shape.tone[i] <= 0) continue
    lit.push(i)
    cx += shape.points[i * 3]
    cy += shape.points[i * 3 + 1]
  }
  cx /= lit.length || 1
  cy /= lit.length || 1
  const angle = new Map<number, number>()
  const radius = new Map<number, number>()
  for (const i of lit) {
    const dx = shape.points[i * 3] - cx,
      dy = shape.points[i * 3 + 1] - cy
    angle.set(i, Math.atan2(dy, dx))
    radius.set(i, Math.hypot(dx, dy))
  }
  lit.sort((a, b) => angle.get(a)! - angle.get(b)!)
  // Equal-count sectors keep both shapes' ranks aligned sector for sector.
  const sector = new Map<number, number>()
  lit.forEach((i, rank) => sector.set(i, Math.floor((rank * SECTORS) / lit.length)))
  return lit.sort((a, b) => sector.get(a)! - sector.get(b)! || radius.get(a)! - radius.get(b)!)
}

export interface Paired {
  avatar: Vec3Array
  avatarTone: Float32Array
  brain: Vec3Array
  brainTone: Float32Array
  /** 0..1 per slot: the avatar dot's horizontal position (drives the stagger). */
  sweep: Float32Array
}

export function pairShapes(face: Halftone, brain: Halftone, count: number): Paired {
  const F = litInRadialOrder(face)
  const B = litInRadialOrder(brain)
  const out: Paired = {
    avatar: new Float32Array(count * 3),
    avatarTone: new Float32Array(count),
    brain: new Float32Array(count * 3),
    brainTone: new Float32Array(count),
    sweep: new Float32Array(count),
  }
  const copy = (dst: Vec3Array, di: number, src: Vec3Array, si: number) => {
    dst[di * 3] = src[si * 3]
    dst[di * 3 + 1] = src[si * 3 + 1]
    dst[di * 3 + 2] = src[si * 3 + 2]
  }

  // The larger lit set drives; the smaller one is stretched across it. Each
  // partner shows its tone only on its first slot, so the extras start (or
  // end) hidden at the same spot and grow out of it.
  const pairs = Math.min(Math.max(F.length, B.length), count)
  let lastF = -1,
    lastB = -1
  for (let s = 0; s < pairs; s++) {
    const f = F[Math.floor((s * F.length) / pairs)]
    const b = B[Math.floor((s * B.length) / pairs)]
    copy(out.avatar, s, face.points, f)
    copy(out.brain, s, brain.points, b)
    out.avatarTone[s] = f !== lastF ? face.tone[f] : 0
    out.brainTone[s] = b !== lastB ? brain.tone[b] : 0
    lastF = f
    lastB = b
  }
  // Leftover slots are only ever stars: hide them inside both shapes.
  for (let s = pairs; s < count; s++) {
    copy(out.avatar, s, face.points, F[s % F.length])
    copy(out.brain, s, brain.points, B[s % B.length])
  }

  let x0 = Infinity,
    x1 = -Infinity
  for (let s = 0; s < count; s++) {
    x0 = Math.min(x0, out.avatar[s * 3])
    x1 = Math.max(x1, out.avatar[s * 3])
  }
  for (let s = 0; s < count; s++) out.sweep[s] = (out.avatar[s * 3] - x0) / (x1 - x0 || 1)
  return out
}
