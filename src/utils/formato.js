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
