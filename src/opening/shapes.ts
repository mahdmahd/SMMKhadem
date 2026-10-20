// Point-cloud generators. Every shape returns exactly `count` xyz triples
// (Float32Array, length count*3) in world units, centred on the origin.

export type Vec3Array = Float32Array

// Deterministic PRNG so the layout is identical on every load.
export function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A deep, wide starfield behind the wordmark. */
export function generateStars(count: number, seed: number): Vec3Array {
  const rand = mulberry32(seed)
  const out = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    out[i * 3] = (rand() - 0.5) * 18
    out[i * 3 + 1] = (rand() - 0.5) * 10
    out[i * 3 + 2] = -rand() * 8 + 1
  }
  return out
}

export interface Halftone {
  points: Vec3Array
  /** 0..1 per point: how much of its cell is lit. 0 = unused point. */
  tone: Float32Array
  /** Cell edge length in world units. */
  cell: number
}

/** Brightness of one source pixel, 0..1 (0 = background / ink). */
export type PixelTone = (r: number, g: number, b: number) => number

/** The avatar is a threshold trace: the face lives in the unfilled white. */
export const whiteTone: PixelTone = (r, g, b) => (r + g + b > 384 ? 1 : 0)

/** A shaded picture on a flat blue backdrop: key the blue out, keep the shading. */
export const blueKeyTone: PixelTone = (r, g, b) => {
  const blueness = Math.min(Math.max((b - r - 60) / 100, 0), 1)
  return ((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255) * (1 - blueness)
}

/**
 * Turn a picture into halftone dots on a grid. Each cell's tone is the mean
 * of its pixels' tones (that brings back the greys), and the dot's size and
 * brightness follow it. Avatar and brain share this, so they are made of
 * exactly the same kind of point. Output is centred on the lit area.
 */
export async function sampleHalftone(
  url: string,
  count: number,
  cellWorld: number,
  worldHeight: number,
  pixelTone: PixelTone,
  bulgeDepth: number,
  /** Tone levels: cell tones are stretched so `lo` → 0 and `hi` → 1. */
  levels: [number, number] = [0, 1],
): Promise<Halftone> {
  const img = await loadImage(url)
  const aspect = (img.naturalWidth || 1) / (img.naturalHeight || 1)
  const rows = Math.round(worldHeight / cellWorld)
  const cols = Math.round(rows * aspect)
  const sub = 4 // samples per cell edge
  const w = cols * sub
  const h = rows * sub
  const data = rasterize(img, w, h, '#fff')

  const cells: { cx: number; cy: number; tone: number }[] = []
  let x0 = cols,
    x1 = 0,
    y0 = rows,
    y1 = 0
  for (let cy = 0; cy < rows; cy++)
    for (let cx = 0; cx < cols; cx++) {
      let sum = 0
      for (let sy = 0; sy < sub; sy++)
        for (let sx = 0; sx < sub; sx++) {
          const i = ((cy * sub + sy) * w + cx * sub + sx) * 4
          sum += pixelTone(data[i], data[i + 1], data[i + 2])
        }
      const tone = Math.min(Math.max((sum / (sub * sub) - levels[0]) / (levels[1] - levels[0]), 0), 1)
      if (tone <= 0.1) continue
      cells.push({ cx, cy, tone })
      x0 = Math.min(x0, cx)
      x1 = Math.max(x1, cx)
      y0 = Math.min(y0, cy)
      y1 = Math.max(y1, cy)
    }
  // Too many lit cells for the budget? Keep the brightest.
  if (cells.length > count) cells.sort((a, b) => b.tone - a.tone).length = count

  const midX = (x0 + x1 + 1) / 2,
    midY = (y0 + y1 + 1) / 2
  const halfW = (x1 - x0 + 1) / 2,
    halfH = (y1 - y0 + 1) / 2
  const points = new Float32Array(count * 3)
  const tone = new Float32Array(count)
  const rand = mulberry32(5)
  for (let i = 0; i < count; i++) {
    // Spare points hide inside random lit cells with tone 0 (invisible).
    const c = cells[i < cells.length ? i : Math.floor(rand() * cells.length)]
    const fx = c.cx + 0.5,
      fy = c.cy + 0.5
    const nx = (fx - midX) / halfW,
      ny = (fy - midY) / halfH
    const r2 = nx * nx + ny * ny
    points[i * 3] = (fx - midX) * cellWorld
    points[i * 3 + 1] = -(fy - midY) * cellWorld
    points[i * 3 + 2] = r2 < 1 ? Math.sqrt(1 - r2) * bulgeDepth : 0 // bulge toward the camera
    tone[i] = i < cells.length ? c.tone : 0
  }
  return { points, tone, cell: cellWorld }
}

async function loadImage(url: string) {
  const img = new Image()
  img.decoding = 'async'
  img.src = url
  await img.decode()
  return img
}

function rasterize(img: HTMLImageElement, w: number, h: number, bg: string) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)
  return ctx.getImageData(0, 0, w, h).data
}

/** Cheap smooth pseudo-noise on a direction — enough to fake gyri folds. */
function folds(x: number, y: number, z: number) {
  return (
    Math.sin(x * 7.1 + Math.sin(y * 5.3)) * 0.5 +
    Math.sin(y * 8.7 + Math.sin(z * 6.1)) * 0.3 +
    Math.sin(z * 9.3 + Math.sin(x * 4.7)) * 0.2
  )
}

/** Procedural brain: two folded hemispheres + cerebellum + sparse interior. */
export function generateBrain(count: number, seed: number): Vec3Array {
  const rand = mulberry32(seed)
  const out = new Float32Array(count * 3)
  const gauss = () => {
    const u = rand() || 1e-6
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand())
  }
  for (let i = 0; i < count; i++) {
    let dx = gauss(),
      dy = gauss(),
      dz = gauss()
    const len = Math.hypot(dx, dy, dz) || 1
    dx /= len
    dy /= len
    dz /= len

    const roll = rand()
    let x: number, y: number, z: number
    if (roll < 0.92) {
      // Cerebrum hemisphere (left or right), folded surface, flat medial wall.
      const side = rand() < 0.5 ? -1 : 1
      let shell = roll < 0.82 ? 1 : 0.55 + rand() * 0.4 // most on the surface
      // Sulci: points near the noise's zero-lines sink in, drawing the grooves.
      const fv = folds(dx * 1.4, dy * 1.4, dz * 1.4)
      if (Math.abs(fv) < 0.09) shell *= 0.9
      const f = 1 + fv * 0.06
      x = Math.abs(dx) * 0.82 * f * shell
      y = dy * 1.0 * f * shell
      z = dz * 1.42 * f * shell
      // Lateral profile (z = front/back, y = up): the temporal lobe hangs
      // below the middle-front, and a sylvian fissure grooves above it.
      if (y < 0) y -= 0.32 * Math.exp(-((z - 0.3) ** 2) / 0.22) * Math.min(1, -y / 0.4)
      if (y < -0.45 && z < -0.35) y = -0.45 + (y + 0.45) * 0.4 // flat over the cerebellum
      const fissure = Math.abs(y - (-0.05 + (0.6 - z) * 0.22))
      if (fissure < 0.07 && z > -0.3 && z < 1.1) x *= 0.62
      x = side * (0.13 + x)
    } else {
      // Cerebellum, tucked under the back, with fine parallel folia.
      const f = Math.sin(dy * 38) > 0.55 ? 0.9 : 1
      x = dx * 0.7 * f
      y = -0.62 + dy * 0.34 * f
      z = -0.95 + dz * 0.42 * f
    }
    out[i * 3] = x * 1.25
    out[i * 3 + 1] = y * 1.25 + 0.1
    out[i * 3 + 2] = z * 1.25
  }
  return out
}

/**
 * Left-to-right order (with a little noise) for a shape's points. Applying
 * it to every shape keeps point i in roughly the same column across morphs,
 * which is what makes the transition read as a wave instead of static.
 */
export function orderByX(points: Vec3Array, seed: number): Uint32Array {
  const rand = mulberry32(seed)
  const n = points.length / 3
  const keys = Array.from({ length: n }, (_, i) => ({ i, k: points[i * 3] + (rand() - 0.5) * 0.25 }))
  keys.sort((a, b) => a.k - b.k)
  return Uint32Array.from(keys, (k) => k.i)
}
