import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'
import InsigniaVerificado from '../../components/InsigniaVerificado'
import { ubicacion, haceCuanto, tieneCoordenadas } from '../../utils/formato'

const FILTROS = [
  ['pendientes', 'Por verificar', (p) => p.activo && !p.verificado],
  ['verificados', 'Verificados', (p) => p.verificado],
  ['ocultos', 'Ocultos', (p) => !p.activo],
  ['todos', 'Todos', () => true],
]

export default function AdminPuestos({ usuarioId, avisar }) {
  const [puestos, setPuestos] = useState(null)
  const [filtro, setFiltro] = useState('pendientes')
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('puestos')
      .select('id, nombre, rubro, pasillo, numero_puesto, referencia, whatsapp, activo, verificado, verificado_en, created_at, owner_id, lat, lng, mercados(nombre), productos(count)')
      .order('created_at', { ascending: false })
    if (error) setError('No se pudieron cargar los puestos.')
    else setPuestos(data)
  }, [])

  useEffect(() => { cargar() }, [cargar])

  async function cambiar(puesto, cambios, mensaje) {
    const { error } = await supabase.from('puestos').update(cambios).eq('id', puesto.id)
    if (error) return setError('No se guardó el cambio. Intenta de nuevo.')
    setError(null)
    setPuestos((lista) => lista.map((p) => (p.id === puesto.id ? { ...p, ...cambios } : p)))
    avisar(mensaje)
  }

  const verificar = (p) =>
    cambiar(p, { verificado: true, verificado_en: new Date().toISOString(), verificado_por: usuarioId }, `${p.nombre}: verificado`)
  const quitarVerificacion = (p) =>
    cambiar(p, { verificado: false, verificado_en: null, verificado_por: null }, 'Verificación quitada')
  const ocultar = (p) => {
    if (!window.confirm(`¿Ocultar "${p.nombre}"? Dejará de aparecer para los clientes, pero no se borra nada.`)) return
    cambiar(p, { activo: false }, 'Puesto ocultado')
  }
  const mostrar = (p) => cambiar(p, { activo: true }, 'Puesto visible otra vez')

  if (!puestos) return error ? <p className="aviso-error">{error}</p> : <p className="vacio">Cargando puestos…</p>

  const [, , condicion] = FILTROS.find(([id]) => id === filtro)
  const lista = puestos.filter(condicion)

  return (
    <section>
      <p className="nota">
        Verifica un puesto solo después de visitarlo en persona y confirmar que existe y que el vendedor es quien dice ser.
      </p>
      <div className="chips filtros-admin" role="group" aria-label="Filtrar puestos">
        {FILTROS.map(([id, texto, cond]) => (
          <button key={id} className={`chip-rubro ${filtro === id ? 'activa' : ''}`} aria-pressed={filtro === id} onClick={() => setFiltro(id)}>
            {texto} ({puestos.filter(cond).length})
          </button>
        ))}
      </div>
      {error && <p className="aviso-error">{error}</p>}
      {lista.length === 0 && <p className="vacio">No hay puestos en esta lista.</p>}

      <ul className="lista">
        {lista.map((p) => (
          <li key={p.id} className="admin-item">
            <div className="admin-item-cabeza">
              <strong>{p.nombre}</strong>
              {p.verificado && <InsigniaVerificado />}
              {!p.activo && <span className="badge-hoy badge-cerrado">Oculto</span>}
            </div>
            <p className="nota sin-margen">
              {p.rubro}{p.mercados?.nombre ? ` en ${p.mercados.nombre}` : ' (negocio independiente)'}. {ubicacion(p) || 'Sin calle indicada'}.
            </p>
            {p.referencia && <p className="nota sin-margen">Referencia: {p.referencia}</p>}
            <p className="nota sin-margen">
              {p.productos?.[0]?.count ?? 0} productos. Registrado {haceCuanto(p.created_at)}.
              {!tieneCoordenadas(p) && ' Sin punto en el mapa.'}
              {!p.owner_id && ' Sin dueño (puesto de ejemplo).'}
            </p>
            <div className="admin-acciones">
              {p.verificado ? (
                <button className="btn-secundario" onClick={() => quitarVerificacion(p)}>Quitar verificación</button>
              ) : (
                <button className="btn-principal btn-compacto" onClick={() => verificar(p)}>Verificar</button>
              )}
              <Link className="btn-secundario centrado" to={`/puesto/${p.id}`}>Ver</Link>
              {p.whatsapp && (
                <a className="btn-secundario centrado" href={`https://wa.me/${p.whatsapp}`} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              )}
              {p.activo ? (
                <button className="btn-eliminar" onClick={() => ocultar(p)}>Ocultar</button>
              ) : (
                <button className="enlace" onClick={() => mostrar(p)}>Mostrar</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
