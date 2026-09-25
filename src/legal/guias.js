// Textos de las guías paso a paso. Cada "objetivo" corresponde a un data-guia en la pantalla.

export const GUIA_INICIO = [
  { objetivo: 'buscador', titulo: 'Busca un producto', texto: 'Escribe lo que necesitas, por ejemplo "limón" o "pollo". Entiende plurales, errores y otros nombres como "palta" o "aguacate".' },
  { objetivo: 'categorias', titulo: 'O explora por categoría', texto: 'Toca una categoría para ver solo esos puestos. Toca otra vez para ver todos.' },
  { objetivo: 'lista-puestos', titulo: 'Elige un puesto', texto: 'Arriba salen los que abrieron hoy y los verificados. Toca uno para ver sus productos y precios.' },
  { objetivo: 'mapa', titulo: 'Mira dónde está cada puesto', texto: 'En el mapa ves todos los puestos y puedes pedir la ruta para llegar.' },
]

export const GUIA_PUESTO = [
  { objetivo: 'productos', titulo: 'Arma tu pedido', texto: 'Toca "Agregar" en lo que quieras y ajusta la cantidad con − y +. En productos por kilo puedes pedir desde 250 g.' },
  { objetivo: 'barra-pedido', titulo: 'Revisa tu pedido', texto: 'Aquí ves cuántos productos llevas y el total. Tócalo para elegir cómo pagas y enviarlo por WhatsApp.' },
  { objetivo: 'como-llegar', titulo: 'Llega sin perderte', texto: 'Mira el puesto en el mapa y abre la ruta con Google Maps.' },
  { objetivo: 'whatsapp', titulo: '¿Tienes una duda?', texto: 'Escribe directamente al vendedor por WhatsApp.' },
]

export const GUIA_VENDEDOR = [
  { titulo: '¡Bienvenido a tu panel!', texto: 'Te mostramos en un minuto cómo sacarle provecho. Puedes volver a ver esta guía cuando quieras desde "Mi cuenta".' },
  { objetivo: 'abrir-dia', titulo: 'Cada mañana: "Abrir el día"', texto: 'Un toque y tus clientes saben que atiendes. Además tus precios aparecen como actualizados.' },
  { objetivo: 'estado-hoy', titulo: 'Abierto o cerrado', texto: 'Si cambias de idea durante el día, márcalo aquí. Los puestos cerrados bajan en la lista.' },
  { objetivo: 'guia-puesto', titulo: 'Completa tu puesto', texto: 'Sigue esta lista: los puestos completos aparecen mejor y generan más confianza.' },
  { objetivo: 'catalogo', titulo: 'Agrega productos en segundos', texto: 'Marca lo que vendes de una lista en vez de escribir uno por uno. Luego les pones precio.' },
  { objetivo: 'producto-editable', titulo: 'Tus productos', texto: 'Cambia el estado con un toque (Hay, Pocos, Agotado), escribe el precio y toma una foto con la cámara.' },
  { objetivo: 'mi-qr', titulo: 'Tu QR', texto: 'Descárgalo, imprímelo y ponlo en tu puesto. También puedes compartirlo por WhatsApp.' },
  { objetivo: 'tu-semana', titulo: 'Tus resultados', texto: 'Aquí ves cuántos te visitaron, te escribieron o te hicieron pedidos, y qué buscan los clientes que nadie tiene.' },
]
