import { cleanup, render } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { stubCanvasContext, stubCanvasLayout } from '../test/stubs'
import DotPortrait, { sampleDots } from './DotPortrait'

/** Stands in for `new Image()`: nothing decodes in jsdom, so the test drives it. */
class FakeImage {
  static instances: FakeImage[] = []

  naturalWidth = 266
  naturalHeight = 266
  decoding = ''
  src = ''
  onload: (() => void) | null = null
  onerror: (() => void) | null = null

  constructor() {
    FakeImage.instances.push(this)
  }
}

let restoreLayout: () => void = () => {}

beforeEach(() => {
  FakeImage.instances = []
  vi.stubGlobal('Image', FakeImage)
  restoreLayout = stubCanvasLayout(320, 400)
})

afterEach(() => {
  cleanup()
  restoreLayout()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

/** A flat frame of one grey level, as `getImageData` would return it. */
function flatPixels(cols: number, rows: number, level: number): Uint8ClampedArray {
  const data = new Uint8ClampedArray(cols * rows * 4)

  for (let index = 0; index < cols * rows; index += 1) {
    data[index * 4] = level
    data[index * 4 + 1] = level
    data[index * 4 + 2] = level
    data[index * 4 + 3] = 255
  }

  return data
}

/** A vignette wide enough to be flat across the frame, i.e. switched off. */
const NO_VIGNETTE = { x: 0.5, y: 0.5, rx: 99, ry: 99 }

describe('DotPortrait', () => {
  it('renders a canvas and never the photograph itself', () => {
    const { container } = render(<DotPortrait src="/portrait.jpg" />)

    const canvas = container.querySelector('canvas')

    expect(canvas).not.toBeNull()
    expect(canvas).toHaveClass('dot-portrait')
    // The whole point of the treatment: no raster portrait at any size.
    expect(container.querySelector('img')).toBeNull()
  })

  it('starts empty and samples the grid once the source loads', () => {
    const { calls } = stubCanvasContext({ pixels: (cols, rows) => flatPixels(cols, rows, 128) })
    const { container } = render(<DotPortrait src="/portrait.jpg" />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement

    expect(canvas.dataset.state).toBe('loading')
    expect(calls.drawImage).toBe(0)

    act(() => {
      FakeImage.instances[0].onload?.()
    })

    expect(canvas.dataset.state).toBe('ready')
    // Sized from the measured box, at device resolution.
    expect(canvas.width).toBe(320)
    expect(canvas.height).toBe(400)
    // One sample of the photo, then one dot per lit cell.
    expect(calls.drawImage).toBe(1)
    expect(calls.arc).toBeGreaterThan(0)
    expect(calls.fillStyles).toContain('#e8e4dc')
  })

  it('draws nothing when the source fails to load', () => {
    const { calls } = stubCanvasContext()
    const { container } = render(<DotPortrait src="/missing.jpg" />)
    const canvas = container.querySelector('canvas') as HTMLCanvasElement

    act(() => {
      FakeImage.instances[0].onerror?.()
    })

    expect(canvas.dataset.state).toBe('error')
    expect(calls.arc).toBe(0)
  })

  it('reports an unsupported canvas rather than throwing', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const { container } = render(<DotPortrait src="/portrait.jpg" />)

    expect((container.querySelector('canvas') as HTMLCanvasElement).dataset.state).toBe(
      'unsupported',
    )
  })
})

describe('sampleDots', () => {
  it('gives the mid-tones the dots, not the brightest cells', () => {
    // One row: shadow, skin, sky, glare. The sky is brighter than the face, so
    // a luminance ramp would hand it the biggest dot and invert the portrait.
    const pixels = new Uint8ClampedArray([
      20, 20, 20, 255,
      128, 128, 128, 255,
      175, 175, 175, 255,
      235, 235, 235, 255,
    ])

    const dots = sampleDots(pixels, 4, 1, { cell: 10, vignette: NO_VIGNETTE })

    // Only the two mid-tones survive; the shadow and the glare get nothing.
    expect(dots).toHaveLength(2)
    expect(dots[0].r).toBeGreaterThan(dots[1].r)
    // Skin sits at the centre of the band: a full-size dot, half the pitch less
    // the gap, and never more than that.
    expect(dots[0].r).toBeGreaterThan(10 * 0.48 * 0.9)
    expect(dots[0].r).toBeLessThanOrEqual(10 * 0.48)
    // Dots sit at the centre of their cell.
    expect(dots[0].x).toBeCloseTo(15, 5)
    expect(dots[1].x).toBeCloseTo(25, 5)
  })

  it('dissolves the frame edges so a bright background does not bury the face', () => {
    const cols = 24
    const rows = 30
    // A flat skin-toned frame: every cell would be a full-size dot unmodified.
    const pixels = flatPixels(cols, rows, 128)

    const vignetted = sampleDots(pixels, cols, rows, { cell: 8 })
    const flat = sampleDots(pixels, cols, rows, { cell: 8, vignette: NO_VIGNETTE })

    expect(vignetted.length).toBeLessThan(flat.length)

    // The corner cell loses its dot entirely; without the vignette it is one of
    // the biggest on the frame.
    const corner = (dot: { x: number; y: number }) => dot.x < 8 && dot.y < 8

    expect(flat.some(corner)).toBe(true)
    expect(vignetted.some(corner)).toBe(false)

    // The centre of the frame is untouched.
    const centre = (dot: { x: number; y: number }) =>
      Math.abs(dot.x - (cols * 8) / 2) < 16 && Math.abs(dot.y - (rows * 8) / 2) < 16

    expect(vignetted.some(centre)).toBe(true)
  })
})
