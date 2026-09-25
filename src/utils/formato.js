export const formatoPrecio = (precio) =>
  precio == null ? 'Consultar' : `S/ ${Number(precio).toFixed(2)}`

// "A" -> "Pasillo A" (mercado techado); "Jr. Los Olivos cdra. 3" se muestra tal cual (mercado de calle)
export const nombreZona = (zona) => {
  const t = zona?.trim()
  if (!t) return null
  return t.length <= 3 ? `Pasillo ${t}` : t
}

export const ubicacion = (puesto) =>
  [nombreZona(puesto.pasillo), puesto.numero_puesto && `N.º ${puesto.numero_puesto}`]
    .filter(Boolean)
    .join(', ')

export const tieneCoordenadas = (p) => p?.lat != null && p?.lng != null

// Centro por defecto: San Martín de Porres, Lima
export const CENTRO_POR_DEFECTO = [-12.0065, -77.0775]

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

// Para comparar textos sin tildes ni mayúsculas: "Limón " -> "limon"
export const normalizarTexto = (t) =>
  (t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

// "gallina, pollo beneficiado" -> ['gallina', 'pollo beneficiado']
export const separarNombres = (texto) =>
  [...new Set((texto ?? '').split(',').map((t) => t.trim()).filter(Boolean))]
