import { createRoot } from 'react-dom/client'
import { App } from './src/app.js'
import { StrictMode } from 'react'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
