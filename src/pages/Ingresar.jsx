import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function traducir(mensaje) {
  if (mensaje.includes('Invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (mensaje.includes('already registered')) return 'Ese correo ya tiene cuenta. Ingresa con tu contraseña.'
  if (mensaje.includes('at least 6')) return 'La contraseña debe tener al menos 6 caracteres.'
  if (mensaje.includes('Email not confirmed')) return 'Tu correo aún no está confirmado. Revisa tu bandeja de entrada.'
  return mensaje
}

export default function Ingresar() {
  const [modo, setModo] = useState('ingresar')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setMensaje(null)
    const { data, error } =
      modo === 'ingresar'
        ? await supabase.auth.signInWithPassword({ email, password: clave })
        : await supabase.auth.signUp({ email, password: clave })

    if (error) setMensaje({ tipo: 'error', texto: traducir(error.message) })
    else if (modo === 'crear' && !data.session)
      setMensaje({ tipo: 'ok', texto: 'Cuenta creada. Confirma tu correo desde el mensaje que te enviamos y luego ingresa.' })
    setEnviando(false)
  }

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Mercado Digital para vendedores</p>
        <h1>{modo === 'ingresar' ? 'Ingresa a tu puesto' : 'Crea tu cuenta'}</h1>
      </header>

      <form className="formulario" onSubmit={enviar}>
        <label>
          Correo
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            autoComplete={modo === 'ingresar' ? 'current-password' : 'new-password'}
            minLength={6}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
          />
        </label>
        {mensaje && <p className={mensaje.tipo === 'error' ? 'aviso-error' : 'aviso-ok'}>{mensaje.texto}</p>}
        <button className="btn-principal" disabled={enviando}>
          {enviando ? 'Un momento…' : modo === 'ingresar' ? 'Ingresar' : 'Crear cuenta'}
        </button>
      </form>

      <p className="pie">
        {modo === 'ingresar' ? '¿Aún no tienes cuenta? ' : '¿Ya tienes cuenta? '}
        <button className="enlace" onClick={() => { setModo(modo === 'ingresar' ? 'crear' : 'ingresar'); setMensaje(null) }}>
          {modo === 'ingresar' ? 'Crear cuenta' : 'Ingresar'}
        </button>
      </p>
      <p className="pie"><Link to="/">Volver al buscador</Link></p>
    </main>
  )
}
