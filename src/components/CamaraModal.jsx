import { useEffect, useRef, useState } from 'react'

// La cámara dentro de la app necesita https (Vercel) o localhost
export const camaraDisponible = () =>
  typeof window !== 'undefined' && window.isSecureContext && !!navigator.mediaDevices?.getUserMedia

export default function CamaraModal({ titulo, onCapturar, onCerrar }) {
  const video = useRef(null)
  const [lista, setLista] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let stream
    let cancelado = false
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      })
      .then((s) => {
        if (cancelado) return s.getTracks().forEach((t) => t.stop())
        stream = s
        video.current.srcObject = s
      })
      .catch(() => setError('No se pudo abrir la cámara. Revisa que el navegador tenga permiso para usarla.'))
    // Apaga la cámara al cerrar
    return () => {
      cancelado = true
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  // Toma un cuadrado del centro, ya reducido: la foto sale liviana desde el inicio
  function capturar() {
    const v = video.current
    const lado = Math.min(v.videoWidth, v.videoHeight)
    const salida = Math.min(lado, 1000)
    const canvas = document.createElement('canvas')
    canvas.width = salida
    canvas.height = salida
    canvas
      .getContext('2d')
      .drawImage(v, (v.videoWidth - lado) / 2, (v.videoHeight - lado) / 2, lado, lado, 0, 0, salida, salida)
    canvas.toBlob(
      (blob) => (blob ? onCapturar(blob) : setError('No se pudo tomar la foto. Intenta de nuevo.')),
      'image/webp',
      0.75
    )
  }

  return (
    <div className="confirmar-fondo" role="dialog" aria-modal="true" aria-label={titulo}>
      <div className="confirmar-caja">
        <h2 className="subtitulo">{titulo}</h2>
        {error ? (
          <p className="aviso-error">{error}</p>
        ) : (
          <video
            ref={video}
            className="confirmar-vista camara-video"
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => setLista(true)}
          />
        )}
        <button className="btn-principal" onClick={capturar} disabled={!lista || !!error}>
          {lista ? 'Tomar foto' : 'Abriendo cámara…'}
        </button>
        <button className="btn-secundario" onClick={onCerrar}>Cancelar</button>
      </div>
    </div>
  )
}
