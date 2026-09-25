import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Puesto from './pages/Puesto'
import Vendedor from './pages/Vendedor'
import NuevaClave from './pages/NuevaClave'
import Plano from './pages/Plano'
import Admin from './pages/Admin'
import Terminos from './pages/Terminos'
import Privacidad from './pages/Privacidad'
import Ayuda from './pages/Ayuda'
import NoEncontrado from './pages/NoEncontrado'
import ErrorGeneral from './components/ErrorGeneral'
import SinConexion from './components/SinConexion'
import PiePagina from './components/PiePagina'

// Al cambiar de página, vuelve arriba (salvo enlaces a una sección como #plano)
function SubirAlCambiar() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <ErrorGeneral>
      <SubirAlCambiar />
      <SinConexion />
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/puesto/:id" element={<Puesto />} />
        <Route path="/plano" element={<Plano />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/vendedor" element={<Vendedor />} />
        <Route path="/vendedor/nueva-clave" element={<NuevaClave />} />
        <Route path="/terminos" element={<Terminos />} />
        <Route path="/privacidad" element={<Privacidad />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="*" element={<NoEncontrado />} />
      </Routes>
      <PiePagina />
    </ErrorGeneral>
  )
}
