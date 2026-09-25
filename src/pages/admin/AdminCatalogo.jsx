import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import IconoRubro from '../../components/IconoRubro'
import { RUBROS, separarNombres, normalizarTexto } from '../../utils/formato'

const UNIDADES = ['kg', 'unidad', 'docena', 'atado', 'paquete', 'bolsa', 'litro']

function ItemCatalogo({ item, onGuardarOtros, onEliminar }) {
  const [otros, setOtros] = useState(item.otros_nombres.join(', '))
  return (
    <li className="admin-item">
      <div className="admin-item-cabeza">
        <strong>{item.nombre}</strong>
        <span className="nota sin-margen">por {item.unidad}</span>
      </div>
      <input
        className="campo-simple"
        value={otros}
        onChange={(e) => setOtros(e.target.value)}
        onBlur={() => otros !== item.otros_nombres.join(', ') && onGuardarOtros(item, separarNombres(otros))}
        placeholder="Otros nombres, separados por comas"
        aria-label={`Otros nombres de ${item.nombre}`}
      />
      <button className="btn-eliminar" onClick={() => onEliminar(item)}>Quitar del catálogo</button>
    </li>
  )
}

export default function AdminCatalogo({ avisar }) {
  const [items, setItems] = useState(null)
  const [rubro, setRubro] = useState('Abarrotes')
  const [nuevo, setNuevo] = useState({ nombre: '', unidad: 'kg', otros: '' })
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('catalogo')
      .select('*')
      .order('orden')
      .then(({ data, error }) => (error ? setError('No se pudo cargar el catálogo.') : setItems(data)))
  }, [])

  const delRubro = (items ?? []).filter((i) => i.rubro === rubro)

  async function agregar(e) {
    e.preventDefault()
    const nombre = nuevo.nombre.trim()
    if (!nombre) return
    if (delRubro.some((i) => normalizarTexto(i.nombre) === normalizarTexto(nombre))) {
      return setError(`"${nombre}" ya está en ${rubro}.`)
    }
    const { data, error } = await supabase
      .from('catalogo')
      .insert({
        rubro,
        nombre,
        unidad: nuevo.unidad,
        otros_nombres: separarNombres(nuevo.otros),
        orden: delRubro.length ? Math.max(...delRubro.map((i) => i.orden)) + 1 : 0,
      })
      .select()
      .single()
    if (error) return setError('No se pudo agregar. Intenta de nuevo.')
    setError(null)
    setItems((lista) => [...lista, data])
    setNuevo({ nombre: '', unidad: 'kg', otros: '' })
    avisar(`${nombre} agregado al catálogo`)
  }

  async function guardarOtros(item, otros_nombres) {
    const { error } = await supabase.from('catalogo').update({ otros_nombres }).eq('id', item.id)
    if (error) return setError('No se guardaron los otros nombres.')
    setItems((lista) => lista.map((i) => (i.id === item.id ? { ...i, otros_nombres } : i)))
    avisar('Otros nombres guardados')
  }

  async function eliminar(item) {
    if (!window.confirm(`¿Quitar "${item.nombre}" del catálogo? Los puestos que ya lo tienen no lo pierden.`)) return
    const { error } = await supabase.from('catalogo').delete().eq('id', item.id)
    if (error) return setError('No se pudo quitar.')
    setItems((lista) => lista.filter((i) => i.id !== item.id))
    avisar('Quitado del catálogo')
  }

  if (!items) return error ? <p className="aviso-error">{error}</p> : <p className="vacio">Cargando catálogo…</p>

  return (
    <section>
      <p className="nota">Estos son los productos que los vendedores pueden marcar al registrarse.</p>
      <div className="catalogo-rubros admin-rubros" role="group" aria-label="Rubros">
        {RUBROS.map((r) => (
          <button key={r} className={`chip-rubro ${r === rubro ? 'activa' : ''}`} aria-pressed={r === rubro} onClick={() => setRubro(r)}>
            <IconoRubro rubro={r} className="chip-rubro-icono" />
            {r} ({items.filter((i) => i.rubro === r).length})
          </button>
        ))}
      </div>

      <form className="formulario" onSubmit={agregar}>
        <h2 className="subtitulo sin-margen">Agregar a {rubro}</h2>
        <div className="dos-columnas">
          <label>
            Nombre
            <input value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Ej: Olluco" required />
          </label>
          <label>
            Se vende por
            <select value={nuevo.unidad} onChange={(e) => setNuevo({ ...nuevo, unidad: e.target.value })}>
              {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </label>
        </div>
        <label>
          Otros nombres (opcional)
          <input value={nuevo.otros} onChange={(e) => setNuevo({ ...nuevo, otros: e.target.value })} placeholder="Ej: ulluco, papa lisa" />
        </label>
        {error && <p className="aviso-error">{error}</p>}
        <button className="btn-principal">Agregar al catálogo</button>
      </form>

      <h2 className="subtitulo">{delRubro.length} productos en {rubro}</h2>
      <ul className="lista">
        {delRubro.map((i) => (
          <ItemCatalogo key={i.id} item={i} onGuardarOtros={guardarOtros} onEliminar={eliminar} />
        ))}
      </ul>
    </section>
  )
}
