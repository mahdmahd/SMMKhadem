import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App'
import { installChunkReload } from './chunkReload'
import './index.css'

// A tab left open across a deploy must recover instead of rendering blank routes.
installChunkReload()

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
