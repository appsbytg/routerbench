import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { startTracking } from './shared/analytics'
import { checkApi } from './shared/apiStatus'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Missing #root element')
createRoot(root).render(<StrictMode><App /></StrictMode>)

// Start after the first paint so tracking never delays the page.
window.requestAnimationFrame(() => {
  startTracking()
  void checkApi()
})
