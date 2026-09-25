import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import MapaMercado from '../components/MapaMercado'

// Mapa: /plano (todos los negocios) o /plano?mercado=ID (solo ese mercado)
export default function Plano() {
  const [params] = useSearchParams()
  const id = params.get('mercado')
  const [mercado, setMercado] = useState(id ? undefined : null)

  useEffect(() => {
    if (!id) return setMercado(null)
    supabase
      .from('mercados')
      .select('id, nombre, indicaciones')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => setMercado(data ?? null))
  }, [id])

  return (
    <main className="pagina">
      <Link to="/" className="volver">Volver al buscador</Link>
      {mercado === undefined ? (
        <p className="vacio">Cargando mapa…</p>
      ) : (
        <>
          <h1 className="titulo-pagina">{mercado ? `Mapa de ${mercado.nombre}` : 'Mapa de negocios'}</h1>
          {mercado?.indicaciones && <p className="puesto-donde">{mercado.indicaciones}</p>}
          <p className="nota">Toca un negocio para ver sus productos y precios.</p>
          <MapaMercado mercadoId={mercado?.id} alto={420} />
        </>
      )}
    </main>
  )
}
