import { Routes, Route } from 'react-router-dom'
import Inicio from './pages/Inicio'
import Puesto from './pages/Puesto'
import Vendedor from './pages/Vendedor'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/puesto/:id" element={<Puesto />} />
      <Route path="/vendedor" element={<Vendedor />} />
    </Routes>
  )
}
