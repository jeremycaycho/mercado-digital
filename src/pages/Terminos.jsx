import { Link } from 'react-router-dom'
import PaginaLegal from '../components/PaginaLegal'
import { LEGAL } from '../legal/datosLegales'

export default function Terminos() {
  return (
    <PaginaLegal titulo="Términos y condiciones de uso">
      <p>
        Estos términos regulan el uso de {LEGAL.app} ({LEGAL.sitio}), a cargo de {LEGAL.titular}, identificado con
        DNI {LEGAL.documento}, con domicilio en {LEGAL.domicilio} (en adelante, "nosotros"). Al usar la aplicación o
        crear una cuenta de vendedor, aceptas estos términos. Si no estás de acuerdo, no uses la aplicación.
      </p>

      <h2>1. Qué es {LEGAL.app}</h2>
      <p>
        {LEGAL.app} es una vitrina digital gratuita que muestra información de puestos de mercados y ferias:
        productos, precios referenciales, disponibilidad, ubicación y un medio de contacto. <strong>No vendemos
        productos, no cobramos, no recibimos pagos ni realizamos entregas.</strong> Toda compra se acuerda
        directamente entre el cliente y el vendedor, y <strong>el pago se hace siempre en persona</strong>, al recoger
        o recibir el pedido. La aplicación nunca pide pagos por adelantado ni muestra números para transferir.
      </p>

      <h2>2. Quién puede usarla</h2>
      <p>
        Cualquier persona puede consultar la información sin registrarse. Para crear una cuenta de vendedor debes ser
        mayor de 18 años y contar con capacidad legal para ejercer una actividad comercial.
      </p>

      <h2>3. Cuentas de vendedor</h2>
      <ul>
        <li>Debes registrar tus datos personales verdaderos (nombres, apellidos y documento de identidad) y un negocio que exista y que tú atiendas o administres. Solo se permite una cuenta por documento.</li>
        <li>Podemos pedirte que muestres tu documento durante la visita de verificación.</li>
        <li>Eres responsable de mantener en secreto tu contraseña y de todo lo que se haga con tu cuenta.</li>
        <li>Debes mantener actualizados tus precios, la disponibilidad de tus productos y si abres o no.</li>
        <li>La información de tu puesto que registras (nombre, rubro, ubicación, referencia, WhatsApp, horario, métodos de pago, fotos, productos y precios) es <strong>pública</strong>, porque ese es el propósito de la aplicación.</li>
      </ul>

      <h2>4. Responsabilidad del vendedor</h2>
      <p>
        Cada vendedor es el único responsable de los productos que ofrece, de su calidad, precio, peso y medida, de
        cumplir las normas sanitarias, municipales y tributarias que le correspondan, y de respetar los derechos de
        los consumidores establecidos en el Código de Protección y Defensa del Consumidor (Ley N.° 29571). Los precios
        mostrados son referenciales y los define el vendedor.
      </p>

      <h2>5. Productos y contenidos prohibidos</h2>
      <p>No está permitido publicar:</p>
      <ul>
        <li>Productos ilegales, robados, falsificados o de contrabando.</li>
        <li>Medicamentos, drogas, armas, municiones, pirotecnia o sustancias peligrosas.</li>
        <li>Animales silvestres o especies protegidas.</li>
        <li>Bebidas alcohólicas o tabaco dirigidos a menores de edad.</li>
        <li>Fotos o textos ofensivos, discriminatorios, sexuales, engañosos o que infrinjan derechos de otras personas.</li>
      </ul>

      <h2>6. Fotos y contenido que subes</h2>
      <p>
        Al subir fotos o textos confirmas que tienes derecho a usarlos y nos autorizas, de forma gratuita y mientras
        tu cuenta exista, a mostrarlos dentro de la aplicación y en las vistas previas al compartir enlaces. No
        publiques fotos donde se reconozca a otras personas sin su permiso.
      </p>

      <h2>7. Puestos verificados</h2>
      <p>
        La insignia "Verificado" significa que un encargado de {LEGAL.app} visitó el puesto y confirmó que existe. No
        es una garantía sobre la calidad de los productos, los precios ni la atención.
      </p>

      <h2>8. Para los clientes</h2>
      <p>
        La información es referencial y la publica cada vendedor. Te recomendamos confirmar precio y disponibilidad con
        el vendedor antes de ir o de comprar. Si encuentras información falsa o inapropiada, usa la opción
        "Reportar este puesto".
      </p>

      <h2>9. Moderación</h2>
      <p>
        Podemos ocultar o eliminar puestos, productos o fotos, y suspender cuentas, cuando incumplan estos términos,
        reciban reportes fundados o pongan en riesgo a otras personas. Cuando sea posible, te avisaremos el motivo.
      </p>

      <h2>10. Gratuidad y cambios</h2>
      <p>
        El uso de la aplicación es gratuito. Si en el futuro incorporamos servicios de pago, serán opcionales, se
        informarán con anticipación y no afectarán lo que ya es gratuito sin tu aceptación.
      </p>

      <h2>11. Limitación de responsabilidad</h2>
      <p>
        Hacemos lo posible para que la aplicación funcione bien, pero puede tener interrupciones o errores. No somos
        parte de las compras entre clientes y vendedores, por lo que no respondemos por los productos, los precios, los
        pagos ni los acuerdos entre ellos, salvo en lo que la ley no permita excluir.
      </p>

      <h2>12. Propiedad intelectual</h2>
      <p>
        El nombre, el diseño, los textos y el código de {LEGAL.app} nos pertenecen. Los mapas se muestran con datos de
        OpenStreetMap y sus colaboradores.
      </p>

      <h2>13. Fin de la cuenta</h2>
      <p>
        Puedes eliminar tu cuenta y tu puesto cuando quieras desde tu panel, en "Mi cuenta". También podemos cerrar
        cuentas que incumplan estos términos.
      </p>

      <h2>14. Datos personales</h2>
      <p>
        El tratamiento de tus datos se explica en la <Link to="/privacidad">Política de privacidad</Link>.
      </p>

      <h2>15. Ley aplicable y contacto</h2>
      <p>
        Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los
        jueces y tribunales de Lima. Para cualquier consulta, escríbenos a {LEGAL.correo}.
      </p>
    </PaginaLegal>
  )
}
