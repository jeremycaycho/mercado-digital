import { Link } from 'react-router-dom'
import PaginaLegal from '../components/PaginaLegal'
import { LEGAL } from '../legal/datosLegales'

export default function Privacidad() {
  return (
    <PaginaLegal titulo="Política de privacidad">
      <p>
        En {LEGAL.app} cuidamos tus datos personales conforme a la Ley N.° 29733, Ley de Protección de Datos
        Personales, y su Reglamento aprobado por Decreto Supremo N.° 016-2024-JUS. Aquí te explicamos, en palabras
        simples, qué datos usamos, para qué y cuáles son tus derechos.
      </p>

      <h2>1. Responsable de tus datos</h2>
      <p>
        {LEGAL.titular}, DNI {LEGAL.documento}, con domicilio en {LEGAL.domicilio}. Correo de contacto: {LEGAL.correo}.
        El banco de datos de vendedores se encuentra {LEGAL.registroBancoDatos} en el Registro Nacional de Protección de
        Datos Personales.
      </p>

      <h2>2. Qué datos usamos</h2>
      <p><strong>Si eres cliente</strong> no necesitas cuenta ni te pedimos datos personales. Solo registramos, sin
        saber quién eres, qué palabras se buscan y cuántas veces se visita o contacta cada puesto, para mejorar la
        aplicación y mostrar estadísticas a los vendedores.</p>
      <p><strong>Si eres vendedor</strong> usamos:</p>
      <ul>
        <li><strong>Tus datos de identificación:</strong> nombres, apellidos, tipo y número de documento (DNI, carné de extranjería o pasaporte) y celular. <strong>Nunca se muestran a los clientes</strong>: solo los ves tú y el administrador.</li>
        <li>Tu correo y tu contraseña (la contraseña se guarda cifrada; nadie puede verla).</li>
        <li>Los datos de tu puesto: nombre, rubro, calle, número, referencia, WhatsApp, horario, métodos de pago y si abres hoy.</li>
        <li>La ubicación de tu puesto en el mapa, solo si tú decides marcarla. No seguimos tu ubicación: solo guardamos el punto que eliges.</li>
        <li>Las fotos que subes y tus productos con sus precios.</li>
        <li>La fecha en que aceptaste estos documentos.</li>
      </ul>

      <h2>3. Para qué los usamos</h2>
      <ul>
        <li>Crear y proteger tu cuenta, y permitirte recuperar tu contraseña.</li>
        <li>Identificarte como titular del negocio, confirmar tu identidad cuando visitemos tu puesto y evitar cuentas falsas o duplicadas.</li>
        <li>Mostrar tu puesto y tus productos a los clientes, y que puedan contactarte o llegar a ti.</li>
        <li>Verificar puestos en persona y atender reportes de información falsa.</li>
        <li>Mostrarte estadísticas de tu puesto y mejorar la aplicación.</li>
        <li>Enviarte correos necesarios del servicio (confirmación de cuenta y recuperación de contraseña). No enviamos publicidad.</li>
      </ul>
      <p>Tratamos tus datos con tu consentimiento, que das al crear tu cuenta, y porque son necesarios para darte el servicio.</p>

      <h2>4. Qué información es pública</h2>
      <p>
        Los datos de tu puesto (incluidos tu WhatsApp y la ubicación que marques) se muestran a cualquier persona,
        porque ese es el propósito de la aplicación. Tus nombres, tu documento, tu celular personal, tu correo y tu contraseña <strong>nunca</strong> son públicos.
      </p>

      <h2>5. Con quién los compartimos</h2>
      <p>No vendemos ni alquilamos tus datos. Para funcionar usamos proveedores que los procesan por encargo nuestro:</p>
      <ul>
        <li><strong>Supabase</strong>: base de datos, cuentas y fotos.</li>
        <li><strong>Vercel</strong>: publicación de la aplicación.</li>
        <li><strong>Google (Gmail)</strong>: envío de los correos del servicio.</li>
        <li><strong>OpenStreetMap</strong>: dibujo de los mapas (recibe la dirección de conexión de quien ve el mapa, como cualquier sitio web).</li>
      </ul>
      <p>
        Algunos de estos proveedores tienen sus servidores fuera del Perú, por lo que puede existir flujo
        transfronterizo de datos. Solo trabajamos con proveedores que ofrecen medidas de seguridad adecuadas.
      </p>

      <h2>6. Cuánto tiempo los guardamos</h2>
      <p>
        Mientras tu cuenta exista. Si la eliminas, borramos tu cuenta, tu puesto, tus productos y tus fotos. Las
        estadísticas que no identifican a nadie (por ejemplo, cuántas veces se buscó "limón") pueden conservarse.
      </p>

      <h2>7. Seguridad</h2>
      <p>
        Usamos conexiones cifradas (https), contraseñas cifradas y reglas que impiden que un vendedor vea o cambie los
        datos de otro. Ningún sistema es infalible: si detectamos un problema de seguridad que afecte tus datos, te lo
        informaremos.
      </p>

      <h2>8. Tus derechos</h2>
      <p>Tienes derecho a acceder a tus datos, rectificarlos, cancelarlos (eliminarlos) y oponerte a su uso. Puedes hacerlo tú mismo desde tu panel:</p>
      <ul>
        <li><strong>Acceso:</strong> "Mi cuenta" → "Descargar mis datos".</li>
        <li><strong>Rectificación:</strong> "Mi cuenta" → "Corregir mis datos", "Editar datos del puesto" o editando tus productos. Para cambiar tu documento, escríbenos.</li>
        <li><strong>Cancelación:</strong> "Mi cuenta" → "Eliminar mi puesto y mi cuenta".</li>
      </ul>
      <p>
        También puedes escribirnos a {LEGAL.correo}. Te responderemos dentro de los plazos que establece la ley. Si
        consideras que no atendimos tu pedido, puedes presentar una reclamación ante la Autoridad Nacional de
        Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.
      </p>

      <h2>9. Menores de edad</h2>
      <p>Las cuentas de vendedor son solo para mayores de 18 años. No recopilamos a sabiendas datos de menores.</p>

      <h2>10. Almacenamiento en tu navegador</h2>
      <p>
        Guardamos en tu navegador solo lo necesario para que la app funcione: tu sesión si eres vendedor, el mercado
        que elegiste y si ya viste la presentación. No usamos cookies de publicidad ni rastreadores de terceros.
      </p>

      <h2>11. Cambios</h2>
      <p>
        Si cambiamos esta política, actualizaremos la fecha de arriba y, si el cambio es importante, te lo
        avisaremos en la aplicación. Consulta también los <Link to="/terminos">Términos y condiciones</Link>.
      </p>
    </PaginaLegal>
  )
}
