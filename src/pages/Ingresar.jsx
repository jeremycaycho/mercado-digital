import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { traducirError } from '../utils/errores'
import { LEGAL } from '../legal/datosLegales'
import CampoClave from '../components/CampoClave'
import MedidorClave from '../components/MedidorClave'
import { evaluarClave, CLAVE_MINIMA } from '../utils/clave'
import { TIPOS_DOCUMENTO, validarDocumento, validarCelular, validarNombre, limpiarDocumento } from '../utils/documentos'

const TITULOS = {
  ingresar: 'Ingresa a tu negocio',
  crear: 'Crea tu cuenta',
  recuperar: 'Recupera tu contraseña',
}

const DATOS_VACIOS = { nombres: '', apellidos: '', tipo_documento: 'DNI', numero_documento: '', celular: '' }

export default function Ingresar() {
  const [modo, setModo] = useState('ingresar')
  const [paso, setPaso] = useState(1) // registro: 1 datos personales, 2 cuenta
  const [datos, setDatos] = useState(DATOS_VACIOS)
  const [errores, setErrores] = useState({})
  const [email, setEmail] = useState('')
  const [clave, setClave] = useState('')
  const [repetir, setRepetir] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [acepta, setAcepta] = useState(false)

  const cambiarModo = (nuevo) => {
    setModo(nuevo)
    setPaso(1)
    setMensaje(null)
    setErrores({})
    setClave('')
    setRepetir('')
  }

  const cambiarDato = (campo) => (e) => {
    setDatos((d) => ({ ...d, [campo]: e.target.value }))
    setErrores((er) => ({ ...er, [campo]: null }))
  }

  function validarPaso1() {
    const nuevos = {
      nombres: validarNombre(datos.nombres, 'nombres'),
      apellidos: validarNombre(datos.apellidos, 'apellidos'),
      numero_documento: validarDocumento(datos.tipo_documento, datos.numero_documento),
      celular: validarCelular(datos.celular),
    }
    setErrores(nuevos)
    return !Object.values(nuevos).some(Boolean)
  }

  function continuar(e) {
    e.preventDefault()
    if (validarPaso1()) {
      setPaso(2)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const seguridad = evaluarClave(clave)
  const clavesIguales = repetir.length > 0 && clave === repetir

  async function enviar(e) {
    e.preventDefault()
    setMensaje(null)
    const origen = window.location.origin

    if (modo === 'crear') {
      if (seguridad.nivel < CLAVE_MINIMA) return setMensaje({ tipo: 'error', texto: 'Tu contraseña debe ser al menos "Segura". Sigue las indicaciones de abajo.' })
      if (!clavesIguales) return setMensaje({ tipo: 'error', texto: 'Las dos contraseñas no coinciden.' })
    }

    setEnviando(true)

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
          data: {
            // Datos personales: la base de datos los pasa a una tabla protegida y los quita de aquí
            nombres: datos.nombres.trim(),
            apellidos: datos.apellidos.trim(),
            tipo_documento: datos.tipo_documento,
            numero_documento: limpiarDocumento(datos.numero_documento),
            celular: datos.celular.replace(/\D/g, ''),
            // Constancia del consentimiento (Ley 29733): qué versión aceptó y cuándo
            acepta_terminos_version: LEGAL.version,
            acepta_terminos_en: new Date().toISOString(),
            mayor_de_edad: true,
          },
        },
      })
      if (error) setMensaje({ tipo: 'error', texto: traducirError(error.message) })
      else if (!data.session)
        setMensaje({
          tipo: 'ok',
          texto: `¡Listo, ${datos.nombres.trim().split(' ')[0]}! Te enviamos un correo a ${email}. Ábrelo y toca "Confirmar mi cuenta" para empezar. Si no lo ves, revisa la carpeta de spam.`,
        })
    }

    if (modo === 'recuperar') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origen}/vendedor/nueva-clave` })
      if (error) setMensaje({ tipo: 'error', texto: traducirError(error.message) })
      else
        setMensaje({
          tipo: 'ok',
          texto: `Si ${email} tiene una cuenta, te llegará un correo con un enlace para crear una nueva contraseña. Revisa también la carpeta de spam.`,
        })
    }

    setEnviando(false)
  }

  const registroEnviado = modo === 'crear' && mensaje?.tipo === 'ok'

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Mercado Digital para vendedores</p>
        <h1>{TITULOS[modo]}</h1>
        {modo === 'crear' && !registroEnviado && (
          <div className="pasos-registro" aria-label={`Paso ${paso} de 2`}>
            <span className={paso >= 1 ? 'activo' : ''}>1. Tus datos</span>
            <span className={paso >= 2 ? 'activo' : ''}>2. Tu cuenta</span>
          </div>
        )}
      </header>

      {registroEnviado ? (
        <div className="formulario">
          <p className="aviso-ok sin-margen">{mensaje.texto}</p>
          <button className="btn-secundario" onClick={() => cambiarModo('ingresar')}>Ir a ingresar</button>
        </div>
      ) : modo === 'crear' && paso === 1 ? (
        <form className="formulario" onSubmit={continuar} noValidate>
          <p className="nota sin-margen">
            Tus datos personales son privados: no se muestran a los clientes. Los usamos para verificar que eres el titular del negocio.
          </p>
          <div className="dos-columnas">
            <label>
              Nombres
              <input value={datos.nombres} onChange={cambiarDato('nombres')} autoComplete="given-name" aria-invalid={!!errores.nombres} />
              {errores.nombres && <span className="error-campo">{errores.nombres}</span>}
            </label>
            <label>
              Apellidos
              <input value={datos.apellidos} onChange={cambiarDato('apellidos')} autoComplete="family-name" aria-invalid={!!errores.apellidos} />
              {errores.apellidos && <span className="error-campo">{errores.apellidos}</span>}
            </label>
          </div>
          <div className="dos-columnas">
            <label>
              Tipo de documento
              <select value={datos.tipo_documento} onChange={cambiarDato('tipo_documento')}>
                {TIPOS_DOCUMENTO.map(([valor, texto]) => <option key={valor} value={valor}>{texto}</option>)}
              </select>
            </label>
            <label>
              Número de documento
              <input
                value={datos.numero_documento}
                onChange={cambiarDato('numero_documento')}
                inputMode={datos.tipo_documento === 'PASAPORTE' ? 'text' : 'numeric'}
                maxLength={12}
                autoComplete="off"
                aria-invalid={!!errores.numero_documento}
              />
              {errores.numero_documento && <span className="error-campo">{errores.numero_documento}</span>}
            </label>
          </div>
          <label>
            Celular
            <input type="tel" inputMode="numeric" value={datos.celular} onChange={cambiarDato('celular')} placeholder="987654321" maxLength={11} autoComplete="tel-national" aria-invalid={!!errores.celular} />
            {errores.celular && <span className="error-campo">{errores.celular}</span>}
          </label>
          <button className="btn-principal">Continuar</button>
        </form>
      ) : (
        <form className="formulario" onSubmit={enviar}>
          {modo === 'recuperar' && <p className="sin-margen">Escribe el correo con el que te registraste y te enviaremos un enlace.</p>}
          <label>
            Correo
            <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value.trim())} required />
          </label>

          {modo === 'ingresar' && (
            <CampoClave etiqueta="Contraseña" valor={clave} onCambiar={setClave} autoComplete="current-password" required />
          )}

          {modo === 'crear' && (
            <>
              <CampoClave etiqueta="Crea una contraseña" valor={clave} onCambiar={setClave} required ayuda={<MedidorClave clave={clave} />} />
              <CampoClave
                etiqueta="Repite la contraseña"
                valor={repetir}
                onCambiar={setRepetir}
                required
                error={repetir && !clavesIguales ? 'Las contraseñas no coinciden.' : null}
                ayuda={clavesIguales ? <span className="ok-campo">✓ Las contraseñas coinciden</span> : null}
              />
              <label className="opcion-radio consentimiento">
                <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} required />
                <span>
                  Soy mayor de 18 años, declaro que mis datos son verdaderos y acepto los{' '}
                  <Link to="/terminos" target="_blank">Términos y condiciones</Link> y la{' '}
                  <Link to="/privacidad" target="_blank">Política de privacidad</Link>.
                </span>
              </label>
            </>
          )}

          {mensaje && <p className={mensaje.tipo === 'error' ? 'aviso-error' : 'aviso-ok'}>{mensaje.texto}</p>}

          <div className={modo === 'crear' ? 'acciones' : ''}>
            {modo === 'crear' && <button type="button" className="btn-secundario" onClick={() => setPaso(1)}>Atrás</button>}
            <button
              className="btn-principal"
              disabled={enviando || (modo === 'crear' && (seguridad.nivel < CLAVE_MINIMA || !clavesIguales || !acepta))}
            >
              {enviando ? 'Un momento…' : { ingresar: 'Ingresar', crear: 'Crear mi cuenta', recuperar: 'Enviar enlace' }[modo]}
            </button>
          </div>

          {modo === 'ingresar' && (
            <button type="button" className="enlace" onClick={() => cambiarModo('recuperar')}>Olvidé mi contraseña</button>
          )}
        </form>
      )}

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
