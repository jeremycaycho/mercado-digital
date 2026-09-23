export const formatoPrecio = (precio) =>
  precio == null ? 'Consultar' : `S/ ${Number(precio).toFixed(2)}`

export const ubicacion = (puesto) =>
  [
    puesto.pasillo && `Pasillo ${puesto.pasillo}`,
    puesto.numero_puesto && `puesto ${puesto.numero_puesto}`,
  ]
    .filter(Boolean)
    .join(', ')

export function linkWhatsApp(numero, mensaje) {
  if (!numero) return null
  const limpio = numero.replace(/\D/g, '')
  return `https://wa.me/${limpio}?text=${encodeURIComponent(mensaje)}`
}

export const ESTADOS = {
  disponible: { texto: 'Hay', clase: 'estado-ok' },
  pocos: { texto: 'Quedan pocos', clase: 'estado-pocos' },
  agotado: { texto: 'Agotado', clase: 'estado-agotado' },
}

// "hace 5 minutos", "hace 2 horas", "ayer", "hace 3 días"
const relativo = new Intl.RelativeTimeFormat('es', { numeric: 'auto' })

export function haceCuanto(fecha) {
  if (!fecha) return null
  const segundos = Math.round((new Date(fecha).getTime() - Date.now()) / 1000)
  const abs = Math.abs(segundos)
  if (abs < 60) return 'hace un momento'
  if (abs < 3600) return relativo.format(Math.round(segundos / 60), 'minute')
  if (abs < 86400) return relativo.format(Math.round(segundos / 3600), 'hour')
  if (abs < 86400 * 30) return relativo.format(Math.round(segundos / 86400), 'day')
  return `el ${new Date(fecha).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}`
}

// Más de 3 días sin actualizar: se muestra en otro color como aviso
export const esAntiguo = (fecha) => fecha && Date.now() - new Date(fecha).getTime() > 3 * 86400 * 1000

// Fecha de hoy en Lima (formato 2026-09-23), para "Abierto hoy / Cerrado hoy"
export const hoyLima = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Lima' })

// Solo vale si lo marcó HOY; al día siguiente se reinicia solo
export const estadoDeHoy = (puesto) =>
  puesto?.estado_hoy_fecha === hoyLima() ? puesto.estado_hoy : null

export const METODOS_PAGO = ['Efectivo', 'Yape', 'Plin', 'Tarjeta']
export const RUBROS = ['Abarrotes', 'Verduras', 'Frutas', 'Carnes', 'Pollo', 'Pescado', 'Menestras', 'Lácteos', 'Otros']
