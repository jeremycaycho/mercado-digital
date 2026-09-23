import { useEffect, useState } from 'react'
import { comprimirImagen, subirFoto, borrarFoto } from '../utils/fotos'
import CamaraModal, { camaraDisponible } from './CamaraModal'
import { haceCuanto, esAntiguo } from '../utils/formato'

const OPCIONES = [
  ['disponible', 'Hay'],
  ['pocos', 'Pocos'],
  ['agotado', 'Agotado'],
]

// Respaldo si no hay cámara dentro de la app (por ejemplo, en http sin seguridad)
function EntradaCamara({ onFoto, disabled, etiqueta }) {
  return (
    <input
      type="file"
      accept="image/*"
      capture="environment"
      className="oculto"
      onChange={onFoto}
      disabled={disabled}
      aria-label={etiqueta}
    />
  )
}

export default function ProductoEditable({ producto, usuarioId, onCambiar, onEliminar }) {
  const [precio, setPrecio] = useState(producto.precio ?? '')
  const [camaraAbierta, setCamaraAbierta] = useState(false)
  const [pendiente, setPendiente] = useState(null) // { blob, vista } esperando confirmación
  const [subiendo, setSubiendo] = useState(false)
  const [errorFoto, setErrorFoto] = useState(null)
  const usarCamara = camaraDisponible()

  useEffect(() => () => pendiente && URL.revokeObjectURL(pendiente.vista), [pendiente])

  function guardarPrecio() {
    if (String(precio) === String(producto.precio ?? '')) return
    const valor = precio === '' ? null : Number(precio)
    if (valor !== null && (Number.isNaN(valor) || valor < 0)) return
    onCambiar({ precio: valor })
  }

  function abrirCamara() {
    setErrorFoto(null)
    setPendiente(null)
    setCamaraAbierta(true)
  }

  function mostrarVistaPrevia(blob) {
    setCamaraAbierta(false)
    setPendiente({ blob, vista: URL.createObjectURL(blob) })
  }

  // Respaldo: foto desde la cámara del sistema
  async function fotoDelSistema(e) {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    setErrorFoto(null)
    try {
      mostrarVistaPrevia(await comprimirImagen(archivo))
    } catch {
      setErrorFoto('No se pudo leer la foto. Intenta tomarla de nuevo.')
    }
  }

  async function confirmar() {
    setSubiendo(true)
    setErrorFoto(null)
    try {
      const anterior = producto.foto_url
      const url = await subirFoto(usuarioId, pendiente.blob)
      const ok = await onCambiar({ foto_url: url })
      if (ok) {
        borrarFoto(anterior)
        setPendiente(null)
      } else {
        borrarFoto(url)
        setErrorFoto('No se pudo guardar la foto. Intenta de nuevo.')
      }
    } catch {
      setErrorFoto('No se pudo guardar la foto. Revisa tu conexión e intenta de nuevo.')
    }
    setSubiendo(false)
  }

  function cancelar() {
    setPendiente(null)
    setErrorFoto(null)
  }

  const contenidoMiniatura = producto.foto_url ? <img src={producto.foto_url} alt="" /> : <span>Tomar foto</span>
  const etiquetaFoto = producto.foto_url ? `Cambiar foto de ${producto.nombre}` : `Tomar foto de ${producto.nombre}`

  return (
    <li className="editable">
      <div className="editable-fila">
        {usarCamara ? (
          <button type="button" className="foto-miniatura" onClick={abrirCamara} aria-label={etiquetaFoto}>
            {contenidoMiniatura}
          </button>
        ) : (
          <label className="foto-miniatura">
            {contenidoMiniatura}
            <EntradaCamara onFoto={fotoDelSistema} disabled={subiendo} etiqueta={etiquetaFoto} />
          </label>
        )}
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
      {errorFoto && !pendiente && <p className="aviso-error">{errorFoto}</p>}

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

      <label className="campo-precio">
        Precio en S/ por {producto.unidad}
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

      {camaraAbierta && (
        <CamaraModal
          titulo={`Foto de ${producto.nombre}`}
          onCapturar={mostrarVistaPrevia}
          onCerrar={() => setCamaraAbierta(false)}
        />
      )}

      {pendiente && (
        <div className="confirmar-fondo" role="dialog" aria-modal="true" aria-labelledby={`confirmar-${producto.id}`}>
          <div className="confirmar-caja">
            <h2 id={`confirmar-${producto.id}`} className="subtitulo">
              ¿Guardar esta foto para {producto.nombre}?
            </h2>
            <img src={pendiente.vista} alt="Foto recién tomada" className="confirmar-vista" />
            <p className="confirmar-nota">Así la verán tus clientes.</p>
            {errorFoto && <p className="aviso-error">{errorFoto}</p>}
            <button className="btn-principal" onClick={confirmar} disabled={subiendo}>
              {subiendo ? 'Guardando…' : 'Sí, guardar foto'}
            </button>
            <div className="acciones">
              {usarCamara ? (
                <button className="btn-secundario" onClick={abrirCamara} disabled={subiendo}>Tomar otra</button>
              ) : (
                <label className={`btn-secundario ${subiendo ? 'desactivado' : ''}`}>
                  Tomar otra
                  <EntradaCamara onFoto={fotoDelSistema} disabled={subiendo} etiqueta="Tomar otra foto" />
                </label>
              )}
              <button className="btn-secundario" onClick={cancelar} disabled={subiendo}>
                No, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
