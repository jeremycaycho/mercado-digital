// Reglas de cantidades según cómo se vende cada producto
const REGLAS = {
  kg: { inicial: 1, paso: 0.25, minimo: 0.25, rapidas: [0.25, 0.5, 1, 2] },
  litro: { inicial: 1, paso: 0.5, minimo: 0.5, rapidas: [0.5, 1, 2] },
}
const POR_DEFECTO = { inicial: 1, paso: 1, minimo: 1, rapidas: null }
export const reglaDe = (unidad) => REGLAS[unidad] ?? POR_DEFECTO

const PLURALES = { unidad: 'unidades', docena: 'docenas', atado: 'atados', paquete: 'paquetes', bolsa: 'bolsas' }
const numero = (n) => n.toLocaleString('es-PE', { maximumFractionDigits: 2 })

// 0.25 kg -> "250 g", 1.5 kg -> "1.5 kg", 2 unidades -> "2 unidades"
export function textoCantidad(cantidad, unidad) {
  if (unidad === 'kg') return cantidad < 1 ? `${Math.round(cantidad * 1000)} g` : `${numero(cantidad)} kg`
  if (unidad === 'litro') return cantidad < 1 ? `${Math.round(cantidad * 1000)} ml` : `${numero(cantidad)} L`
  return `${numero(cantidad)} ${cantidad === 1 ? unidad : PLURALES[unidad] ?? unidad}`
}

export const soles = (n) => `S/ ${n.toFixed(2)}`
export const redondear = (n) => Math.round(n * 100) / 100

export function totales(items) {
  const lista = Object.values(items)
  const conPrecio = lista.filter((i) => i.precio != null)
  return {
    cantidad: lista.length,
    total: redondear(conPrecio.reduce((suma, i) => suma + i.precio * i.cantidad, 0)),
    sinPrecio: lista.length - conPrecio.length,
  }
}

// Mensaje que el CLIENTE le envía al vendedor por WhatsApp
export function armarMensaje({ tienda, items, nombre, pago, entrega, nota }) {
  const lista = Object.values(items)
  const { total, sinPrecio } = totales(items)
  const lineas = lista.map((i) => {
    const detalle = i.precio != null ? soles(redondear(i.precio * i.cantidad)) : 'precio por confirmar'
    return `• ${textoCantidad(i.cantidad, i.unidad)} de ${i.nombre}: ${detalle}`
  })
  return [
    `Hola, ${tienda}. ${nombre ? `Soy ${nombre} y ` : ''}quiero hacer este pedido desde Mercado Digital:`,
    '',
    ...lineas,
    '',
    `Total aproximado: ${soles(total)}${sinPrecio ? ` (más ${sinPrecio} ${sinPrecio === 1 ? 'producto' : 'productos'} por confirmar)` : ''}`,
    pago && `Pago en persona: ${pago}`,
    entrega && `Entrega: ${entrega}`,
    nota && `Nota: ${nota}`,
    '',
    '¿Me confirmas si tienes todo y el total final? Gracias.',
  ]
    .filter((l) => l !== false && l !== null && l !== undefined)
    .join('\n')
}
