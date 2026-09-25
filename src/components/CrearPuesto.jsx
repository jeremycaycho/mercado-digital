import { useState } from 'react'
import { supabase } from '../supabaseClient'
import ElegirUbicacion from './ElegirUbicacion'
import { RUBROS } from '../utils/formato'

export default function CrearPuesto({ usuario, onCreado, onSalir }) {
  const [form, setForm] = useState({ nombre: '', rubro: 'Abarrotes', pasillo: '', numero_puesto: '', referencia: '', whatsapp: '', lat: null, lng: null })
  const [error, setError] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  async function enviar(e) {
    e.preventDefault()
    if (form.lat == null) {
      setError('Marca la ubicación de tu negocio en el mapa. Es lo que usan los clientes para encontrarte.')
      document.getElementById('ubicacion-negocio')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setGuardando(true)
    setError(null)
    const digitos = form.whatsapp.replace(/\D/g, '')
    const { error } = await supabase.from('puestos').insert({
      nombre: form.nombre.trim(),
      rubro: form.rubro,
      pasillo: form.pasillo.trim() || null,
      numero_puesto: form.numero_puesto.trim() || null,
      referencia: form.referencia.trim() || null,
      whatsapp: digitos.length === 9 ? `51${digitos}` : digitos || null,
      lat: form.lat,
      lng: form.lng,
      owner_id: usuario.id,
      // El mercado se asigna solo según la ubicación (si hay uno cerca)
    })
    setGuardando(false)
    if (error) setError('No se pudo crear tu negocio. Revisa los datos e intenta de nuevo.')
    else onCreado()
  }

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Primer paso</p>
        <h1>Registra tu negocio</h1>
      </header>

      <form className="formulario" onSubmit={enviar}>
        <label>
          Nombre de tu negocio o puesto
          <input value={form.nombre} onChange={cambiar('nombre')} placeholder="Ej: Abarrotes Don Luis" required />
        </label>
        <label>
          Rubro
          <select value={form.rubro} onChange={cambiar('rubro')}>
            {RUBROS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        <fieldset className="grupo-pagos" id="ubicacion-negocio">
          <legend>¿Dónde está tu negocio?</legend>
          <p className="nota sin-margen">
            Si estás en tu negocio ahora, toca el botón. Si no, busca el lugar en el mapa y tócalo. Podrás cambiarlo
            después si te mudas.
          </p>
          <ElegirUbicacion lat={form.lat} lng={form.lng} onCambiar={(lat, lng) => setForm((f) => ({ ...f, lat, lng }))} />
          {form.lat != null && <p className="aviso-ok sin-margen">Ubicación guardada. Si no es exacta, arrastra la estrella.</p>}
        </fieldset>

        <label>
          Calle, jirón o avenida
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
        <label>
          WhatsApp del negocio
          <input type="tel" inputMode="numeric" value={form.whatsapp} onChange={cambiar('whatsapp')} placeholder="Ej: 987654321" />
        </label>
        <p className="nota sin-margen">Estos datos, incluido tu WhatsApp y tu ubicación, se mostrarán a los clientes. Tu correo nunca es público.</p>
        {error && <p className="aviso-error">{error}</p>}
        <button className="btn-principal" disabled={guardando}>{guardando ? 'Guardando…' : 'Registrar mi negocio'}</button>
      </form>
      <p className="pie"><button className="enlace" onClick={onSalir}>Salir</button></p>
    </main>
  )
}
