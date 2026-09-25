import { Link, useNavigate } from 'react-router-dom'
import { borrar } from '../utils/almacen'
import PaginaLegal from '../components/PaginaLegal'
import { LEGAL } from '../legal/datosLegales'

const PREGUNTAS_CLIENTES = [
  ['¿Tengo que descargar algo o registrarme?', 'No. Escanea el QR o abre el enlace y ya puedes buscar. Si quieres, desde el menú del navegador puedes "Agregar a pantalla de inicio" para tenerla como una app.'],
  ['¿Los precios son exactos?', 'Son los que publica cada vendedor y pueden cambiar durante el día. Fíjate en "Actualizado hace…" y, si quieres estar seguro, toca "Preguntar" para escribirle por WhatsApp.'],
  ['¿Cómo hago un pedido?', 'En el puesto toca "Agregar", elige cantidades y toca "Enviar pedido por WhatsApp". El vendedor te confirmará el total.'],
  ['¿Cómo pago?', 'Siempre en persona, al recoger o recibir tu pedido, con efectivo, Yape, Plin o tarjeta según lo que acepte el puesto. Nunca pagues por adelantado.'],
  ['¿Qué significa "Verificado"?', 'Que un encargado de Mercado Digital visitó ese puesto y confirmó que existe.'],
  ['Encontré algo falso o inapropiado', 'Entra al puesto y toca "Reportar este puesto" al final de la página. Lo revisaremos.'],
]

const PREGUNTAS_VENDEDORES = [
  ['¿Cuánto cuesta?', 'Nada. Registrar tu puesto y usar la app es gratis.'],
  ['¿Cómo agrego mis productos rápido?', 'En tu panel toca "Elegir productos del catálogo", marca lo que vendes y luego ponles precio.'],
  ['¿Qué hago cada mañana?', 'Toca "Abrir el día". Así tus clientes saben que atiendes y tus precios aparecen como actualizados.'],
  ['¿Cómo consigo la insignia de Verificado?', 'Un encargado visitará tu puesto. Si quieres que sea pronto, escríbenos.'],
  ['Olvidé mi contraseña', 'En la pantalla de ingreso toca "Olvidé mi contraseña" y sigue el enlace que te llegará al correo (revisa también spam).'],
  ['Quiero dejar de usar la app', 'En tu panel, en "Mi cuenta", puedes descargar tus datos o eliminar tu puesto y tu cuenta.'],
]

function Preguntas({ lista }) {
  return lista.map(([pregunta, respuesta]) => (
    <details key={pregunta} className="pregunta">
      <summary>{pregunta}</summary>
      <p>{respuesta}</p>
    </details>
  ))
}

export default function Ayuda() {
  const navegar = useNavigate()
  const verGuiaCliente = () => {
    ;['md-intro-vista', 'md-guia-inicio', 'md-guia-puesto'].forEach(borrar)
    navegar('/')
  }
  return (
    <PaginaLegal titulo="Ayuda">
      <button className="btn-principal" onClick={verGuiaCliente}>Ver la guía de la app otra vez</button>
      <h2>Para clientes</h2>
      <Preguntas lista={PREGUNTAS_CLIENTES} />
      <h2>Para vendedores</h2>
      <Preguntas lista={PREGUNTAS_VENDEDORES} />
      <h2>Contacto</h2>
      <p>
        Escríbenos a {LEGAL.correo}
        {LEGAL.whatsapp && <> o por <a href={`https://wa.me/${LEGAL.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></>}.
      </p>
      <p>
        Lee también los <Link to="/terminos">Términos y condiciones</Link> y la{' '}
        <Link to="/privacidad">Política de privacidad</Link>.
      </p>
    </PaginaLegal>
  )
}
