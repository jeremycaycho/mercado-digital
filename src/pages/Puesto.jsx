import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ProductoFila from '../components/ProductoFila'
import MapaMercado from '../components/MapaMercado'
import InsigniaVerificado from '../components/InsigniaVerificado'
import { registrarEvento } from '../utils/estadisticas'
import Esqueleto from '../components/Esqueleto'
import ReportarPuesto from '../components/ReportarPuesto'
import ControlCantidad from '../components/ControlCantidad'
import BarraPedido from '../components/BarraPedido'
import PedidoModal from '../components/PedidoModal'
import Recorrido, { useRecorrido } from '../components/Recorrido'
import { usePedido } from '../hooks/usePedido'
import { GUIA_PUESTO } from '../legal/guias'
import { ubicacion, linkWhatsApp, estadoDeHoy, tieneCoordenadas } from '../utils/formato'

const ORDEN = { disponible: 0, pocos: 1, agotado: 2 }

export default function Puesto() {
  const { id } = useParams()
  const [puesto, setPuesto] = useState(null)
  const [carga, setCarga] = useState('cargando')
  const [verPedido, setVerPedido] = useState(false)
  const { items, fijar, sincronizar, vaciar } = usePedido(id)
  const guia = useRecorrido('puesto', carga === 'listo')

  useEffect(() => {
    supabase
      .from('puestos')
      .select('*, mercados(nombre, indicaciones), productos(*)')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return setCarga('error')
        if (!data) return setCarga('noexiste')
        setPuesto(data)
        sincronizar(data.productos)
        setCarga('listo')
        registrarEvento('vista_puesto', data.id, data.owner_id)
      })
  }, [id, sincronizar])

  if (carga === 'cargando') {
    return (
      <main className="pagina">
        <div className="esqueleto-bloque esqueleto-portada" aria-hidden="true" />
        <Esqueleto filas={4} />
        <p className="oculto" role="status">Cargando puesto…</p>
      </main>
    )
  }

  if (carga !== 'listo') {
    return (
      <main className="pagina">
        <Link to="/" className="volver">Volver al buscador</Link>
        <p className="aviso-error">
          {carga === 'error'
            ? 'No se pudo cargar el puesto. Revisa tu conexión.'
            : 'Este puesto no existe o ya no está activo.'}
        </p>
      </main>
    )
  }

  const hoy = estadoDeHoy(puesto)
  const productos = [...puesto.productos].sort(
    (a, b) => ORDEN[a.estado] - ORDEN[b.estado] || a.nombre.localeCompare(b.nombre)
  )
  const wa = linkWhatsApp(puesto.whatsapp, `Hola, te escribo desde Mercado Digital por tu puesto ${puesto.nombre}.`)

  return (
    <main className="pagina">
      <Link to="/" className="volver">Volver al buscador</Link>

      {puesto.foto_url && <img className="puesto-foto" src={puesto.foto_url} alt={`Puesto ${puesto.nombre}`} />}

      <header className="puesto-cabecera" data-guia="datos-puesto">
        <span className="puesto-rubro">
          {puesto.rubro}
          {hoy && <span className={`badge-hoy badge-${hoy}`}>{hoy === 'abierto' ? 'Abierto hoy' : 'Cerrado hoy'}</span>}
          {puesto.verificado && <InsigniaVerificado />}
        </span>
        <h1>{puesto.nombre}</h1>
        {puesto.descripcion && <p className="puesto-desc">{puesto.descripcion}</p>}
        <p className="puesto-donde">
          {ubicacion(puesto) && <strong>{ubicacion(puesto)}</strong>}
          {ubicacion(puesto) && puesto.mercados?.nombre && ' en '}
          {puesto.mercados?.nombre}
          {puesto.referencia && <span className="puesto-referencia">{puesto.referencia}</span>}
          <a href="#plano" className="enlace-plano">Ver en el mapa</a>
        </p>
        {(puesto.horario || puesto.metodos_pago?.length > 0) && (
          <dl className="puesto-datos">
            {puesto.horario && (
              <div>
                <dt>Horario</dt>
                <dd>{puesto.horario}</dd>
              </div>
            )}
            {puesto.metodos_pago?.length > 0 && (
              <div>
                <dt>Aceptan</dt>
                <dd className="chips">
                  {puesto.metodos_pago.map((m) => <span key={m} className="chip">{m}</span>)}
                </dd>
              </div>
            )}
          </dl>
        )}
      </header>

      {hoy === 'cerrado' && (
        <p className="aviso-error">Este puesto indicó que hoy no abre. Puedes escribirle para consultar.</p>
      )}

      <h2 className="subtitulo">{productos.length} productos</h2>
      {puesto.whatsapp && productos.length > 0 && (
        <p className="nota">Toca "Agregar", elige la cantidad y envía tu pedido por WhatsApp.</p>
      )}
      <ul className="lista" data-guia="productos">
        {productos.map((p, i) => (
          <ProductoFila
            key={p.id}
            guia={i === 0}
            {...p}
            rubro={puesto.rubro}
            whatsapp={puesto.whatsapp}
            accion={
              puesto.whatsapp ? (
                <ControlCantidad producto={p} cantidad={items[p.id]?.cantidad} onCambiar={(c) => fijar(p, c)} guia={p.id === productos.find((x) => x.estado !== 'agotado')?.id} />
              ) : undefined
            }
          />
        ))}
      </ul>

      <section id="plano" className="seccion-plano" data-guia="como-llegar">
        <h2 className="subtitulo">Cómo llegar</h2>
        {puesto.referencia && <p className="nota plano-indicaciones"><strong>Referencia:</strong> {puesto.referencia}</p>}
        {!tieneCoordenadas(puesto) && puesto.mercados?.indicaciones && (
          <p className="nota plano-indicaciones">{puesto.mercados.indicaciones}</p>
        )}
        <MapaMercado mercadoId={puesto.mercado_id} resaltarId={puesto.id} alto={260} />
        {tieneCoordenadas(puesto) && (
          <a
            className="btn-principal centrado"
            href={`https://www.google.com/maps/dir/?api=1&destination=${puesto.lat},${puesto.lng}`}
            target="_blank"
            rel="noreferrer"
            onClick={() => registrarEvento('como_llegar', puesto.id, puesto.owner_id)}
          >
            Cómo llegar con Google Maps
          </a>
        )}
        <Link to={puesto.mercado_id ? `/plano?mercado=${puesto.mercado_id}` : '/plano'} className="enlace-plano">Ver todos los negocios en el mapa</Link>
      </section>

      <ReportarPuesto puesto={puesto} />

      {wa && Object.keys(items).length === 0 && (
        <a className="btn-wa btn-wa-fijo" href={wa} target="_blank" rel="noreferrer" data-guia="whatsapp" onClick={() => registrarEvento('whatsapp', puesto.id, puesto.owner_id)}>
          Escribir al puesto por WhatsApp
        </a>
      )}
      <BarraPedido items={items} onAbrir={() => setVerPedido(true)} />
      {verPedido && (
        <PedidoModal puesto={puesto} items={items} onFijar={fijar} onVaciar={vaciar} onCerrar={() => setVerPedido(false)} />
      )}
      <Recorrido pasos={GUIA_PUESTO} activo={guia.activo} onTerminar={guia.terminar} />
    </main>
  )
}
