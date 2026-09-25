import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ProductoFila from '../components/ProductoFila'
import IconoRubro from '../components/IconoRubro'
import InsigniaVerificado from '../components/InsigniaVerificado'
import { ubicacion, estadoDeHoy, RUBROS } from '../utils/formato'
import { registrarBusqueda } from '../utils/estadisticas'
import { leer, guardar, borrar } from '../utils/almacen'
import Esqueleto from '../components/Esqueleto'
import Intro, { introVista } from '../components/Intro'
import SelectorMercado from '../components/SelectorMercado'

function EstadoHoy({ puesto }) {
  const hoy = estadoDeHoy(puesto)
  if (!hoy) return null
  return <span className={`badge-hoy badge-${hoy}`}>{hoy === 'abierto' ? 'Abierto hoy' : 'Cerrado hoy'}</span>
}

// Abiertos hoy primero, sin marcar al medio, cerrados hoy al final
const PESO_HOY = { abierto: 0, cerrado: 2 }
const pesoHoy = (p) => PESO_HOY[estadoDeHoy(p)] ?? 1

function IconoTodos() {
  return (
    <div className="icono-rubro categoria-icono" style={{ background: '#E3F1E8', color: '#0E6B41' }} aria-hidden="true">
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="10" y="10" width="12" height="12" rx="3" />
        <rect x="26" y="10" width="12" height="12" rx="3" />
        <rect x="10" y="26" width="12" height="12" rx="3" />
        <rect x="26" y="26" width="12" height="12" rx="3" />
      </svg>
    </div>
  )
}

export default function Inicio() {
  const [termino, setTermino] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [puestos, setPuestos] = useState(null)
  const [error, setError] = useState(null)
  const [params, setParams] = useSearchParams()
  const rubroActivo = params.get('rubro')
  const mercadoParam = params.get('mercado')
  const [mercados, setMercados] = useState(null)
  const [mercadoId, setMercadoId] = useState(null)
  const [verIntro, setVerIntro] = useState(() => !introVista())
  const [cuentaEliminada] = useState(() => params.get('cuenta') === 'eliminada')

  // Mercados disponibles
  useEffect(() => {
    supabase
      .from('mercados')
      .select('id, nombre, distrito')
      .order('created_at')
      .then(({ data, error }) => (error ? setError('No se pudo cargar la información. Revisa tu conexión.') : setMercados(data ?? [])))
  }, [])

  // Mercado actual: el del enlace o QR, luego el último elegido, o el único que exista
  useEffect(() => {
    if (!mercados) return
    const existe = (id) => mercados.some((m) => m.id === id)
    const elegido = [mercadoParam, leer('md-mercado')].find((id) => id && existe(id)) ?? (mercados.length === 1 ? mercados[0].id : null)
    setMercadoId(elegido)
    if (elegido) guardar('md-mercado', elegido)
  }, [mercados, mercadoParam])

  const mercado = mercados?.find((m) => m.id === mercadoId)

  const elegirMercado = (id) => {
    guardar('md-mercado', id)
    setParams({ mercado: id }, { replace: true })
    setMercadoId(id)
  }

  const cambiarMercado = () => {
    borrar('md-mercado')
    setPuestos(null)
    setTermino('')
    setParams({}, { replace: true })
    setMercadoId(null)
  }

  // Solo se muestran las categorías que tienen al menos un puesto
  const categorias = useMemo(() => {
    const conteo = {}
    for (const p of puestos ?? []) conteo[p.rubro] = (conteo[p.rubro] ?? 0) + 1
    return Object.keys(conteo).sort((a, b) => {
      const ia = RUBROS.indexOf(a)
      const ib = RUBROS.indexOf(b)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    }).map((r) => ({ rubro: r, cantidad: conteo[r] }))
  }, [puestos])

  const puestosVisibles = useMemo(
    () =>
      (puestos ?? [])
        .filter((p) => !rubroActivo || p.rubro === rubroActivo)
        .sort((a, b) => pesoHoy(a) - pesoHoy(b) || Number(b.verificado) - Number(a.verificado) || a.nombre.localeCompare(b.nombre)),
    [puestos, rubroActivo]
  )

  // La categoría queda en la dirección (?rubro=Verduras): el botón "atrás" y los enlaces funcionan
  const elegirRubro = (rubro) =>
    setParams(
      (actual) => {
        const nuevo = new URLSearchParams(actual)
        nuevo.delete('cuenta')
        rubro ? nuevo.set('rubro', rubro) : nuevo.delete('rubro')
        return nuevo
      },
      { replace: true }
    )

  // Carga los puestos del mercado actual
  useEffect(() => {
    if (!mercadoId) return
    supabase
      .from('puestos')
      .select('id, nombre, rubro, pasillo, numero_puesto, foto_url, estado_hoy, estado_hoy_fecha, verificado, productos(count)')
      .eq('activo', true)
      .eq('mercado_id', mercadoId)
      .order('nombre')
      .then(({ data, error }) => {
        if (error) setError('No se pudieron cargar los puestos. Revisa tu conexión.')
        else setPuestos(data)
      })
  }, [mercadoId])

  // Búsqueda con pausa de 300 ms mientras el usuario escribe
  useEffect(() => {
    const t = termino.trim()
    if (t.length < 2) {
      setResultados([])
      setBuscando(false)
      return
    }
    setBuscando(true)
    const timer = setTimeout(async () => {
      const { data, error } = await supabase.rpc('buscar_productos', { termino: t, p_mercado: mercadoId })
      if (error) setError('La búsqueda falló. Intenta de nuevo.')
      else {
        setError(null)
        setResultados(data)
      }
      setBuscando(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [termino, mercadoId])

  const texto = termino.trim()
  const hayBusqueda = texto.length >= 2
  const exactos = resultados.filter((r) => r.coincide).length
  const soloParecidos = resultados.length > 0 && exactos === 0

  // Se registra la búsqueda cuando el cliente deja de escribir 1.5 s (no cada letra)
  useEffect(() => {
    if (buscando || texto.length < 3) return
    const timer = setTimeout(() => registrarBusqueda(texto, resultados.length, exactos, mercadoId), 1500)
    return () => clearTimeout(timer)
  }, [texto, buscando, resultados, exactos, mercadoId])

  if (verIntro) return <Intro onTerminar={() => setVerIntro(false)} />

  if (mercados && mercados.length > 1 && !mercadoId) {
    return <SelectorMercado mercados={mercados} onElegir={elegirMercado} />
  }

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">
          {mercado ? mercado.nombre : 'Mercado Digital'}
          {mercados?.length > 1 && (
            <button className="enlace-claro cambiar-mercado" onClick={cambiarMercado}>Cambiar</button>
          )}
        </p>
        <h1>¿Qué estás buscando?</h1>
        <input
          type="search"
          className="buscador"
          placeholder="Ej: limón, arroz, pollo"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          aria-label="Buscar producto"
        />
      </header>

      {cuentaEliminada && (
        <p className="aviso-ok">Tu cuenta y tu puesto fueron eliminados. Gracias por haber usado Mercado Digital.</p>
      )}
      {error && <p className="aviso-error">{error}</p>}

      {hayBusqueda ? (
        <section>
          <h2 className="subtitulo">
            {buscando
              ? 'Buscando…'
              : soloParecidos
                ? `No encontramos "${texto}". ¿Quizás buscas esto?`
                : `${exactos} ${exactos === 1 ? 'resultado' : 'resultados'} para "${texto}"`}
          </h2>
          {!buscando && resultados.length === 0 && (
            <p className="vacio">
              Ningún puesto tiene "{texto}" todavía. Prueba con otra palabra o revisa las categorías.
            </p>
          )}
          <ul className="lista">
            {resultados.map((r) => (
              <ProductoFila
                key={r.producto_id}
                nombre={r.producto}
                precio={r.precio}
                unidad={r.unidad}
                estado={r.estado}
                foto_url={r.foto_url}
                updated_at={r.updated_at}
                rubro={r.rubro}
                whatsapp={r.whatsapp}
                puesto={{
                  id: r.puesto_id,
                  nombre: r.puesto,
                  pasillo: r.pasillo,
                  numero_puesto: r.numero_puesto,
                  cerradoHoy: r.cerrado_hoy,
                  verificado: r.verificado,
                }}
              />
            ))}
          </ul>
        </section>
      ) : (
        <section>
          {categorias.length > 1 && (
            <nav className="categorias" aria-label="Categorías">
              <button
                className={`categoria ${!rubroActivo ? 'activa' : ''}`}
                aria-pressed={!rubroActivo}
                onClick={() => elegirRubro(null)}
              >
                <IconoTodos />
                <span>Todos</span>
              </button>
              {categorias.map(({ rubro }) => (
                <button
                  key={rubro}
                  className={`categoria ${rubroActivo === rubro ? 'activa' : ''}`}
                  aria-pressed={rubroActivo === rubro}
                  onClick={() => elegirRubro(rubroActivo === rubro ? null : rubro)}
                >
                  <IconoRubro rubro={rubro} className="categoria-icono" />
                  <span>{rubro}</span>
                </button>
              ))}
            </nav>
          )}

          <Link to={`/plano${mercadoId ? `?mercado=${mercadoId}` : ''}`} className="enlace-plano">Ver mapa del mercado</Link>
          <h2 className="subtitulo">
            {rubroActivo
              ? `${puestosVisibles.length} ${puestosVisibles.length === 1 ? 'puesto' : 'puestos'} de ${rubroActivo}`
              : 'Puestos del mercado'}
          </h2>
          {!puestos && !error && <Esqueleto filas={5} />}
          {puestos?.length === 0 && (
            <p className="vacio">Este mercado todavía no tiene puestos registrados. ¡Pronto habrá más!</p>
          )}
          {rubroActivo && puestos?.length > 0 && puestosVisibles.length === 0 && (
            <p className="vacio">
              Todavía no hay puestos de {rubroActivo}.{' '}
              <button className="enlace" onClick={() => elegirRubro(null)}>Ver todos</button>
            </p>
          )}
          <ul className="lista-puestos">
            {puestosVisibles.map((p) => (
              <li key={p.id}>
                <Link to={`/puesto/${p.id}`} className="puesto-fila">
                  {p.foto_url ? (
                    <img className="puesto-mini" src={p.foto_url} alt="" loading="lazy" />
                  ) : (
                    <IconoRubro rubro={p.rubro} className="puesto-mini" />
                  )}
                  <span className="puesto-rubro">
                    {p.rubro}
                    <EstadoHoy puesto={p} />
                  </span>
                  <span className="puesto-nombre">
                    {p.nombre} {p.verificado && <InsigniaVerificado compacta />}
                  </span>
                  <span className="puesto-ubicacion">{ubicacion(p)}</span>
                  <span className="puesto-conteo">{p.productos?.[0]?.count ?? 0} productos</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="pie">
        ¿Tienes un puesto? <Link to="/vendedor">Regístralo gratis</Link>
      </p>
    </main>
  )
}
