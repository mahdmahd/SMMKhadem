import { useEffect, useRef, useState } from 'react'

export type DotPortraitProps = {
  /** Portrait source. Vite resolves the asset import to a URL at build time. */
  src: string
  /**
   * Dot pitch in CSS pixels at the rendered size. Smaller cells resolve more
   * detail and draw more dots; the default is tuned for a portrait-sized frame.
   */
  cell?: number
  className?: string
}

/** One dot of the halftone, positioned in the canvas's CSS pixel space. */
export type Dot = { x: number; y: number; r: number }

/** Elliptical falloff, in normalised (0..1) frame coordinates. */
export type Vignette = { x: number; y: number; rx: number; ry: number }

export type SampleOptions = {
  /** Dot pitch, in the same units as the returned coordinates. */
  cell: number
  vignette?: Vignette
}

/**
 * The mapping is a band-pass, not a luminance ramp, and that is the whole
 * aesthetic decision here.
 *
 * The portrait is shot outdoors: the sky behind the subject is *brighter* than
 * the face, and the jacket is darker than either. A luminance ramp therefore
 * gives the biggest dots to the background, and the picture reads as a bright
 * field with a hole where the head is. Dot size instead tracks how close a
 * cell's luminance is to skin — so the face carries the dots, the sky and the
 * jacket fall away to nothing, and the dark features inside the face (glasses,
 * beard, the shadow under the jaw) come back as holes. Measured on the actual
 * crop: the face peaks at 0.45–0.6 luminance and the sky sits above 0.75.
 */
const BAND_CENTRE = 0.5
/** Distance from the centre, either way, at which a cell has no dot left. */
const BAND_WIDTH = 0.3
/** Dot radius as a fraction of the cell pitch, so neighbouring dots stay apart. */
const DOT_SCALE = 0.48
/** Below this radius a dot is a sub-pixel smudge: drop it. */
const MIN_RADIUS = 0.3

/**
 * The portrait is shot outdoors against a bright background, so a plain
 * luminance ramp would tile the whole frame with dots and bury the face. The
 * falloff dissolves the edges and corners into the page background and leaves
 * the head and shoulders as the subject. Centred slightly above the middle,
 * where the face sits in this frame.
 */
export const DEFAULT_VIGNETTE: Vignette = { x: 0.5, y: 0.38, rx: 0.43, ry: 0.51 }

/**
 * Crop, tuned for this portrait: the frame is taller than the square source,
 * and the subject is a head with a lot of bright weather behind it. Pulling the
 * crop in by 1.3x around the face fills the frame with the subject and drops
 * the bright band above the head, which is the one part of the photograph the
 * vignette alone cannot reach.
 */
const ZOOM = 1.3
const FOCUS = { x: 0.5, y: 0.38 }

/** Bone-white, i.e. `--accent`. */
const DOT_COLOR = '#e8e4dc'
/** `--bg`, used only when the custom property cannot be read. */
const FALLBACK_BACKGROUND = '#050505'
const TAU = Math.PI * 2
/** Retina is the point; beyond 2x the extra dots buy nothing. */
const MAX_DPR = 2

/**
 * Turns one sample per grid cell into dots.
 *
 * Pure and exported: the mapping from luminance to radius is the whole
 * aesthetic, so it is worth testing against a synthetic ramp rather than only
 * through a canvas that jsdom cannot paint.
 */
export function sampleDots(
  pixels: ArrayLike<number>,
  cols: number,
  rows: number,
  { cell, vignette = DEFAULT_VIGNETTE }: SampleOptions,
): Dot[] {
  const dots: Dot[] = []

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const offset = (row * cols + col) * 4
      const luminance =
        (0.2126 * pixels[offset] + 0.7152 * pixels[offset + 1] + 0.0722 * pixels[offset + 2]) / 255
      const tone = 1 - smoothstep(0, BAND_WIDTH, Math.abs(luminance - BAND_CENTRE))

      if (tone <= 0) continue

      const dx = ((col + 0.5) / cols - vignette.x) / vignette.rx
      const dy = ((row + 0.5) / rows - vignette.y) / vignette.ry
      const falloff = 1 - smoothstep(0.6, 1.15, Math.hypot(dx, dy))
      const radius = tone * falloff * cell * DOT_SCALE

      if (falloff <= 0 || radius < MIN_RADIUS) continue

      dots.push({ x: (col + 0.5) * cell, y: (row + 0.5) * cell, r: radius })
    }
  }

  return dots
}

type LoadState = 'loading' | 'ready' | 'error' | 'unsupported'

/**
 * The hero portrait as a dot mosaic: the photo is sampled cell by cell and each
 * cell becomes one bone-white dot sized by its luminance, on the page
 * background. The source is only 266px wide, and this is exactly the treatment
 * that does not care: it reads luminance, never pixels.
 *
 * Static by design — there is no animation to disable, so reduced motion needs
 * no branch here.
 *
 * Renders a canvas, never an `<img>`: the raw photograph is never shown at any
 * size.
 */
export default function DotPortrait({ src, cell = 8, className }: DotPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) {
      // No 2D backend (a DOM without canvas). Nothing to draw, and no crash.
      setState('unsupported')
      return
    }

    let image: HTMLImageElement | null = null
    let frame = 0
    let disposed = false

    const render = () => {
      frame = 0
      if (disposed || !image) return

      // `offset*` is the layout box; `getBoundingClientRect` would report the
      // box *after* any transform on an ancestor, which is the wrong size for
      // a backing store.
      const cssWidth = canvas.offsetWidth
      const cssHeight = canvas.offsetHeight
      // Not laid out yet (or a zero-sized container): the observer will call back.
      if (cssWidth < 1 || cssHeight < 1) return

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
      const pixelWidth = Math.max(1, Math.round(cssWidth * dpr))
      const pixelHeight = Math.max(1, Math.round(cssHeight * dpr))
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight

      const cols = Math.max(1, Math.round(cssWidth / cell))
      const rows = Math.max(1, Math.round(cssHeight / cell))
      const sampler = document.createElement('canvas')
      sampler.width = cols
      sampler.height = rows
      const samplerContext = sampler.getContext('2d')
      if (!samplerContext) return

      // One sample per cell: drawing the photo into a cols x rows canvas makes
      // the browser average each cell for us, which is the halftone filter.
      // Cover-fit, so a square source fills a taller frame without distortion.
      const cover =
        Math.max(cols / image.naturalWidth, rows / image.naturalHeight) * ZOOM
      const drawWidth = image.naturalWidth * cover
      const drawHeight = image.naturalHeight * cover
      samplerContext.drawImage(
        image,
        (cols - drawWidth) * FOCUS.x,
        (rows - drawHeight) * FOCUS.y,
        drawWidth,
        drawHeight,
      )

      const { data } = samplerContext.getImageData(0, 0, cols, rows)
      const dots = sampleDots(data, cols, rows, { cell: cssWidth / cols })

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.fillStyle = background(canvas)
      context.fillRect(0, 0, cssWidth, cssHeight)
      context.fillStyle = DOT_COLOR
      // One path, one fill: a few thousand arcs are cheaper batched.
      context.beginPath()
      for (const dot of dots) {
        context.moveTo(dot.x + dot.r, dot.y)
        context.arc(dot.x, dot.y, dot.r, 0, TAU)
      }
      context.fill()
    }

    const schedule = () => {
      if (disposed || frame) return
      frame = requestAnimationFrame(render)
    }

    const element = new Image()
    element.decoding = 'async'
    element.onload = () => {
      if (disposed) return
      image = element
      setState('ready')
      render()
    }
    element.onerror = () => {
      if (!disposed) setState('error')
    }
    element.src = src

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(() => {
            // The observer fires once on observe, which also covers the first
            // layout pass, and then on every size change.
            schedule()
          })
    observer?.observe(canvas)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      element.onload = null
      element.onerror = null
    }
  }, [src, cell])

  return (
    <canvas
      ref={canvasRef}
      className={['dot-portrait', className].filter(Boolean).join(' ')}
      data-state={state}
      aria-hidden="true"
    />
  )
}

/** The page background, read from the token so the mosaic matches the theme. */
function background(element: HTMLElement): string {
  return getComputedStyle(element).getPropertyValue('--bg').trim() || FALLBACK_BACKGROUND
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function smoothstep(edge0: number, edge1: number, value: number): number {
  const t = clamp01((value - edge0) / (edge1 - edge0))

  return t * t * (3 - 2 * t)
}
