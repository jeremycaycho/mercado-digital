import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

const RANGOS = [[7, '7 días'], [30, '30 días']]

function Numero({ valor, texto }) {
  return (
    <div className="stat">
      <strong>{Number(valor ?? 0).toLocaleString('es-PE')}</strong>
      <span>{texto}</span>
    </div>
  )
}

export default function AdminEstadisticas() {
  const [dias, setDias] = useState(7)
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setDatos(null)
    supabase.rpc('estadisticas_admin', { p_dias: dias }).then(({ data, error }) => {
      if (error) setError('No se pudieron cargar las estadísticas.')
      else {
        setError(null)
        setDatos(data)
      }
    })
  }, [dias])

  const maxDia = Math.max(1, ...(datos?.por_dia ?? []).map((d) => d.busquedas))
  const porcentajeSin = datos?.busquedas ? Math.round((datos.sin_resultado / datos.busquedas) * 100) : 0

  return (
    <section>
      <div className="chips filtros-admin" role="group" aria-label="Periodo">
        {RANGOS.map(([n, texto]) => (
          <button key={n} className={`chip-rubro ${dias === n ? 'activa' : ''}`} aria-pressed={dias === n} onClick={() => setDias(n)}>
            Últimos {texto}
          </button>
        ))}
      </div>

      {error && <p className="aviso-error">{error}</p>}
      {!datos && !error && <p className="vacio">Cargando estadísticas…</p>}

      {datos && (
        <>
          <div className="stats">
            <Numero valor={datos.busquedas} texto="búsquedas" />
            <Numero valor={`${porcentajeSin}%`} texto="sin resultado" />
            <Numero valor={datos.vistas} texto="visitas a puestos" />
            <Numero valor={datos.whatsapp} texto="mensajes por WhatsApp" />
            <Numero valor={datos.como_llegar} texto="pidieron cómo llegar" />
            <Numero valor={datos.pedidos} texto="pedidos enviados" />
          </div>

          <h2 className="subtitulo">Búsquedas por día</h2>
          <div className="barras" role="img" aria-label="Gráfico de búsquedas por día">
            {datos.por_dia.map((d) => (
              <div key={d.dia} className="barra" title={`${d.dia}: ${d.busquedas} búsquedas`}>
                <span className="barra-valor">{d.busquedas || ''}</span>
                <span className="barra-relleno" style={{ height: `${(d.busquedas / maxDia) * 100}%` }} />
                <span className="barra-dia">{Number(d.dia.slice(8))}</span>
              </div>
            ))}
          </div>

          <h2 className="subtitulo">Lo que buscan y nadie tiene</h2>
          {datos.nadie_tiene.length === 0 ? (
            <p className="vacio">Todavía no hay búsquedas sin resultado. ¡Buena señal!</p>
          ) : (
            <>
              <ol className="ranking">
                {datos.nadie_tiene.map((t) => (
                  <li key={t.termino}><span>{t.termino}</span><strong>{t.veces}</strong></li>
                ))}
              </ol>
              <p className="nota">
                ¿Qué hacer? Si es otra forma de llamar a algo que sí hay, agrégalo en{' '}
                <Link to="/admin?tab=sinonimos">Sinónimos</Link>. Si nadie lo vende, avísales a los vendedores:
                ellos ya lo ven como "Oportunidades" en su panel.
              </p>
            </>
          )}

          <h2 className="subtitulo">Lo más buscado</h2>
          {datos.mas_buscados.length === 0 ? (
            <p className="vacio">Aún no hay búsquedas registradas.</p>
          ) : (
            <ol className="ranking">
              {datos.mas_buscados.map((t) => (
                <li key={t.termino}>
                  <span>{t.termino} {t.nadie_tiene && <span className="badge-hoy badge-cerrado">nadie lo tiene</span>}</span>
                  <strong>{t.veces}</strong>
                </li>
              ))}
            </ol>
          )}

          <h2 className="subtitulo">Puestos más visitados</h2>
          {datos.puestos_top.length === 0 ? (
            <p className="vacio">Aún no hay visitas registradas.</p>
          ) : (
            <div className="tabla-contenedor">
              <table className="tabla">
                <thead>
                  <tr><th>Puesto</th><th>Visitas</th><th>WhatsApp</th><th>Llegar</th><th>Pedidos</th></tr>
                </thead>
                <tbody>
                  {datos.puestos_top.map((p) => (
                    <tr key={p.id}>
                      <td><Link to={`/puesto/${p.id}`}>{p.nombre}</Link></td>
                      <td>{p.vistas}</td>
                      <td>{p.whatsapp}</td>
                      <td>{p.como_llegar}</td>
                      <td>{p.pedidos}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  )
}
