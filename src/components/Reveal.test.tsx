import { cleanup, render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Reveal from './Reveal'

let observers: MockIntersectionObserver[] = []

class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds: readonly number[] = []
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    observers.push(this)
  }

  observe() {}
  unobserve() {}
  disconnect() {}

  takeRecords(): IntersectionObserverEntry[] {
    return []
  }

  emit(isIntersecting: boolean) {
    this.callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
}

beforeEach(() => {
  observers = []
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe('Reveal', () => {
  it('hides children until the observer reports an intersection, then reveals once', () => {
    render(<Reveal>revealed copy</Reveal>)

    const element = screen.getByText('revealed copy')
    expect(element).not.toHaveClass('is-visible')
    expect(observers).toHaveLength(1)

    act(() => {
      observers[0].emit(true)
    })
    expect(element).toHaveClass('is-visible')

    act(() => {
      observers[0].emit(false)
    })
    expect(element).toHaveClass('is-visible')
  })

  it('renders children immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)

    render(<Reveal>plain copy</Reveal>)

    expect(screen.getByText('plain copy')).toHaveClass('is-visible')
  })

  it('supports the as and delay props', () => {
    render(
      <Reveal as="section" delay={120}>
        section copy
      </Reveal>,
    )

    const element = screen.getByText('section copy')
    expect(element.tagName).toBe('SECTION')
    expect(element).toHaveStyle({ transitionDelay: '120ms' })
  })
})
