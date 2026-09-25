import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import MapaMercado from '../components/MapaMercado'

// Mapa completo: /plano (primer mercado) o /plano?mercado=ID
export default function Plano() {
  const [params] = useSearchParams()
  const [mercado, setMercado] = useState(undefined)

  useEffect(() => {
    const id = params.get('mercado')
    let consulta = supabase.from('mercados').select('id, nombre, indicaciones')
    consulta = id ? consulta.eq('id', id) : consulta.order('created_at').limit(1)
    consulta.maybeSingle().then(({ data }) => setMercado(data ?? null))
  }, [params])

  return (
    <main className="pagina">
      <Link to="/" className="volver">Volver al buscador</Link>
      {mercado === undefined && <p className="vacio">Cargando mapa…</p>}
      {mercado === null && <p className="aviso-error">No encontramos ese mercado.</p>}
      {mercado && (
        <>
          <h1 className="titulo-pagina">Mapa de {mercado.nombre}</h1>
          {mercado.indicaciones && <p className="puesto-donde">{mercado.indicaciones}</p>}
          <p className="nota">Toca un puesto para ver sus productos y precios.</p>
          <MapaMercado mercadoId={mercado.id} alto={420} />
        </>
      )}
    </main>
  )
}
