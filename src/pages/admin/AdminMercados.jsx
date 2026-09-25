import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../supabaseClient'

const VACIO = { nombre: '', distrito: '', direccion: '', indicaciones: '' }

function FormMercado({ inicial, textoBoton, onGuardar }) {
  const [form, setForm] = useState({ ...VACIO, ...inicial })
  const [guardando, setGuardando] = useState(false)
  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    setGuardando(true)
    const limpio = {
      nombre: form.nombre.trim(),
      distrito: form.distrito.trim() || null,
      direccion: form.direccion.trim() || null,
      indicaciones: form.indicaciones.trim() || null,
    }
    const ok = await onGuardar(limpio)
    setGuardando(false)
    if (ok && !inicial?.id) setForm(VACIO)
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <label>
        Nombre del mercado o feria
        <input value={form.nombre} onChange={cambiar('nombre')} required placeholder="Ej: Feria del Jr. Los Olivos" />
      </label>
      <div className="dos-columnas">
        <label>
          Distrito
          <input value={form.distrito ?? ''} onChange={cambiar('distrito')} placeholder="Ej: San Martín de Porres" />
        </label>
        <label>
          Dirección
          <input value={form.direccion ?? ''} onChange={cambiar('direccion')} placeholder="Ej: Jr. Los Olivos cdras. 3 y 4" />
        </label>
      </div>
      <label>
        Indicaciones para llegar
        <textarea rows={2} value={form.indicaciones ?? ''} onChange={cambiar('indicaciones')} placeholder="Ej: Frente al parque, los domingos se extiende hasta la cuadra 5" />
      </label>
      <button className="btn-principal" disabled={guardando}>{guardando ? 'Guardando…' : textoBoton}</button>
    </form>
  )
}

export default function AdminMercados({ avisar }) {
  const [mercados, setMercados] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('mercados')
      .select('id, nombre, distrito, direccion, indicaciones, puestos(count)')
      .order('created_at')
      .then(({ data, error }) => (error ? setError('No se pudieron cargar los mercados.') : setMercados(data)))
  }, [])

  async function guardar(id, cambios) {
    const { error } = await supabase.from('mercados').update(cambios).eq('id', id)
    if (error) {
      setError('No se guardaron los cambios.')
      return false
    }
    setMercados((lista) => lista.map((m) => (m.id === id ? { ...m, ...cambios } : m)))
    avisar('Mercado guardado')
    return true
  }

  async function crear(datos) {
    const { data, error } = await supabase.from('mercados').insert(datos).select('id, nombre, distrito, direccion, indicaciones').single()
    if (error) {
      setError('No se pudo crear el mercado.')
      return false
    }
    setMercados((lista) => [...lista, { ...data, puestos: [{ count: 0 }] }])
    avisar(`${data.nombre} creado. Los vendedores ya pueden elegirlo al registrarse.`)
    return true
  }

  if (!mercados) return error ? <p className="aviso-error">{error}</p> : <p className="vacio">Cargando mercados…</p>

  return (
    <section>
      {error && <p className="aviso-error">{error}</p>}
      {mercados.map((m) => (
        <details key={m.id} className="admin-mercado">
          <summary>
            <strong>{m.nombre}</strong>
            <span className="nota sin-margen"> {m.puestos?.[0]?.count ?? 0} puestos</span>
          </summary>
          <FormMercado inicial={m} textoBoton="Guardar cambios" onGuardar={(c) => guardar(m.id, c)} />
          <Link to={`/plano?mercado=${m.id}`} className="enlace-plano">Ver mapa de este mercado</Link>
        </details>
      ))}

      <h2 className="subtitulo">Nuevo mercado o feria</h2>
      <p className="nota">Cuando la app llegue a otro lugar, créalo aquí. Los vendedores lo verán en la lista al registrar su puesto.</p>
      <FormMercado textoBoton="Crear mercado" onGuardar={crear} />
    </section>
  )
}
