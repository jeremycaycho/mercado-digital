import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { traducirError } from '../utils/errores'
import { LEGAL } from '../legal/datosLegales'

const TITULOS = {
  ingresar: 'Ingresa a tu puesto',
  crear: 'Crea tu cuenta',
  recuperar: 'Recupera tu contraseña',
}

export default function Ingresar() {
  const [modo, setModo] = useState('ingresar')
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [acepta, setAcepta] = useState(false)

  const cambiarModo = (nuevo) => {
    setModo(nuevo)
    setMensaje(null)
    setClave('')
  }

  async function enviar(e) {
    e.preventDefault()
    setEnviando(true)
    setMensaje(null)
    const origen = window.location.origin

    if (modo === 'ingresar') {
      const { error } = await supabase.auth.signInWithPassword({ email, password: clave })
      if (error) setMensaje({ tipo: 'error', texto: traducirError(error.message) })
    }

    if (modo === 'crear') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: clave,
        options: {
          emailRedirectTo: `${origen}/vendedor`,
          // Constancia del consentimiento (Ley 29733): qué versión aceptó y cuándo
          data: { acepta_terminos_version: LEGAL.version, acepta_terminos_en: new Date().toISOString(), mayor_de_edad: true },
        },
      })
      if (error) setMensaje({ tipo: 'error', texto: traducirError(error.message) })
      else if (!data.session)
        setMensaje({
          tipo: 'ok',
          texto: `Te enviamos un correo a ${email}. Ábrelo y toca "Confirmar mi cuenta" para empezar. Si no lo ves, revisa la carpeta de spam.`,
        })
    }

    if (modo === 'recuperar') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origen}/vendedor/nueva-clave`,
      })
      // Por seguridad no se dice si el correo existe o no
      if (error) setMensaje({ tipo: 'error', texto: traducirError(error.message) })
      else
        setMensaje({
          tipo: 'ok',
          texto: `Si ${email} tiene una cuenta, te llegará un correo con un enlace para crear una nueva contraseña. Revisa también la carpeta de spam.`,
        })
    }

    setEnviando(false)
  }

  const textoBoton = { ingresar: 'Ingresar', crear: 'Crear cuenta', recuperar: 'Enviar enlace' }[modo]

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Mercado Digital para vendedores</p>
        <h1>{TITULOS[modo]}</h1>
      </header>

      <form className="formulario" onSubmit={enviar}>
        {modo === 'recuperar' && (
          <p className="sin-margen">Escribe el correo con el que te registraste y te enviaremos un enlace.</p>
        )}
        <label>
          Correo
          <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} required />
        </label>
        {modo !== 'recuperar' && (
          <label>
            Contraseña
            <input
              type="password"
              autoComplete={modo === 'ingresar' ? 'current-password' : 'new-password'}
              minLength={modo === 'crear' ? 8 : undefined}
              value={clave}
              onChange={(e) => setClave(e.target.value)}
              required
            />
            {modo === 'crear' && <span className="nota sin-margen">Mínimo 8 caracteres.</span>}
          </label>
        )}
        {modo === 'crear' && (
          <label className="opcion-radio consentimiento">
            <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} required />
            <span>
              Soy mayor de 18 años y acepto los{' '}
              <Link to="/terminos" target="_blank">Términos y condiciones</Link> y la{' '}
              <Link to="/privacidad" target="_blank">Política de privacidad</Link>. Entiendo que los datos de mi puesto serán públicos.
            </span>
          </label>
        )}
        {mensaje && <p className={mensaje.tipo === 'error' ? 'aviso-error' : 'aviso-ok'}>{mensaje.texto}</p>}
        <button className="btn-principal" disabled={enviando}>{enviando ? 'Un momento…' : textoBoton}</button>
        {modo === 'ingresar' && (
          <button type="button" className="enlace" onClick={() => cambiarModo('recuperar')}>
            Olvidé mi contraseña
          </button>
        )}
      </form>

      <p className="pie">
        {modo === 'ingresar' ? (
          <>¿Aún no tienes cuenta? <button className="enlace" onClick={() => cambiarModo('crear')}>Crear cuenta</button></>
        ) : (
          <>¿Ya tienes cuenta? <button className="enlace" onClick={() => cambiarModo('ingresar')}>Ingresar</button></>
        )}
      </p>
      <p className="pie"><Link to="/">Volver al buscador</Link></p>
    </main>
  )
}
