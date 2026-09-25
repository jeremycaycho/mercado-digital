import { useEffect, useState } from 'react'

// Aviso fijo cuando el celular pierde internet
export default function SinConexion() {
  const [enLinea, setEnLinea] = useState(() => navigator.onLine)

  useEffect(() => {
    const on = () => setEnLinea(true)
    const off = () => setEnLinea(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])

  if (enLinea) return null
  return (
    <div className="sin-conexion" role="status">
      Sin conexión a internet. Lo que ves puede no estar actualizado.
    </div>
  )
}
