// Textos de las guías paso a paso. Cada "objetivo" corresponde a un data-guia en la pantalla.
// Si un elemento no está en pantalla (por ejemplo, aún no hay pedido), ese paso se salta solo.

export const GUIA_INICIO = [
  { titulo: '¡Bienvenido a Mercado Digital!', texto: 'Te mostramos en pocos pasos cómo encontrar lo que buscas. Durante la guía la pantalla queda bloqueada: solo usa los botones de abajo.' },
  { objetivo: 'buscador', titulo: 'Paso 1: busca un producto', texto: 'Escribe lo que necesitas, por ejemplo "limón" o "pollo". No importa si te equivocas en una letra o escribes en plural: igual lo encuentra.' },
  { objetivo: 'elegir-mercado', titulo: 'Elige dónde buscar', texto: 'Si quieres ver solo los puestos de un mercado, tócalo aquí. Si no, verás todos los negocios.' },
  { objetivo: 'categorias', titulo: 'O explora por categoría', texto: 'Toca una categoría, como Verduras o Pollo, para ver solo esos negocios. Tócala otra vez para ver todos.' },
  { objetivo: 'primer-puesto', titulo: 'Así se ve cada negocio', texto: 'Ves su rubro, si abrió hoy, su ubicación y cuántos productos tiene. El check azul significa que lo visitamos en persona.' },
  { objetivo: 'lista-puestos', titulo: 'Toca un negocio', texto: 'Arriba salen los que abrieron hoy. Toca cualquiera para ver sus productos, precios y hacer tu pedido.' },
  { objetivo: 'mapa', titulo: 'Míralos en el mapa', texto: 'Ve dónde está cada negocio y pide la ruta para llegar.' },
  { objetivo: 'pie-ayuda', titulo: '¿Necesitas ayuda?', texto: 'Aquí abajo están la Ayuda, los Términos y la Privacidad. Desde Ayuda puedes ver esta guía otra vez.' },
]

export const GUIA_PUESTO = [
  { titulo: 'Así se hace un pedido', texto: 'En pocos pasos te mostramos cómo pedir en este negocio. Solo usa los botones de la guía.' },
  { objetivo: 'datos-puesto', titulo: 'Conoce el negocio', texto: 'Aquí ves si abrió hoy, dónde está, su horario y cómo puedes pagarle en persona.' },
  { objetivo: 'primer-producto', titulo: 'Cada producto', texto: 'Ves su precio en la etiqueta amarilla, si hay stock y cuándo se actualizó. Si dice "hace varios días", confírmalo con el vendedor.' },
  { objetivo: 'agregar', titulo: 'Paso 1: agrega productos', texto: 'Toca "Agregar" en lo que quieras. Aparecerán los botones − y + para elegir la cantidad. En productos por kilo puedes pedir desde 250 g.' },
  { objetivo: 'barra-pedido', titulo: 'Paso 2: revisa tu pedido', texto: 'Aquí ves cuántos productos llevas y el total. Tócalo para ajustar cantidades y elegir cómo pagas.' },
  { titulo: 'Paso 3: envíalo por WhatsApp', texto: 'Al tocar "Enviar pedido por WhatsApp" se abre el chat con tu lista y el total ya escritos. El vendedor te confirma y pagas en persona al recibir.' },
  { objetivo: 'como-llegar', titulo: 'Llega sin perderte', texto: 'Mira el negocio en el mapa y abre la ruta con Google Maps.' },
  { objetivo: 'whatsapp', titulo: '¿Tienes una duda?', texto: 'Escribe directamente al vendedor por WhatsApp.' },
  { objetivo: 'reportar', titulo: 'Si algo no está bien', texto: 'Si encuentras información falsa o inapropiada, avísanos aquí. Es anónimo.' },
]

export const GUIA_VENDEDOR = [
  { titulo: '¡Bienvenido a tu panel!', texto: 'Te mostramos en un minuto cómo sacarle provecho. Durante la guía la pantalla queda bloqueada: solo usa los botones de abajo.' },
  { objetivo: 'abrir-dia', titulo: 'Cada mañana: "Abrir el día"', texto: 'Un toque y tus clientes saben que atiendes. Además, tus precios aparecen como actualizados.' },
  { objetivo: 'estado-hoy', titulo: 'Abierto o cerrado', texto: 'Si cambias de idea durante el día, márcalo aquí. Los negocios cerrados bajan en la lista.' },
  { objetivo: 'foto-puesto', titulo: 'La foto de tu negocio', texto: 'Tócala para abrir la cámara, tomar la foto y confirmar si te gusta. Es lo primero que ven tus clientes.' },
  { objetivo: 'editar-puesto', titulo: 'Tus datos del negocio', texto: 'Aquí cambias tu horario, cómo te pagan, tu WhatsApp y tu ubicación si te mudas.' },
  { objetivo: 'guia-puesto', titulo: 'Completa tu negocio', texto: 'Sigue esta lista: los negocios completos aparecen mejor y generan más confianza.' },
  { objetivo: 'catalogo', titulo: 'Agrega productos en segundos', texto: 'Marca lo que vendes de una lista en vez de escribir uno por uno. Luego les pones precio.' },
  { objetivo: 'agregar-mano', titulo: '¿No está en la lista?', texto: 'Agrégalo aquí escribiendo el nombre, el precio y cómo se vende (kg, unidad, atado…).' },
  { objetivo: 'producto-editable', titulo: 'Tus productos', texto: 'Cambia el estado con un toque (Hay, Pocos, Agotado), escribe el precio y toma una foto con la cámara. Todo se guarda solo.' },
  { objetivo: 'mi-qr', titulo: 'Tu QR', texto: 'Descárgalo, imprímelo y ponlo en tu negocio. También puedes compartirlo por WhatsApp.' },
  { objetivo: 'tu-semana', titulo: 'Tus resultados', texto: 'Cuántos te visitaron, te escribieron o te hicieron pedidos, y qué buscan los clientes que nadie tiene.' },
  { titulo: 'Cómo te llegan los pedidos', texto: 'Los clientes arman su pedido en la app y te llega a tu WhatsApp con la lista y el total. Confírmales y cobra en persona al entregar.' },
  { objetivo: 'mi-cuenta', titulo: 'Tu cuenta', texto: 'Aquí corriges tus datos, ves esta guía otra vez, descargas tus datos o cierras sesión.' },
]
