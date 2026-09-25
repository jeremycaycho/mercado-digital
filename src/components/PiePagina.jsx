import { Link } from 'react-router-dom'

export default function PiePagina() {
  return (
    <footer className="pie-pagina">
      <nav aria-label="Información">
        <Link to="/ayuda" data-guia="pie-ayuda">Ayuda</Link>
        <Link to="/terminos">Términos</Link>
        <Link to="/privacidad">Privacidad</Link>
        <Link to="/vendedor">Soy vendedor</Link>
      </nav>
      <p>Mercado Digital. Gratis para clientes y vendedores.</p>
    </footer>
  )
}
