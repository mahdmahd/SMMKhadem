// When does each point leave its current home? Returns 0..1 per point:
// 0 = leaves first, 1 = leaves last. The shader turns this into the swarm.

/**
 * @param sweep   0..1, the point's horizontal position in the avatar
 * @param random  a stable random number in [0,1) for this point
 */
export function pointDelay(sweep: number, random: number): number {
  // Default: a left-to-right sweep (70%) loosened by per-point jitter (30%),
  // so the column leaves together but individual dots run early or late.
  return sweep * 0.7 + random * 0.3
}
