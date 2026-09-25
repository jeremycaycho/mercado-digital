import { useState } from 'react'
import CapturaFoto from './CapturaFoto'
import { haceCuanto, esAntiguo, separarNombres } from '../utils/formato'

const OPCIONES = [
  ['disponible', 'Hay'],
  ['pocos', 'Pocos'],
  ['agotado', 'Agotado'],
]

export default function ProductoEditable({ producto, usuarioId, onCambiar, onEliminar }) {
  const [precio, setPrecio] = useState(producto.precio ?? '')
  const [errorFoto, setErrorFoto] = useState(null)
  const [otros, setOtros] = useState((producto.otros_nombres ?? []).join(', '))

  function guardarOtros() {
    const lista = separarNombres(otros)
    if (lista.join('|') === (producto.otros_nombres ?? []).join('|')) return
    onCambiar({ otros_nombres: lista })
  }

  function guardarPrecio() {
    if (String(precio) === String(producto.precio ?? '')) return
    const valor = precio === '' ? null : Number(precio)
    if (valor !== null && (Number.isNaN(valor) || valor < 0)) return
    onCambiar({ precio: valor })
  }

  return (
    <li className="editable">
      <div className="editable-fila">
        <CapturaFoto
          className="foto-miniatura"
          titulo={`Foto de ${producto.nombre}`}
          fotoActual={producto.foto_url}
          usuarioId={usuarioId}
          onGuardar={(url) => onCambiar({ foto_url: url })}
          onError={setErrorFoto}
          etiqueta={producto.foto_url ? `Cambiar foto de ${producto.nombre}` : `Tomar foto de ${producto.nombre}`}
        >
          {producto.foto_url ? <img src={producto.foto_url} alt="" /> : <span>Tomar foto</span>}
        </CapturaFoto>
        <div className="editable-titulo">
          <h3 className="producto-nombre">{producto.nombre}</h3>
          <span className={`actualizado ${esAntiguo(producto.updated_at) ? 'actualizado-antiguo' : ''}`}>
            Actualizado {haceCuanto(producto.updated_at)}
          </span>
        </div>
        <button className="btn-eliminar" onClick={onEliminar} aria-label={`Eliminar ${producto.nombre}`}>
          Eliminar
        </button>
      </div>
      {errorFoto && <p className="aviso-error">{errorFoto}</p>}

      <div className="selector-estado" role="group" aria-label={`Estado de ${producto.nombre}`}>
        {OPCIONES.map(([valor, texto]) => (
          <button
            key={valor}
            className={`opcion opcion-${valor} ${producto.estado === valor ? 'activa' : ''}`}
            aria-pressed={producto.estado === valor}
            onClick={() => producto.estado !== valor && onCambiar({ estado: valor })}
          >
            {texto}
          </button>
        ))}
      </div>

      <label className={`campo-precio ${producto.precio == null ? 'falta-precio' : ''}`}>
        {producto.precio == null ? `Pon tu precio por ${producto.unidad}` : `Precio en S/ por ${producto.unidad}`}
        <input
          type="number"
          inputMode="decimal"
          step="0.10"
          min="0"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          onBlur={guardarPrecio}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        />
      </label>

      <details className="otros-nombres">
        <summary>
          Otros nombres{producto.otros_nombres?.length ? `: ${producto.otros_nombres.join(', ')}` : ' (opcional)'}
        </summary>
        <input
          value={otros}
          onChange={(e) => setOtros(e.target.value)}
          onBlur={guardarOtros}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          placeholder="Ej: gallina, pollo beneficiado"
          aria-label={`Otros nombres de ${producto.nombre}`}
        />
        <span className="nota sin-margen">Cómo le dicen tus clientes, separado por comas.</span>
      </details>
    </li>
  )
}
