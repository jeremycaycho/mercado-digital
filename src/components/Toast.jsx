import { useEffect } from 'react'

// Mensaje corto que aparece abajo y se va solo
export default function Toast({ mensaje, onCerrar }) {
  useEffect(() => {
    if (!mensaje) return
    const t = setTimeout(onCerrar, 2500)
    return () => clearTimeout(t)
  }, [mensaje, onCerrar])

  return (
    <div className="toast-zona" role="status" aria-live="polite">
      {mensaje && <p className="toast" key={mensaje.id}>{mensaje.texto}</p>}
    </div>
  )
}
