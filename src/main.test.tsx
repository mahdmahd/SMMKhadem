import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('app root', () => {
  it('renders "Hello" into the #root container', () => {
    const root = document.createElement('div')
    root.id = 'root'
    document.body.append(root)

    render(<App />, { container: root })

    expect(document.querySelector('#root')?.textContent).toContain('Hello')
  })
})
