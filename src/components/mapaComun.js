import L from 'leaflet'

export const CAPA_MAPA = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
export const ATRIBUCION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'

const escapar = (t = '') =>
  String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// Pin cuadrado con el número del puesto y un piquito abajo
export function iconoPin({ texto = '•', fondo = '#fff', color = '#16241C', resaltado = false }) {
  const estilo = resaltado ? '' : `background:${fondo};color:${color};border-color:${color}`
  return L.divIcon({
    className: 'pin-contenedor',
    html: `<span class="pin ${resaltado ? 'pin-aqui' : ''}" style="${estilo}">${escapar(texto)}</span>`,
    iconSize: resaltado ? [44, 52] : [36, 44],
    iconAnchor: resaltado ? [22, 52] : [18, 44],
  })
}

export { escapar }
