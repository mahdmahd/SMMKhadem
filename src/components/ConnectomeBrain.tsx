import { useEffect, useRef } from 'react'

import { prefersReducedMotion } from './motion'

export type ConnectomeBrainProps = {
  /** Target number of points sampled inside the silhouette. */
  density?: number
  className?: string
}

/** A point of the connectome, in model space (roughly -1..1 on each axis). */
export type BrainPoint = {
  x: number
  y: number
  z: number
  /** Dot size multiplier, 0..1. */
  size: number
  /** Twinkle phase offset, radians. */
  phase: number
  /** A minority of dots carry a cool tint, to suggest distinct regions. */
  cool: boolean
}

/** Two points close enough in model space to draw a fibre between them. */
export type BrainEdge = { a: number; b: number; weight: number }

export type ConnectomeModel = { points: BrainPoint[]; edges: BrainEdge[] }

/**
 * Cortex outline as a side profile, frontal pole first. Authored by hand: the
 * vault is round, the base is flat, and the front tapers — which is all the
 * silhouette has to carry once it is reduced to dots.
 */
const CORTEX_OUTLINE: readonly (readonly [number, number])[] = [
  [-0.86, 0.1],
  [-0.78, 0.32],
  [-0.55, 0.48],
  [-0.2, 0.56],
  [0.28, 0.54],
  [0.66, 0.36],
  [0.86, 0.06],
  [0.8, -0.2],
  [0.42, -0.34],
  [0, -0.38],
  [-0.44, -0.3],
  [-0.75, -0.16],
  [-0.86, -0.02],
]

/** Cerebellum: the lump tucked under the back of the cortex. */
const CEREBELLUM = { x: 0.6, y: -0.3, rx: 0.26, ry: 0.18 }

/** Brainstem: a short stub angling down and slightly forward. */
const BRAINSTEM_OUTLINE: readonly (readonly [number, number])[] = [
  [0.36, -0.34],
  [0.56, -0.34],
  [0.44, -0.74],
  [0.28, -0.7],
]

/**
 * Functional regions. Points are drawn from these with `CLUSTER_SHARE`
 * probability so the cloud has knots of density instead of reading as an even
 * fog. Positions are inside the hull above.
 */
const CLUSTERS: readonly { x: number; y: number; sigma: number }[] = [
  { x: -0.52, y: 0.08, sigma: 0.16 },
  { x: -0.1, y: 0.34, sigma: 0.15 },
  { x: 0.44, y: 0.3, sigma: 0.16 },
  { x: -0.2, y: -0.22, sigma: 0.14 },
  { x: 0.6, y: -0.28, sigma: 0.12 },
  { x: 0.72, y: 0.02, sigma: 0.13 },
]

const CLUSTER_SHARE = 0.45
const BOUNDS = { x0: -0.9, x1: 0.9, y0: -0.78, y1: 0.6 }
/** Model-space distance below which two points are drawn as neighbours. */
const LINK_RADIUS = 0.34
/** Each point keeps at most this many neighbours, so the plexus stays legible. */
const MAX_NEIGHBOURS = 3
/** Deterministic seed: the silhouette is the same on every load. */
const SEED = 0x5eed9a

const FOV = 3.1
/** Radians per second around Y — a slow sweep, not a spin. */
const SPIN_RATE = 0.34
/** Fixed tip forward, so the top face of the volume shows. */
const TILT = -0.2
/** Twinkle rate, radians per second. */
const TWINKLE_RATE = 1.7
const PERSPECTIVE_MIN = FOV / (FOV + 0.68)
const PERSPECTIVE_MAX = FOV / (FOV - 0.68)
const EDGE_LEVELS = 5
const MAX_DPR = 2

/** `--accent`, the site's bone-white. */
const DOT_COLOR = '232, 228, 220'
/** A cool tint for a minority of dots, kept close enough to read as one palette. */
const COOL_COLOR = '188, 208, 232'
const EDGE_COLOR = '232, 228, 220'
const TAU = Math.PI * 2

/**
 * The connectome, built once and reused: rotation is rigid, so point positions
 * and neighbour distances are fixed for the life of the model.
 */
export function buildConnectome(density: number): ConnectomeModel {
  const random = mulberry32(SEED)
  const points: BrainPoint[] = []
  // Rejection sampling needs a ceiling: the hull is roughly a third of the
  // bounding box, so a generous attempt budget still always fills up.
  const attempts = density * 200

  for (let attempt = 0; attempt < attempts && points.length < density; attempt += 1) {
    const point = samplePoint(random)

    if (point) points.push(point)
  }

  return { points, edges: buildEdges(points) }
}

/** True when (x, y) is inside the silhouette, in the (x, y) plane. */
function halfWidth(x: number, y: number): number {
  if (inPolygon(x, y, CORTEX_OUTLINE)) {
    // Widest at the middle of the vault (y = 0.09), closing to a point at the
    // crown and at the base — that double taper is what makes a cloud of points
    // read as one solid object under rotation.
    return 0.52 * Math.sqrt(Math.max(0, 1 - ((y - 0.09) / 0.58) ** 2))
  }

  if (inEllipse(x, y, CEREBELLUM)) {
    const dx = (x - CEREBELLUM.x) / (CEREBELLUM.rx * 1.1)
    const dy = (y - CEREBELLUM.y) / (CEREBELLUM.ry * 1.1)

    return 0.26 * Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy))
  }

  if (inPolygon(x, y, BRAINSTEM_OUTLINE)) return 0.1

  return 0
}

function samplePoint(random: () => number): BrainPoint | null {
  let x: number
  let y: number

  if (random() < CLUSTER_SHARE) {
    const cluster = CLUSTERS[Math.floor(random() * CLUSTERS.length)]

    x = cluster.x + gaussian(random) * cluster.sigma
    y = cluster.y + gaussian(random) * cluster.sigma
  } else {
    x = BOUNDS.x0 + random() * (BOUNDS.x1 - BOUNDS.x0)
    y = BOUNDS.y0 + random() * (BOUNDS.y1 - BOUNDS.y0)
  }

  const width = halfWidth(x, y)

  if (width <= 0) return null

  return {
    x,
    y,
    z: (random() * 2 - 1) * width,
    size: random(),
    phase: random() * TAU,
    cool: random() < 0.22,
  }
}

function buildEdges(points: BrainPoint[]): BrainEdge[] {
  const edges = new Map<string, BrainEdge>()
  const candidates: { index: number; distance: number }[] = []

  for (let i = 0; i < points.length; i += 1) {
    candidates.length = 0

    for (let j = 0; j < points.length; j += 1) {
      if (j === i) continue

      const distance = pointDistance(points[i], points[j])

      if (distance <= LINK_RADIUS) candidates.push({ index: j, distance })
    }

    candidates.sort((left, right) => left.distance - right.distance)

    for (const candidate of candidates.slice(0, MAX_NEIGHBOURS)) {
      const a = Math.min(i, candidate.index)
      const b = Math.max(i, candidate.index)
      const key = `${a}:${b}`

      if (!edges.has(key)) {
        edges.set(key, { a, b, weight: 1 - candidate.distance / LINK_RADIUS })
      }
    }
  }

  return [...edges.values()]
}

function pointDistance(left: BrainPoint, right: BrainPoint): number {
  return Math.hypot(left.x - right.x, left.y - right.y, left.z - right.z)
}

function inEllipse(
  x: number,
  y: number,
  ellipse: { x: number; y: number; rx: number; ry: number },
): boolean {
  const dx = (x - ellipse.x) / ellipse.rx
  const dy = (y - ellipse.y) / ellipse.ry

  return dx * dx + dy * dy <= 1
}

/** Ray casting, the standard even-odd test. */
function inPolygon(x: number, y: number, polygon: readonly (readonly [number, number])[]): boolean {
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const [xi, yi] = polygon[i]
    const [xj, yj] = polygon[j]

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }

  return inside
}

/** Irwin-Hall deviate: three uniforms, mean 0, standard deviation 1. */
function gaussian(random: () => number): number {
  return (random() + random() + random() - 1.5) * 2
}

/** Seeded PRNG (mulberry32) — the silhouette must not change between reloads. */
function mulberry32(seed: number): () => number {
  let state = seed

  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Box = { width: number; height: number; dpr: number }

/**
 * A procedural brain: ~200 points sampled inside a hand-authored silhouette,
 * fibre lines between near neighbours, rotating slowly in 3D. No image, no
 * licence, and it scales to any size.
 */
export default function ConnectomeBrain({ density = 200, className }: ConnectomeBrainProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const { points, edges } = buildConnectome(density)
    // x, y and the perspective factor per point, reused every frame.
    const projected = new Float32Array(points.length * 3)
    const buckets: number[][] = Array.from({ length: EDGE_LEVELS }, () => [])

    let box = measure(canvas)
    let frame = 0
    /** Seconds of animation already played, carried across a pause. */
    let elapsed = 0
    let startedAt = 0
    let running = false
    let disposed = false

    const draw = (seconds: number) => {
      const { width, height, dpr } = box

      if (width < 1 || height < 1) return

      const spin = seconds * SPIN_RATE
      const cosSpin = Math.cos(spin)
      const sinSpin = Math.sin(spin)
      const cosTilt = Math.cos(TILT)
      const sinTilt = Math.sin(TILT)
      // The silhouette spans 1.72 model units front-to-back, so this maps it to
      // most of the frame width. The widest points sit near z = 0, where the
      // perspective divide is close to 1, and the entrance tween scales the
      // whole element up from there.
      const scale = Math.min(width, height) * 0.54
      const centerX = width / 2
      const centerY = height / 2

      for (let i = 0; i < points.length; i += 1) {
        const point = points[i]
        const x = point.x * cosSpin - point.z * sinSpin
        const z = point.x * sinSpin + point.z * cosSpin
        const y = point.y * cosTilt - z * sinTilt
        const depth = point.y * sinTilt + z * cosTilt
        const perspective = FOV / (FOV + depth)

        projected[i * 3] = centerX + x * scale * perspective
        projected[i * 3 + 1] = centerY + y * scale * perspective
        projected[i * 3 + 2] = clamp01(
          (perspective - PERSPECTIVE_MIN) / (PERSPECTIVE_MAX - PERSPECTIVE_MIN),
        )
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)

      // Fibres first, so the dots sit on top of them. Bucketed by alpha: five
      // strokes beat six hundred.
      for (const bucket of buckets) bucket.length = 0

      for (const edge of edges) {
        const depth = Math.min(projected[edge.a * 3 + 2], projected[edge.b * 3 + 2])
        const level = Math.min(EDGE_LEVELS - 1, Math.floor(edge.weight * depth * EDGE_LEVELS))

        buckets[level].push(edge.a, edge.b)
      }

      context.lineWidth = 1

      for (let level = 0; level < EDGE_LEVELS; level += 1) {
        const path = buckets[level]

        if (path.length === 0) continue

        context.strokeStyle = `rgba(${EDGE_COLOR}, ${(0.08 + 0.1 * level).toFixed(3)})`
        context.beginPath()

        for (let i = 0; i < path.length; i += 2) {
          context.moveTo(projected[path[i] * 3], projected[path[i] * 3 + 1])
          context.lineTo(projected[path[i + 1] * 3], projected[path[i + 1] * 3 + 1])
        }

        context.stroke()
      }

      for (let i = 0; i < points.length; i += 1) {
        const point = points[i]
        const depth = projected[i * 3 + 2]
        const twinkle = 0.6 + 0.4 * Math.sin(seconds * TWINKLE_RATE + point.phase)

        context.globalAlpha = Math.min(1, (0.45 + 0.55 * depth) * twinkle)
        context.fillStyle = point.cool ? `rgb(${COOL_COLOR})` : `rgb(${DOT_COLOR})`
        context.beginPath()
        // Nearer points are both brighter and larger, which is what sells the
        // depth without any shading.
        context.arc(
          projected[i * 3],
          projected[i * 3 + 1],
          (1.5 + 2.3 * point.size) * (0.82 + 0.36 * depth),
          0,
          TAU,
        )
        context.fill()
      }

      context.globalAlpha = 1
    }

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      draw((now - startedAt) / 1000)
    }

    const start = () => {
      if (disposed || running) return

      running = true
      // Rebase the clock on the seconds already played rather than on "now", so
      // a tab that comes back resumes the sweep where it left off instead of
      // snapping the rotation back to its starting phase.
      startedAt = performance.now() - elapsed * 1000
      frame = requestAnimationFrame(tick)
    }

    const stop = () => {
      if (running) elapsed = (performance.now() - startedAt) / 1000

      running = false
      cancelAnimationFrame(frame)
      frame = 0
    }

    const onVisibilityChange = () => {
      if (document.hidden) stop()
      else start()
    }

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            box = measure(canvas)
            // A paused tab still needs the still frame to match its new size.
            if (!running) draw(elapsed)
          })
    observer?.observe(canvas)

    if (prefersReducedMotion()) {
      // No loop: one frame, at rest.
      draw(elapsed)
    } else {
      document.addEventListener('visibilitychange', onVisibilityChange)
      start()
    }

    return () => {
      disposed = true
      stop()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [density])

  return (
    <canvas
      ref={canvasRef}
      className={['connectome', className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  )
}

/**
 * The canvas's layout box. `offsetWidth`/`offsetHeight` rather than
 * `getBoundingClientRect`: the intro tilts this element in 3D, and the
 * transformed bounding box is not the size the backing store should be.
 */
function measure(canvas: HTMLCanvasElement): Box {
  const width = canvas.offsetWidth
  const height = canvas.offsetHeight
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)

  if (width >= 1 && height >= 1) {
    const pixelWidth = Math.max(1, Math.round(width * dpr))
    const pixelHeight = Math.max(1, Math.round(height * dpr))

    if (canvas.width !== pixelWidth) canvas.width = pixelWidth
    if (canvas.height !== pixelHeight) canvas.height = pixelHeight
  }

  return { width, height, dpr }
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}
