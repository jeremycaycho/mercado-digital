import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// Resumen para el vendedor: le muestra que la app le trae clientes
export default function TuSemana({ puestoId }) {
  const [datos, setDatos] = useState(null)
  const [oportunidades, setOportunidades] = useState([])

  useEffect(() => {
    supabase.rpc('estadisticas_puesto', { p_puesto: puestoId, p_dias: 7 }).then(({ data }) => setDatos(data?.[0] ?? null))
    supabase.rpc('busquedas_sin_resultado', { p_dias: 7, p_limite: 5 }).then(({ data }) => setOportunidades(data ?? []))
  }, [puestoId])

  if (!datos) return null
  const numero = (n) => Number(n ?? 0)

  return (
    <section className="tu-semana" aria-labelledby="titulo-semana" data-guia="tu-semana">
      <h2 id="titulo-semana" className="subtitulo sin-margen">Tus últimos 7 días</h2>
      <div className="tu-semana-numeros">
        <p><strong>{numero(datos.vistas)}</strong> vieron tu puesto</p>
        <p><strong>{numero(datos.whatsapp)}</strong> te escribieron</p>
        <p><strong>{numero(datos.como_llegar)}</strong> pidieron cómo llegar</p>
        <p><strong>{numero(datos.pedidos)}</strong> te enviaron un pedido</p>
      </div>
      {oportunidades.length > 0 && (
        <div className="oportunidades">
          <p className="sin-margen"><strong>Oportunidades:</strong> esto buscaron los clientes y ningún puesto lo tenía.</p>
          <div className="chips">
            {oportunidades.map((o) => (
              <span key={o.termino} className="chip chip-oportunidad">{o.termino} ({o.veces})</span>
            ))}
          </div>
          <p className="nota sin-margen">Si vendes alguno, agrégalo a tus productos.</p>
        </div>
      )}
    </section>
  )
}
