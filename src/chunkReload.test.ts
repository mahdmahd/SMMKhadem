import { afterEach, describe, expect, it, vi } from 'vitest'

import { CHUNK_RELOAD_KEY, installChunkReload } from './chunkReload'

afterEach(() => {
  window.sessionStorage.clear()
})

function preloadError(): Event {
  return new Event('vite:preloadError', { cancelable: true })
}

describe('chunk reload', () => {
  it('reloads once when a chunk from an older deploy fails to load', () => {
    const reload = vi.fn()
    const uninstall = installChunkReload(window, reload)

    const event = preloadError()
    window.dispatchEvent(event)

    expect(reload).toHaveBeenCalledTimes(1)
    expect(event.defaultPrevented).toBe(true)
    expect(window.sessionStorage.getItem(CHUNK_RELOAD_KEY)).not.toBeNull()
    uninstall()
  })

  it('does not loop: a second failure right after the reload is left alone', () => {
    const reload = vi.fn()
    const uninstall = installChunkReload(window, reload)
    window.sessionStorage.setItem(CHUNK_RELOAD_KEY, String(Date.now()))

    window.dispatchEvent(preloadError())

    expect(reload).not.toHaveBeenCalled()
    uninstall()
  })
})
