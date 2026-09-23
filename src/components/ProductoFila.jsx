import { Link } from 'react-router-dom'
import { formatoPrecio, ubicacion, linkWhatsApp, ESTADOS } from '../utils/formato'

export default function ProductoFila({ nombre, precio, unidad, estado, foto_url, puesto, whatsapp }) {
  const est = ESTADOS[estado] ?? ESTADOS.disponible
  const wa = linkWhatsApp(whatsapp, `Hola, vi en Mercado Digital que tienes ${nombre}. ¿Aún hay?`)

  return (
    <li className={`producto ${estado === 'agotado' ? 'producto-agotado' : ''}`}>
      {foto_url && <img className="producto-foto" src={foto_url} alt={nombre} loading="lazy" />}
      <div className="producto-info">
        <h3 className="producto-nombre">{nombre}</h3>
        <span className={`estado ${est.clase}`}>{est.texto}</span>
        {puesto && (
          <Link to={`/puesto/${puesto.id}`} className="producto-puesto">
            <span className="producto-puesto-nombre">{puesto.nombre}</span>
            <span className="producto-puesto-donde">{ubicacion(puesto)}</span>
          </Link>
        )}
      </div>
      <div className="producto-lado">
        <div className="etiqueta-precio">
          <span className="precio">{formatoPrecio(precio)}</span>
          <span className="unidad">x {unidad}</span>
        </div>
        {wa && estado !== 'agotado' && (
          <a className="btn-wa" href={wa} target="_blank" rel="noreferrer">
            Preguntar
          </a>
        )}
      </div>
    </li>
  )
}
