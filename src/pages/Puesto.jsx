import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ProductoFila from '../components/ProductoFila'
import MapaMercado from '../components/MapaMercado'
import { ubicacion, linkWhatsApp, estadoDeHoy, tieneCoordenadas } from '../utils/formato'

const ORDEN = { disponible: 0, pocos: 1, agotado: 2 }

export default function Puesto() {
  const { id } = useParams()
  const [puesto, setPuesto] = useState(null)
  const [carga, setCarga] = useState('cargando')

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
        setCarga('listo')
      })
  }, [id])

  if (carga === 'cargando') {
    return <main className="pagina"><p className="vacio">Cargando puesto…</p></main>
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

      <header className="puesto-cabecera">
        <span className="puesto-rubro">
          {puesto.rubro}
          {hoy && <span className={`badge-hoy badge-${hoy}`}>{hoy === 'abierto' ? 'Abierto hoy' : 'Cerrado hoy'}</span>}
        </span>
        <h1>{puesto.nombre}</h1>
        {puesto.descripcion && <p className="puesto-desc">{puesto.descripcion}</p>}
        <p className="puesto-donde">
          {ubicacion(puesto) && <><strong>{ubicacion(puesto)}</strong> en </>}
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
      <ul className="lista">
        {productos.map((p) => (
          <ProductoFila key={p.id} {...p} rubro={puesto.rubro} whatsapp={puesto.whatsapp} />
        ))}
      </ul>

      <section id="plano" className="seccion-plano">
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
          >
            Cómo llegar con Google Maps
          </a>
        )}
        <Link to={`/plano?mercado=${puesto.mercado_id}`} className="enlace-plano">Ver todos los puestos en el mapa</Link>
      </section>

      {wa && (
        <a className="btn-wa btn-wa-fijo" href={wa} target="_blank" rel="noreferrer">
          Escribir al puesto por WhatsApp
        </a>
      )}
    </main>
  )
}
