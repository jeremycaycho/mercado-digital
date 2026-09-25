import { Link } from 'react-router-dom'

export default function NoEncontrado() {
  return (
    <main className="pagina pantalla-estado">
      <div className="estado-icono" aria-hidden="true">?</div>
      <h1 className="titulo-pagina">Esta página no existe</h1>
      <p>Puede que el enlace esté incompleto o que el puesto ya no esté disponible.</p>
      <Link className="btn-principal centrado" to="/">Ir al buscador</Link>
    </main>
  )
}
