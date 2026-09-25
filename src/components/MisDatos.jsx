import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { TIPOS_DOCUMENTO, validarCelular, validarNombre } from '../utils/documentos'

const NOMBRE_TIPO = Object.fromEntries(TIPOS_DOCUMENTO)
// Muestra solo los últimos 3 dígitos: ••••• 678
const ocultar = (n = '') => `${'•'.repeat(Math.max(0, n.length - 3))}${n.slice(-3)}`

// Derecho de rectificación: el vendedor ve y corrige sus datos personales
export default function MisDatos({ usuarioId, onCargar }) {
  const [perfil, setPerfil] = useState(undefined)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState(null)
  const [error, setError] = useState(null)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    supabase.from('perfiles').select('*').eq('user_id', usuarioId).maybeSingle().then(({ data }) => {
      setPerfil(data ?? null)
      onCargar?.(data ?? null)
    })
  }, [usuarioId, onCargar])

  async function guardar(e) {
    e.preventDefault()
    const fallo = validarNombre(form.nombres, 'nombres') || validarNombre(form.apellidos, 'apellidos') || validarCelular(form.celular)
    if (fallo) return setError(fallo)
    const cambios = { nombres: form.nombres.trim(), apellidos: form.apellidos.trim(), celular: form.celular.replace(/\D/g, ''), actualizado: new Date().toISOString() }
    const { error } = await supabase.from('perfiles').update(cambios).eq('user_id', usuarioId)
    if (error) return setError('No se guardaron tus datos. Intenta de nuevo.')
    setPerfil((p) => ({ ...p, ...cambios }))
    setEditando(false)
    setError(null)
    setOk(true)
  }

  if (perfil === undefined) return null
  if (perfil === null) {
    return <p className="nota sin-margen">Tu cuenta se creó antes de pedir datos personales. No necesitas hacer nada.</p>
  }

  if (!editando) {
    return (
      <div className="mis-datos">
        <p className="sin-margen"><strong>{perfil.nombres} {perfil.apellidos}</strong></p>
        <p className="nota sin-margen">{NOMBRE_TIPO[perfil.tipo_documento]}: {ocultar(perfil.numero_documento)}. Celular: {perfil.celular ?? 'sin registrar'}.</p>
        {ok && <p className="aviso-ok sin-margen">Datos actualizados.</p>}
        <button className="enlace" onClick={() => { setForm({ nombres: perfil.nombres, apellidos: perfil.apellidos, celular: perfil.celular ?? '' }); setEditando(true); setOk(false) }}>
          Corregir mis datos
        </button>
      </div>
    )
  }

  return (
    <form className="mis-datos" onSubmit={guardar}>
      <div className="dos-columnas">
        <label className="campo-etiqueta">
          Nombres
          <input className="campo-simple" value={form.nombres} onChange={(e) => setForm({ ...form, nombres: e.target.value })} />
        </label>
        <label className="campo-etiqueta">
          Apellidos
          <input className="campo-simple" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })} />
        </label>
      </div>
      <label className="campo-etiqueta">
        Celular
        <input className="campo-simple" type="tel" inputMode="numeric" value={form.celular} onChange={(e) => setForm({ ...form, celular: e.target.value })} />
      </label>
      <p className="nota sin-margen">Para cambiar tu documento, escríbenos: por seguridad no se puede cambiar desde la app.</p>
      {error && <p className="aviso-error">{error}</p>}
      <div className="acciones">
        <button type="button" className="btn-secundario" onClick={() => setEditando(false)}>Cancelar</button>
        <button className="btn-principal">Guardar</button>
      </div>
    </form>
  )
}
