import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { repetirGuia } from './Recorrido'

// Derechos del vendedor: descargar sus datos (acceso) y eliminar su cuenta (cancelación)
export default function MiCuenta({ usuario, puesto, productos }) {
  const navegar = useNavigate()
  const [confirmando, setConfirmando] = useState(false)
  const [texto, setTexto] = useState('')
  const [eliminando, setEliminando] = useState(false)
  const [error, setError] = useState(null)

  function descargarDatos() {
    const datos = {
      exportado_el: new Date().toISOString(),
      cuenta: { correo: usuario.email, creada_el: usuario.created_at, acepto: usuario.user_metadata ?? {} },
      puesto,
      productos,
    }
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mis-datos-mercado-digital.json'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  async function eliminar() {
    setEliminando(true)
    setError(null)
    try {
      // 1) Borra las fotos guardadas en su carpeta
      const { data: archivos } = await supabase.storage.from('fotos').list(usuario.id, { limit: 1000 })
      if (archivos?.length) {
        await supabase.storage.from('fotos').remove(archivos.map((a) => `${usuario.id}/${a.name}`))
      }
      // 2) Borra puesto, productos y la cuenta
      const { error } = await supabase.rpc('eliminar_mi_cuenta')
      if (error) throw error
      await supabase.auth.signOut()
      navegar('/?cuenta=eliminada', { replace: true })
    } catch {
      setError('No se pudo eliminar la cuenta. Revisa tu conexión e intenta de nuevo, o escríbenos.')
      setEliminando(false)
    }
  }

  return (
    <details className="mi-cuenta">
      <summary>Mi cuenta</summary>
      <p className="nota">Ingresaste como {usuario.email}.</p>
      <button className="btn-secundario ancho-completo" onClick={descargarDatos}>Descargar mis datos</button>
      <button className="btn-secundario ancho-completo" onClick={() => { window.scrollTo(0, 0); repetirGuia() }}>Ver la guía otra vez</button>
      <button className="btn-secundario ancho-completo" onClick={() => supabase.auth.signOut()}>Cerrar sesión</button>
      <p className="nota">
        <Link to="/terminos">Términos</Link> · <Link to="/privacidad">Privacidad</Link> · <Link to="/ayuda">Ayuda</Link>
      </p>

      {!confirmando ? (
        <button className="btn-eliminar" onClick={() => setConfirmando(true)}>Eliminar mi puesto y mi cuenta</button>
      ) : (
        <div className="zona-peligro">
          <p className="sin-margen">
            <strong>Esto no se puede deshacer.</strong> Se borrarán tu puesto, tus productos, tus fotos y tu cuenta.
            Los clientes ya no podrán encontrarte.
          </p>
          <label className="campo-etiqueta">
            Para confirmar, escribe ELIMINAR
            <input className="campo-simple" value={texto} onChange={(e) => setTexto(e.target.value)} autoComplete="off" />
          </label>
          {error && <p className="aviso-error">{error}</p>}
          <div className="acciones">
            <button className="btn-secundario" onClick={() => { setConfirmando(false); setTexto('') }} disabled={eliminando}>Cancelar</button>
            <button className="btn-peligro" onClick={eliminar} disabled={texto.trim().toUpperCase() !== 'ELIMINAR' || eliminando}>
              {eliminando ? 'Eliminando…' : 'Eliminar para siempre'}
            </button>
          </div>
        </div>
      )}
    </details>
  )
}
