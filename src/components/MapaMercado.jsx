import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import MapaPuestos from './MapaPuestos'
import PlanoMercado from './PlanoMercado'
import { tieneCoordenadas } from '../utils/formato'

// Muestra el mapa real (puestos con ubicación) y el esquema por calle o pasillo (los que no la marcaron)
export default function MapaMercado({ mercadoId, resaltarId, alto }) {
  const [puestos, setPuestos] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!mercadoId) return
    supabase
      .from('puestos')
      .select('id, nombre, rubro, pasillo, numero_puesto, lat, lng')
      .eq('mercado_id', mercadoId)
      .eq('activo', true)
      .then(({ data, error }) => (error ? setError(true) : setPuestos(data)))
  }, [mercadoId])

  // Se calculan una sola vez por carga, para que el mapa no se vuelva a dibujar sin necesidad
  const conMapa = useMemo(() => (puestos ?? []).filter(tieneCoordenadas), [puestos])
  const sinMapa = useMemo(() => (puestos ?? []).filter((p) => !tieneCoordenadas(p)), [puestos])

  if (error) return <p className="aviso-error">No se pudo cargar el mapa. Revisa tu conexión.</p>
  if (!puestos) return <p className="vacio">Cargando mapa…</p>

  return (
    <div className="mapa-mercado">
      {conMapa.length > 0 && <MapaPuestos puestos={conMapa} resaltarId={resaltarId} alto={alto} />}
      {conMapa.length > 0 && sinMapa.length > 0 && (
        <p className="nota">Estos puestos aún no marcaron su ubicación en el mapa:</p>
      )}
      {sinMapa.length > 0 && <PlanoMercado puestos={sinMapa} resaltarId={resaltarId} />}
    </div>
  )
}
