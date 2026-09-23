import { useEffect, useRef, useState } from 'react'
import { dibujarCartel } from '../utils/cartelQR'
import { ubicacion } from '../utils/formato'

const SITIO_PUBLICO = 'https://mercado-digital-seven.vercel.app'

// En local (localhost o red de casa) el QR apunta igual a la app publicada
const origen = () =>
  /^(localhost|127\.|192\.168\.|10\.)/.test(window.location.hostname) ? SITIO_PUBLICO : window.location.origin

const nombreArchivo = (texto) =>
  'qr-' + texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function MiQR({ puesto, onCerrar }) {
  const lienzo = useRef(null)
  const [imagen, setImagen] = useState(null) // { blob, url }
  const [mensaje, setMensaje] = useState(null)
  const enlace = `${origen()}/puesto/${puesto.id}`

  useEffect(() => {
    let urlObjeto
    dibujarCartel(lienzo.current, {
      url: enlace,
      nombre: puesto.nombre,
      ubicacion: ubicacion(puesto),
      mercado: puesto.mercados?.nombre,
    })
      .then(
        () =>
          new Promise((resolve) =>
            lienzo.current.toBlob((blob) => {
              urlObjeto = URL.createObjectURL(blob)
              setImagen({ blob, url: urlObjeto })
              resolve()
            }, 'image/png')
          )
      )
      .catch(() => setMensaje('No se pudo crear el QR. Recarga la página e intenta de nuevo.'))
    return () => urlObjeto && URL.revokeObjectURL(urlObjeto)
  }, [enlace, puesto])

  const archivo = imagen && new File([imagen.blob], `${nombreArchivo(puesto.nombre)}.png`, { type: 'image/png' })
  const puedeCompartirImagen = archivo && navigator.canShare?.({ files: [archivo] })
  const textoCompartir = `Mira los productos y precios de ${puesto.nombre}: ${enlace}`

  async function compartirImagen() {
    try {
      await navigator.share({ files: [archivo], title: puesto.nombre, text: textoCompartir })
    } catch {
      // El vendedor cerró el menú de compartir: no es un error
    }
  }

  async function copiarEnlace() {
    try {
      await navigator.clipboard.writeText(enlace)
      setMensaje('Enlace copiado')
    } catch {
      setMensaje(enlace)
    }
  }

  return (
    <div className="confirmar-fondo" role="dialog" aria-modal="true" aria-labelledby="titulo-mi-qr">
      <div className="confirmar-caja">
        <h2 id="titulo-mi-qr" className="subtitulo">Tu QR</h2>
        <canvas ref={lienzo} className="qr-vista" aria-label={`Cartel con el QR de ${puesto.nombre}`} />
        <p className="confirmar-nota">
          Imprímelo y ponlo en tu puesto, o compártelo con tus clientes. Al escanearlo verán tus productos y precios.
        </p>

        {puedeCompartirImagen && (
          <button className="btn-principal" onClick={compartirImagen}>Compartir imagen</button>
        )}
        {imagen && (
          <a
            className={puedeCompartirImagen ? 'btn-secundario centrado' : 'btn-principal centrado'}
            href={imagen.url}
            download={archivo.name}
          >
            Descargar para imprimir
          </a>
        )}
        <div className="acciones">
          <a
            className="btn-secundario centrado"
            href={`https://wa.me/?text=${encodeURIComponent(textoCompartir)}`}
            target="_blank"
            rel="noreferrer"
          >
            Enviar enlace
          </a>
          <button className="btn-secundario" onClick={copiarEnlace}>Copiar enlace</button>
        </div>
        {mensaje && <p className="aviso-ok" role="status">{mensaje}</p>}
        <button className="enlace" onClick={onCerrar}>Cerrar</button>
      </div>
    </div>
  )
}
