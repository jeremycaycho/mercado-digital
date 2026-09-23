import { useState } from 'react'
import { METODOS_PAGO, RUBROS } from '../utils/formato'

export default function EditarPuesto({ puesto, onGuardar, onCerrar }) {
  const wa = puesto.whatsapp ?? ''
  const [form, setForm] = useState({
    nombre: puesto.nombre ?? '',
    descripcion: puesto.descripcion ?? '',
    rubro: puesto.rubro ?? 'Otros',
    pasillo: puesto.pasillo ?? '',
    numero_puesto: puesto.numero_puesto ?? '',
    whatsapp: wa.length === 11 && wa.startsWith('51') ? wa.slice(2) : wa,
    horario: puesto.horario ?? '',
    metodos_pago: puesto.metodos_pago ?? [],
  })
  const [guardando, setGuardando] = useState(false)

  const cambiar = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))
  const alternarPago = (metodo) =>
    setForm((f) => ({
      ...f,
      metodos_pago: f.metodos_pago.includes(metodo)
        ? f.metodos_pago.filter((m) => m !== metodo)
        : [...f.metodos_pago, metodo],
    }))

  async function enviar(e) {
    e.preventDefault()
    setGuardando(true)
    const digitos = form.whatsapp.replace(/\D/g, '')
    const ok = await onGuardar({
      ...form,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      horario: form.horario.trim() || null,
      whatsapp: digitos.length === 9 ? `51${digitos}` : digitos || null,
    })
    setGuardando(false)
    if (ok) onCerrar()
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h2 className="subtitulo sin-margen">Datos de tu puesto</h2>
      <label>
        Nombre del puesto
        <input value={form.nombre} onChange={cambiar('nombre')} required />
      </label>
      <label>
        Descripción corta
        <input value={form.descripcion} onChange={cambiar('descripcion')} placeholder="Ej: Abarrotes al por mayor y menor" maxLength={120} />
      </label>
      <label>
        Rubro
        <select value={form.rubro} onChange={cambiar('rubro')}>
          {RUBROS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <div className="dos-columnas">
        <label>
          Pasillo
          <input value={form.pasillo} onChange={cambiar('pasillo')} />
        </label>
        <label>
          N.º de puesto
          <input value={form.numero_puesto} onChange={cambiar('numero_puesto')} />
        </label>
      </div>
      <label>
        Horario
        <input value={form.horario} onChange={cambiar('horario')} placeholder="Ej: Lunes a sábado, 6 a. m. a 2 p. m." />
      </label>
      <label>
        WhatsApp del puesto
        <input type="tel" inputMode="numeric" value={form.whatsapp} onChange={cambiar('whatsapp')} placeholder="Ej: 987654321" />
      </label>
      <fieldset className="grupo-pagos">
        <legend>¿Cómo te pueden pagar?</legend>
        <div className="chips">
          {METODOS_PAGO.map((m) => (
            <label key={m} className={`chip-check ${form.metodos_pago.includes(m) ? 'marcado' : ''}`}>
              <input type="checkbox" checked={form.metodos_pago.includes(m)} onChange={() => alternarPago(m)} />
              {m}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="acciones">
        <button type="button" className="btn-secundario" onClick={onCerrar}>Cancelar</button>
        <button className="btn-principal" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar cambios'}</button>
      </div>
    </form>
  )
}
