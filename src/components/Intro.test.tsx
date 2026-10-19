import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { stubMotionPreference } from '../test/stubs'
import Intro, {
  INTRO_STORAGE_KEY,
  INTRO_TOTAL_SECONDS,
  buildIntroTimeline,
  shouldPlayIntro,
} from './Intro'

beforeEach(() => {
  window.sessionStorage.clear()
  stubMotionPreference(false)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('Intro', () => {
  it('renders nothing when the viewer prefers reduced motion', () => {
    stubMotionPreference(true)

    const { container } = render(<Intro onDone={() => {}} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when the DOM cannot report a motion preference', () => {
    // No `matchMedia`: a five-second takeover could not be turned off, so it
    // does not run.
    vi.stubGlobal('matchMedia', undefined)

    const { container } = render(<Intro onDone={() => {}} />)

    expect(container).toBeEmptyDOMElement()
    expect(shouldPlayIntro()).toBe(false)
  })

  it('plays the four stages', () => {
    const { container } = render(<Intro />)

    expect(container.querySelector('.intro')).not.toBeNull()
    expect(screen.getByText('Mehdi')).toBeInTheDocument()
    expect(screen.getByText('!')).toBeInTheDocument()
    expect(screen.getByText('Homepage')).toBeInTheDocument()
    expect(container.querySelector('.intro__photo-img')).toHaveAttribute('src')
    expect(container.querySelector('.intro__brain canvas')).not.toBeNull()
  })

  it('locks the page while the curtain is down and releases it on unmount', () => {
    const { unmount } = render(<Intro />)

    expect(document.documentElement.style.overflow).toBe('hidden')

    unmount()

    expect(document.documentElement.style.overflow).toBe('')
  })

  it('skips to the end when the viewer clicks, and marks the session', () => {
    const onDone = vi.fn()
    const { container } = render(<Intro onDone={onDone} />)

    fireEvent.click(container.querySelector('.intro') as HTMLElement)

    expect(onDone).toHaveBeenCalledTimes(1)
    expect(window.sessionStorage.getItem(INTRO_STORAGE_KEY)).toBe('1')
  })

  it('skips from the button too, without firing twice', () => {
    const onDone = vi.fn()
    render(<Intro onDone={onDone} />)

    fireEvent.click(screen.getByRole('button', { name: /skip/i }))

    expect(onDone).toHaveBeenCalledTimes(1)
  })

  it('never plays twice in one session', () => {
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, '1')

    const { container } = render(<Intro />)

    expect(container).toBeEmptyDOMElement()
    expect(shouldPlayIntro()).toBe(false)
  })

  it('tears itself down even if the animation stalls', () => {
    // The watchdog is what keeps a stalled ticker from leaving the site behind
    // a curtain forever.
    vi.useFakeTimers()
    const onDone = vi.fn()

    render(<Intro onDone={onDone} />)

    expect(onDone).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime((INTRO_TOTAL_SECONDS + 1.5) * 1000 + 100)
    })

    expect(onDone).toHaveBeenCalledTimes(1)
  })
})

describe('buildIntroTimeline', () => {
  it('keeps the whole sequence inside the owner’s 5.5 second budget', () => {
    const { container } = render(<Intro />)
    const root = container.querySelector('.intro') as HTMLElement
    const timeline = buildIntroTimeline(root, () => {})

    expect(timeline.duration()).toBe(INTRO_TOTAL_SECONDS)
    expect(timeline.duration()).toBeLessThanOrEqual(5.5)

    timeline.kill()
  })

  it('reports completion when it reaches the end', () => {
    const { container } = render(<Intro />)
    const root = container.querySelector('.intro') as HTMLElement
    const onComplete = vi.fn()
    const timeline = buildIntroTimeline(root, onComplete)

    timeline.progress(1)

    expect(onComplete).toHaveBeenCalled()

    timeline.kill()
  })

  it('places every stage on the timeline', () => {
    const { container } = render(<Intro />)
    const root = container.querySelector('.intro') as HTMLElement
    const timeline = buildIntroTimeline(root, () => {})
    const animated = new Set<string>()

    for (const child of timeline.getChildren()) {
      const targets = (child as unknown as { targets?: () => unknown[] }).targets?.() ?? []

      for (const target of targets) {
        const element = target as HTMLElement | null

        if (element?.dataset.intro) animated.add(element.dataset.intro)
      }
    }

    // The curtain itself is the only target without a `data-intro` name.
    expect([...animated].sort()).toEqual([
      'bang',
      'brain',
      'greeting',
      'name',
      'photo',
      'photo-img',
      'stage-1',
      'stage-2',
      'stage-3',
      'stage-4',
    ])

    timeline.kill()
  })
})
