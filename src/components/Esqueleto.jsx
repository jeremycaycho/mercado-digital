// Filas grises animadas mientras carga: se siente más rápido que un "Cargando…"
export default function Esqueleto({ filas = 4, conImagen = true }) {
  return (
    <ul className="lista esqueleto" aria-hidden="true">
      {Array.from({ length: filas }, (_, i) => (
        <li key={i} className="esqueleto-fila">
          {conImagen && <span className="esqueleto-bloque esqueleto-imagen" />}
          <span className="esqueleto-textos">
            <span className="esqueleto-bloque" style={{ width: '40%' }} />
            <span className="esqueleto-bloque" style={{ width: '75%' }} />
            <span className="esqueleto-bloque" style={{ width: '55%' }} />
          </span>
        </li>
      ))}
    </ul>
  )
}
