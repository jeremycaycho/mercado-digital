import { useState } from 'react'
import { separarNombres } from '../utils/formato'

const UNIDADES = ['kg', 'unidad', 'docena', 'atado', 'paquete', 'bolsa', 'litro']

export default function NuevoProducto({ onAgregar }) {
  const [abierto, setAbierto] = useState(false)
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [unidad, setUnidad] = useState('kg')
  const [otros, setOtros] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (!nombre.trim()) return
    setGuardando(true)
    const ok = await onAgregar({
      nombre: nombre.trim(),
      precio: precio === '' ? null : Number(precio),
      unidad,
      otros_nombres: separarNombres(otros),
      estado: 'disponible',
    })
    setGuardando(false)
    if (ok) {
      setNombre('')
      setPrecio('')
      setOtros('')
      setAbierto(false)
    }
  }

  if (!abierto) {
    return <button className="btn-secundario ancho-completo" onClick={() => setAbierto(true)}>Agregar otro producto a mano</button>
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <label>
        Nombre del producto
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Fideo tallarín" required autoFocus />
      </label>
      <label>
        Otros nombres (opcional)
        <input value={otros} onChange={(e) => setOtros(e.target.value)} placeholder="Ej: tallarín, pasta" />
        <span className="nota sin-margen">Cómo le dicen tus clientes, separado por comas. Te ayuda a aparecer en más búsquedas.</span>
      </label>
      <div className="dos-columnas">
        <label>
          Precio S/
          <input type="number" inputMode="decimal" step="0.10" min="0" value={precio} onChange={(e) => setPrecio(e.target.value)} />
        </label>
        <label>
          Se vende por
          <select value={unidad} onChange={(e) => setUnidad(e.target.value)}>
            {UNIDADES.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </label>
      </div>
      <div className="acciones">
        <button type="button" className="btn-secundario" onClick={() => setAbierto(false)}>Cancelar</button>
        <button className="btn-principal" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar producto'}</button>
      </div>
    </form>
  )
}
