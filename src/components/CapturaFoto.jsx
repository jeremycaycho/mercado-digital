import { useEffect, useState } from 'react'
import { comprimirImagen, subirFoto, borrarFoto } from '../utils/fotos'
import CamaraModal, { camaraDisponible } from './CamaraModal'

// Respaldo si no hay cámara dentro de la app
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

/**
 * Flujo completo de foto reutilizable:
 * cámara -> vista previa -> "¿Guardar?" -> subir -> onGuardar(url)
 */
export default function CapturaFoto({ titulo, fotoActual, usuarioId, onGuardar, onError, className, etiqueta, children }) {
  const [camaraAbierta, setCamaraAbierta] = useState(false)
  const [pendiente, setPendiente] = useState(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState(null)
  const usarCamara = camaraDisponible()

  useEffect(() => () => pendiente && URL.revokeObjectURL(pendiente.vista), [pendiente])

  const informar = (texto) => {
    setError(texto)
    onError?.(texto)
  }

  function abrirCamara() {
    informar(null)
    setPendiente(null)
    setCamaraAbierta(true)
  }

  function mostrarVistaPrevia(blob) {
    setCamaraAbierta(false)
    setPendiente({ blob, vista: URL.createObjectURL(blob) })
  }

  async function fotoDelSistema(e) {
    const archivo = e.target.files?.[0]
    e.target.value = ''
    if (!archivo) return
    informar(null)
    try {
      mostrarVistaPrevia(await comprimirImagen(archivo))
    } catch {
      informar('No se pudo leer la foto. Intenta tomarla de nuevo.')
    }
  }

  async function confirmar() {
    setSubiendo(true)
    informar(null)
    try {
      const url = await subirFoto(usuarioId, pendiente.blob)
      const ok = await onGuardar(url)
      if (ok) {
        borrarFoto(fotoActual)
        setPendiente(null)
      } else {
        borrarFoto(url)
        setError('No se pudo guardar la foto. Intenta de nuevo.')
      }
    } catch {
      setError('No se pudo guardar la foto. Revisa tu conexión e intenta de nuevo.')
    }
    setSubiendo(false)
  }

  function cancelar() {
    setPendiente(null)
    informar(null)
  }

  return (
    <>
      {usarCamara ? (
        <button type="button" className={className} onClick={abrirCamara} aria-label={etiqueta}>
          {children}
        </button>
      ) : (
        <label className={className}>
          {children}
          <EntradaCamara onFoto={fotoDelSistema} disabled={subiendo} etiqueta={etiqueta} />
        </label>
      )}

      {camaraAbierta && (
        <CamaraModal titulo={titulo} onCapturar={mostrarVistaPrevia} onCerrar={() => setCamaraAbierta(false)} />
      )}

      {pendiente && (
        <div className="confirmar-fondo" role="dialog" aria-modal="true" aria-label={`¿Guardar esta foto? ${titulo}`}>
          <div className="confirmar-caja">
            <h2 className="subtitulo">¿Guardar esta foto?</h2>
            <img src={pendiente.vista} alt="Foto recién tomada" className="confirmar-vista" />
            <p className="confirmar-nota">{titulo}. Así la verán tus clientes.</p>
            {error && <p className="aviso-error">{error}</p>}
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
              <button className="btn-secundario" onClick={cancelar} disabled={subiendo}>No, cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
