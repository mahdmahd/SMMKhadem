import { act } from 'react'
import { describe, expect, it } from 'vitest'

import { profile } from './data/portfolio'

/**
 * Entry-point test: this actually loads `src/main.tsx` (rather than rendering
 * `<App />` directly), so the `#root` mount is covered end to end.
 */
describe('app entry', () => {
  it('mounts the app shell into #root', async () => {
    document.body.innerHTML = '<div id="root"></div>'

    await act(async () => {
      await import('./main')
    })

    const root = document.getElementById('root')
    expect(root).not.toBeNull()
    expect(root?.textContent).toContain(profile.name)
    expect(root?.querySelector('#research')).not.toBeNull()
  })
})
