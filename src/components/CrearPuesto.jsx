import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const RUBROS = ['Abarrotes', 'Verduras', 'Frutas', 'Carnes', 'Pollo', 'Pescado', 'Menestras', 'Lácteos', 'Otros']

export default function CrearPuesto({ usuario, onCreado, onSalir }) {
  const [mercados, setMercados] = useState([])
  const [form, setForm] = useState({ mercado_id: '', nombre: '', rubro: 'Abarrotes', pasillo: '', numero_puesto: '', referencia: '', whatsapp: '' })
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    supabase.from('mercados').select('id, nombre').order('nombre').then(({ data }) => {
      if (data?.length) {
        setMercados(data)
        setForm((f) => ({ ...f, mercado_id: data[0].id }))
      }
    })
  }, [])

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    setGuardando(true)
    setError(null)
    const digitos = form.whatsapp.replace(/\D/g, '')
    const whatsapp = digitos.length === 9 ? `51${digitos}` : digitos || null
    const { error } = await supabase.from('puestos').insert({ ...form, whatsapp, owner_id: usuario.id })
    setGuardando(false)
    if (error) setError('No se pudo crear el puesto. Revisa los datos e intenta de nuevo.')
    else onCreado()
  }

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Primer paso</p>
        <h1>Registra tu puesto</h1>
      </header>

      <form className="formulario" onSubmit={enviar}>
        <label>
          Mercado
          <select value={form.mercado_id} onChange={cambiar('mercado_id')} required>
            {mercados.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
        </label>
        <label>
          Nombre del puesto
          <input value={form.nombre} onChange={cambiar('nombre')} placeholder="Ej: Abarrotes Don Luis" required />
        </label>
        <label>
          Rubro
          <select value={form.rubro} onChange={cambiar('rubro')}>
            {RUBROS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label>
          Calle, jirón o pasillo
          <input value={form.pasillo} onChange={cambiar('pasillo')} placeholder="Ej: Jr. Los Olivos, cuadra 3" />
        </label>
        <label>
          N.º de puesto o de casa (opcional)
          <input value={form.numero_puesto} onChange={cambiar('numero_puesto')} placeholder="Ej: 12 o 345" />
        </label>
        <label>
          Referencia
          <input value={form.referencia} onChange={cambiar('referencia')} placeholder="Ej: frente a la farmacia, toldo azul" />
        </label>
        <p className="nota sin-margen">Después podrás marcar tu puesto en el mapa desde "Editar datos del puesto".</p>
        <p className="nota sin-margen">Estos datos, incluido tu WhatsApp, se mostrarán a los clientes. Tu correo nunca es público.</p>
        <label>
          WhatsApp del puesto
          <input type="tel" inputMode="numeric" value={form.whatsapp} onChange={cambiar('whatsapp')} placeholder="Ej: 987654321" />
        </label>
        {error && <p className="aviso-error">{error}</p>}
        <button className="btn-principal" disabled={guardando}>{guardando ? 'Guardando…' : 'Registrar puesto'}</button>
      </form>
      <p className="pie"><button className="enlace" onClick={onSalir}>Salir</button></p>
    </main>
  )
}
