import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useSesion } from '../hooks/useSesion'
import { traducirError } from '../utils/errores'
import CampoClave from '../components/CampoClave'
import MedidorClave from '../components/MedidorClave'
import { evaluarClave, CLAVE_MINIMA } from '../utils/clave'

// Página a la que llega el vendedor desde el correo de "Olvidé mi contraseña"
export default function NuevaClave() {
  const sesion = useSesion()
  const navegar = useNavigate()
  const [clave, setClave] = useState('')
  const [repetir, setRepetir] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [guardando, setGuardando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (evaluarClave(clave).nivel < CLAVE_MINIMA) return setMensaje('Tu contraseña debe ser al menos "Segura".')
    if (clave !== repetir) return setMensaje('Las dos contraseñas no coinciden.')
    setGuardando(true)
    setMensaje(null)
    const { error } = await supabase.auth.updateUser({ password: clave })
    setGuardando(false)
    if (error) setMensaje(traducirError(error.message))
    else navegar('/vendedor', { replace: true })
  }

  if (sesion === undefined) return <main className="pagina"><p className="vacio">Verificando el enlace…</p></main>

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Mercado Digital para vendedores</p>
        <h1>Crea tu nueva contraseña</h1>
      </header>

      {!sesion ? (
        <>
          <p className="aviso-error">Este enlace ya se usó o venció. Pide uno nuevo desde "Olvidé mi contraseña".</p>
          <p className="pie"><Link to="/vendedor">Ir a ingresar</Link></p>
        </>
      ) : (
        <form className="formulario" onSubmit={enviar}>
          <CampoClave etiqueta="Nueva contraseña" valor={clave} onCambiar={setClave} required ayuda={<MedidorClave clave={clave} />} />
          <CampoClave
            etiqueta="Repite la contraseña"
            valor={repetir}
            onCambiar={setRepetir}
            required
            error={repetir && repetir !== clave ? 'Las contraseñas no coinciden.' : null}
            ayuda={repetir && repetir === clave ? <span className="ok-campo">✓ Las contraseñas coinciden</span> : null}
          />
          {mensaje && <p className="aviso-error">{mensaje}</p>}
          <button className="btn-principal" disabled={guardando}>{guardando ? 'Guardando…' : 'Guardar y entrar a mi puesto'}</button>
        </form>
      )}
    </main>
  )
}
