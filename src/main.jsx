import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import 'leaflet/dist/leaflet.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Oculta la pantalla de carga con una transición suave cuando la app ya está lista
requestAnimationFrame(() => {
  const splash = document.getElementById('splash')
  if (!splash) return
  splash.classList.add('fuera')
  setTimeout(() => splash.remove(), 450)
})
