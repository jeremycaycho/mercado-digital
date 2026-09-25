import { Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Puesto from './pages/Puesto'
import Vendedor from './pages/Vendedor'
import NuevaClave from './pages/NuevaClave'
import Plano from './pages/Plano'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/puesto/:id" element={<Puesto />} />
      <Route path="/plano" element={<Plano />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/vendedor" element={<Vendedor />} />
      <Route path="/vendedor/nueva-clave" element={<NuevaClave />} />
    </Routes>
  )
}
