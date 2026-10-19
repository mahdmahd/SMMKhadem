import { cleanup, render } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { stubCanvasContext, stubCanvasLayout, stubMotionPreference } from '../test/stubs'
import ConnectomeBrain, { buildConnectome } from './ConnectomeBrain'

/** Frames are queued rather than run, so a test decides when the loop ticks. */
let frames: FrameRequestCallback[] = []
let nextFrameId = 0
const requestFrame = vi.fn((callback: FrameRequestCallback) => {
  frames.push(callback)
  nextFrameId += 1

  return nextFrameId
})
const cancelFrame = vi.fn()

let restoreLayout: () => void = () => {}

beforeEach(() => {
  frames = []
  nextFrameId = 0
  requestFrame.mockClear()
  cancelFrame.mockClear()
  vi.stubGlobal('requestAnimationFrame', requestFrame)
  vi.stubGlobal('cancelAnimationFrame', cancelFrame)
  stubMotionPreference(false)
  restoreLayout = stubCanvasLayout(400, 400)
})

afterEach(() => {
  cleanup()
  restoreLayout()
  Reflect.deleteProperty(document, 'hidden')
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

/** Runs the frame the component has queued. */
function tick(): void {
  const callback = frames.shift()

  act(() => {
    callback?.(performance.now() + 16)
  })
}

/** jsdom has no tab, so the test supplies the visibility event. */
function setHidden(value: boolean): void {
  act(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => value })
    document.dispatchEvent(new Event('visibilitychange'))
  })
}

describe('ConnectomeBrain', () => {
  it('renders a canvas', () => {
    const { container } = render(<ConnectomeBrain />)
    const canvas = container.querySelector('canvas')

    expect(canvas).not.toBeNull()
    expect(canvas).toHaveClass('connectome')
  })

  it('draws fibres and dots, and cancels the loop on unmount', () => {
    const { calls } = stubCanvasContext()
    const { container, unmount } = render(<ConnectomeBrain density={120} />)

    expect(requestFrame).toHaveBeenCalled()
    expect(container.querySelector('canvas')).not.toBeNull()

    tick()

    // One clear, some fibres, and a dot per point.
    expect(calls.clearRect).toBeGreaterThan(0)
    expect(calls.stroke).toBeGreaterThan(0)
    expect(calls.arc).toBeGreaterThan(0)

    // The loop re-queues itself rather than drawing once.
    expect(frames.length).toBeGreaterThan(0)

    unmount()

    expect(cancelFrame).toHaveBeenCalled()
  })

  it('draws one still frame and no loop when motion is reduced', () => {
    stubMotionPreference(true)
    const { calls } = stubCanvasContext()

    render(<ConnectomeBrain density={80} />)

    expect(requestFrame).not.toHaveBeenCalled()
    expect(calls.arc).toBeGreaterThan(0)
  })

  it('pauses while the tab is hidden and picks the sweep back up', () => {
    stubCanvasContext()
    render(<ConnectomeBrain density={80} />)

    // One queued frame from `start`, then the loop re-queues itself.
    expect(requestFrame).toHaveBeenCalledTimes(1)

    tick()
    expect(requestFrame).toHaveBeenCalledTimes(2)

    setHidden(true)
    expect(cancelFrame).toHaveBeenCalled()
    // Stopped means stopped: nothing is queued while the tab is away.
    expect(requestFrame).toHaveBeenCalledTimes(2)

    setHidden(false)
    expect(requestFrame).toHaveBeenCalledTimes(3)
  })
})

describe('buildConnectome', () => {
  it('samples a deterministic cloud inside the silhouette', () => {
    const model = buildConnectome(200)

    expect(model.points).toHaveLength(200)
    // Same seed, same brain: the silhouette cannot change between reloads.
    expect(buildConnectome(200).points).toEqual(model.points)

    for (const point of model.points) {
      expect(point.x).toBeGreaterThanOrEqual(-0.9)
      expect(point.x).toBeLessThanOrEqual(0.9)
      expect(point.y).toBeGreaterThanOrEqual(-0.78)
      expect(point.y).toBeLessThanOrEqual(0.6)
      expect(Math.abs(point.z)).toBeLessThanOrEqual(0.53)
    }
  })

  it('links each point to a handful of neighbours, never itself', () => {
    const { points, edges } = buildConnectome(200)

    expect(edges.length).toBeGreaterThan(0)
    // Three neighbours each, deduplicated: the plexus stays legible.
    expect(edges.length).toBeLessThanOrEqual(points.length * 3)

    for (const edge of edges) {
      expect(edge.a).toBeLessThan(edge.b)
      expect(edge.b).toBeLessThan(points.length)
      expect(edge.weight).toBeGreaterThan(0)
      expect(edge.weight).toBeLessThanOrEqual(1)
    }
  })
})
