import { vi } from 'vitest'

/**
 * Stand-ins for the browser APIs jsdom does not implement.
 *
 * All three are gaps in the environment rather than behaviour under test:
 * jsdom has no layout engine, no canvas backend, and no `matchMedia`. Each
 * helper returns a restore function (or is undone by `vi.unstubAllGlobals()`)
 * so a test can leave the environment as it found it.
 */

/** What the component painted, counted rather than diffed. */
export type CanvasCalls = {
  clearRect: number
  fillRect: number
  arc: number
  stroke: number
  fill: number
  drawImage: number
  /** Every value assigned to `fillStyle`, in order. */
  fillStyles: string[]
}

export type CanvasContextStub = { calls: CanvasCalls }

/**
 * Replaces the 2D context with a recorder.
 *
 * The components only need a context that does not throw; the tests need to
 * know that dots were drawn, and in what colour.
 */
export function stubCanvasContext(options?: {
  /** Pixel data for `getImageData`, one RGBA entry per cell. */
  pixels?: (cols: number, rows: number) => Uint8ClampedArray
}): CanvasContextStub {
  const calls: CanvasCalls = {
    clearRect: 0,
    fillRect: 0,
    arc: 0,
    stroke: 0,
    fill: 0,
    drawImage: 0,
    fillStyles: [],
  }

  const context: Record<string, unknown> = {
    setTransform: () => {},
    clearRect: () => {
      calls.clearRect += 1
    },
    fillRect: () => {
      calls.fillRect += 1
    },
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {
      calls.arc += 1
    },
    fill: () => {
      calls.fill += 1
    },
    stroke: () => {
      calls.stroke += 1
    },
    drawImage: () => {
      calls.drawImage += 1
    },
    getImageData: (_x: number, _y: number, width: number, height: number) => ({
      data: options?.pixels
        ? options.pixels(width, height)
        : new Uint8ClampedArray(width * height * 4),
    }),
    globalAlpha: 1,
    lineWidth: 1,
    strokeStyle: '',
  }

  let fillStyle = ''

  Object.defineProperty(context, 'fillStyle', {
    get: () => fillStyle,
    set: (value: string) => {
      fillStyle = value
      calls.fillStyles.push(value)
    },
  })

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  )

  return { calls }
}

/**
 * jsdom lays nothing out, so a canvas reports 0x0 and the components correctly
 * decline to draw. Give them a box.
 *
 * The rect is deliberately **twice** the layout box. The two APIs are not
 * interchangeable here: `offsetWidth`/`offsetHeight` are the layout box, while
 * `getBoundingClientRect` reports the box *after* any transform on an ancestor,
 * which is what the intro's 3D tilt does to both canvases. Stubbing them with
 * the same numbers would let a regression back to the rect pass unnoticed, so
 * the mismatch is the assertion: only the layout-box API measures 320x400.
 */
export function stubCanvasLayout(width: number, height: number): () => void {
  const originalRect = HTMLCanvasElement.prototype.getBoundingClientRect
  const originalWidth = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, 'offsetWidth')
  const originalHeight = Object.getOwnPropertyDescriptor(
    HTMLCanvasElement.prototype,
    'offsetHeight',
  )

  Object.defineProperty(HTMLCanvasElement.prototype, 'offsetWidth', {
    configurable: true,
    get: () => width,
  })
  Object.defineProperty(HTMLCanvasElement.prototype, 'offsetHeight', {
    configurable: true,
    get: () => height,
  })
  HTMLCanvasElement.prototype.getBoundingClientRect = () =>
    ({
      width: width * 2,
      height: height * 2,
      top: 0,
      left: 0,
      right: width * 2,
      bottom: height * 2,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect

  return () => {
    HTMLCanvasElement.prototype.getBoundingClientRect = originalRect

    if (originalWidth) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'offsetWidth', originalWidth)
    } else {
      Reflect.deleteProperty(HTMLCanvasElement.prototype, 'offsetWidth')
    }

    if (originalHeight) {
      Object.defineProperty(HTMLCanvasElement.prototype, 'offsetHeight', originalHeight)
    } else {
      Reflect.deleteProperty(HTMLCanvasElement.prototype, 'offsetHeight')
    }
  }
}

/** Answers `prefers-reduced-motion` the way the test needs it answered. */
export function stubMotionPreference(reduce: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: reduce && query.includes('prefers-reduced-motion'),
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  )
}
