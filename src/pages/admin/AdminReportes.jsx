import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import { MOTIVOS } from '../../components/ReportarPuesto'
import { haceCuanto } from '../../utils/formato'

const TEXTO_MOTIVO = Object.fromEntries(MOTIVOS)

export default function AdminReportes({ avisar }) {
  const [reportes, setReportes] = useState(null)
  const [verRevisados, setVerRevisados] = useState(false)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('reportes')
      .select('id, motivo, detalle, estado, creado, puesto_id, puestos(nombre, activo)')
      .eq('estado', verRevisados ? 'revisado' : 'pendiente')
      .order('creado', { ascending: false })
      .limit(100)
    if (error) setError('No se pudieron cargar los reportes.')
    else setReportes(data)
  }, [verRevisados])

  useEffect(() => { cargar() }, [cargar])

  async function marcarRevisado(r) {
    const { error } = await supabase.from('reportes').update({ estado: 'revisado' }).eq('id', r.id)
    if (error) return setError('No se pudo actualizar.')
    setReportes((lista) => lista.filter((x) => x.id !== r.id))
    avisar('Reporte marcado como revisado')
  }

  async function ocultarPuesto(r) {
    if (!window.confirm(`¿Ocultar "${r.puestos?.nombre}"? Dejará de verse para los clientes.`)) return
    const { error } = await supabase.from('puestos').update({ activo: false }).eq('id', r.puesto_id)
    if (error) return setError('No se pudo ocultar el puesto.')
    await marcarRevisado(r)
    avisar('Puesto ocultado y reporte revisado')
  }

  return (
    <section>
      <div className="chips filtros-admin" role="group" aria-label="Estado de los reportes">
        <button className={`chip-rubro ${!verRevisados ? 'activa' : ''}`} aria-pressed={!verRevisados} onClick={() => setVerRevisados(false)}>Pendientes</button>
        <button className={`chip-rubro ${verRevisados ? 'activa' : ''}`} aria-pressed={verRevisados} onClick={() => setVerRevisados(true)}>Revisados</button>
      </div>
      {error && <p className="aviso-error">{error}</p>}
      {!reportes && !error && <p className="vacio">Cargando reportes…</p>}
      {reportes?.length === 0 && <p className="vacio">{verRevisados ? 'Aún no hay reportes revisados.' : 'No hay reportes pendientes.'}</p>}
      <ul className="lista">
        {reportes?.map((r) => (
          <li key={r.id} className="admin-item">
            <div className="admin-item-cabeza">
              <strong>{r.puestos?.nombre ?? 'Puesto eliminado'}</strong>
              {r.puestos && !r.puestos.activo && <span className="badge-hoy badge-cerrado">Oculto</span>}
            </div>
            <p className="sin-margen">{TEXTO_MOTIVO[r.motivo] ?? r.motivo}</p>
            {r.detalle && <p className="nota sin-margen">"{r.detalle}"</p>}
            <p className="nota sin-margen">Reportado {haceCuanto(r.creado)}</p>
            {!verRevisados && (
              <div className="admin-acciones">
                <Link className="btn-secundario centrado" to={`/puesto/${r.puesto_id}`}>Ver puesto</Link>
                <button className="btn-secundario" onClick={() => marcarRevisado(r)}>Marcar revisado</button>
                {r.puestos?.activo && <button className="btn-eliminar" onClick={() => ocultarPuesto(r)}>Ocultar puesto</button>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
