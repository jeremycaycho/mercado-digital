import { Link } from 'react-router-dom'
import { LEGAL } from '../legal/datosLegales'

// Estructura común para Términos, Privacidad y Ayuda
export default function PaginaLegal({ titulo, children }) {
  return (
    <main className="pagina pagina-legal">
      <Link to="/" className="volver">Volver al inicio</Link>
      <h1 className="titulo-pagina">{titulo}</h1>
      <p className="nota">Última actualización: {LEGAL.version}</p>
      <div className="texto-legal">{children}</div>
    </main>
  )
}
