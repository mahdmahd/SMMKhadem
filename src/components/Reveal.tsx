import type { ElementType, ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import { prefersReducedMotion } from './motion'

export type RevealProps = {
  children: ReactNode
  /** Element to render — defaults to `div`. */
  as?: ElementType
  /** Transition delay in milliseconds. */
  delay?: number
  className?: string
}

const REVEAL_CLASS = 'reveal'
const VISIBLE_CLASS = 'is-visible'

/**
 * Reveal-on-scroll wrapper. Adds `is-visible` once, the first time the element
 * intersects the viewport. Renders children immediately (and skips the
 * observer entirely) under `prefers-reduced-motion` or without
 * IntersectionObserver support.
 */
export default function Reveal({ children, as, delay = 0, className }: RevealProps) {
  const Tag = (as ?? 'div') as ElementType
  const elementRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current

    if (!element || typeof IntersectionObserver === 'undefined' || prefersReducedMotion()) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  const classes = [REVEAL_CLASS, visible ? VISIBLE_CLASS : '', className].filter(Boolean).join(' ')

  return (
    <Tag
      ref={elementRef}
      className={classes}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
