import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../supabaseClient'
import IconoRubro from './IconoRubro'
import { RUBROS, normalizarTexto } from '../utils/formato'

// El vendedor marca lo que vende de una lista, en vez de escribir producto por producto
export default function CatalogoModal({ rubroInicial, productosActuales, onAgregar, onCerrar }) {
  const [items, setItems] = useState(null)
  const [error, setError] = useState(false)
  const [rubro, setRubro] = useState(rubroInicial || 'Abarrotes')
  const [filtro, setFiltro] = useState('')
  const [elegidos, setElegidos] = useState(() => new Set())
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    supabase
      .from('catalogo')
      .select('id, rubro, nombre, unidad, otros_nombres')
      .order('orden')
      .then(({ data, error }) => (error ? setError(true) : setItems(data)))
  }, [])

  const yaTiene = useMemo(() => new Set(productosActuales.map((p) => normalizarTexto(p.nombre))), [productosActuales])

  const rubros = useMemo(() => {
    const presentes = new Set((items ?? []).map((i) => i.rubro))
    return RUBROS.filter((r) => presentes.has(r))
  }, [items])

  const texto = normalizarTexto(filtro)
  const visibles = (items ?? []).filter((i) =>
    texto
      ? normalizarTexto(`${i.nombre} ${i.otros_nombres.join(' ')}`).includes(texto)
      : i.rubro === rubro
  )

  const alternar = (id) =>
    setElegidos((actual) => {
      const nuevo = new Set(actual)
      nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id)
      return nuevo
    })

  async function agregar() {
    setGuardando(true)
    const lista = items
      .filter((i) => elegidos.has(i.id))
      .map((i) => ({
        nombre: i.nombre,
        unidad: i.unidad,
        otros_nombres: i.otros_nombres,
        catalogo_id: i.id,
        estado: 'disponible',
        precio: null,
      }))
    const ok = await onAgregar(lista)
    setGuardando(false)
    if (ok) onCerrar()
  }

  return (
    <div className="confirmar-fondo" role="dialog" aria-modal="true" aria-labelledby="titulo-catalogo">
      <div className="confirmar-caja catalogo-caja">
        <div className="catalogo-cabecera">
          <h2 id="titulo-catalogo" className="subtitulo">Elige lo que vendes</h2>
          <p className="nota sin-margen">Marca tus productos y luego les pones precio en tu panel.</p>
          <input
            type="search"
            className="catalogo-buscar"
            placeholder="Buscar en el catálogo"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            aria-label="Buscar en el catálogo"
          />
          {!texto && (
            <div className="catalogo-rubros" role="group" aria-label="Rubros del catálogo">
              {rubros.map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`chip-rubro ${r === rubro ? 'activa' : ''}`}
                  aria-pressed={r === rubro}
                  onClick={() => setRubro(r)}
                >
                  <IconoRubro rubro={r} className="chip-rubro-icono" />
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && <p className="aviso-error">No se pudo cargar el catálogo. Revisa tu conexión.</p>}
        {!items && !error && <p className="vacio">Cargando catálogo…</p>}
        {items && visibles.length === 0 && (
          <p className="vacio">No está en el catálogo. Ciérralo y agrégalo a mano con "Agregar otro producto".</p>
        )}

        <ul className="catalogo-lista">
          {visibles.map((i) => {
            const tiene = yaTiene.has(normalizarTexto(i.nombre))
            const marcado = elegidos.has(i.id)
            return (
              <li key={i.id}>
                <label className={`catalogo-item ${marcado ? 'marcado' : ''} ${tiene ? 'deshabilitado' : ''}`}>
                  <input type="checkbox" checked={marcado} disabled={tiene} onChange={() => alternar(i.id)} />
                  <span className="catalogo-nombre">
                    {i.nombre}
                    {texto && <span className="catalogo-detalle"> ({i.rubro})</span>}
                  </span>
                  <span className="catalogo-detalle">{tiene ? 'Ya lo tienes' : `por ${i.unidad}`}</span>
                </label>
              </li>
            )
          })}
        </ul>

        <div className="catalogo-pie">
          <button className="btn-principal" onClick={agregar} disabled={!elegidos.size || guardando}>
            {guardando
              ? 'Agregando…'
              : elegidos.size
                ? `Agregar ${elegidos.size} ${elegidos.size === 1 ? 'producto' : 'productos'}`
                : 'Marca tus productos'}
          </button>
          <button className="enlace" onClick={onCerrar}>Cerrar</button>
        </div>
      </div>
    </div>
  )
}
