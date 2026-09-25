import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import L from 'leaflet'
import { colorRubro } from './IconoRubro'
import { CAPA_MAPA, ATRIBUCION, iconoPin, escapar } from './mapaComun'

// Mapa real con los puestos que marcaron su ubicación
export default function MapaPuestos({ puestos, resaltarId, alto = 320 }) {
  const contenedor = useRef(null)
  const navegar = useNavigate()

  useEffect(() => {
    if (!puestos.length) return
    const mapa = L.map(contenedor.current, { scrollWheelZoom: false })
    L.tileLayer(CAPA_MAPA, { maxZoom: 19, attribution: ATRIBUCION }).addTo(mapa)

    const puntos = []
    for (const p of puestos) {
      const aqui = p.id === resaltarId
      const color = colorRubro(p.rubro)
      const pin = L.marker([p.lat, p.lng], {
        icon: iconoPin({ texto: p.numero_puesto || '•', fondo: color.fondo, color: color.color, resaltado: aqui }),
        title: p.nombre,
        alt: p.nombre,
        zIndexOffset: aqui ? 1000 : 0,
      }).addTo(mapa)
      pin.bindTooltip(escapar(p.nombre), { direction: 'top', offset: [0, aqui ? -52 : -44] })
      if (!aqui) pin.on('click', () => navegar(`/puesto/${p.id}`))
      puntos.push([p.lat, p.lng])
    }

    const marcado = puestos.find((p) => p.id === resaltarId)
    if (marcado) mapa.setView([marcado.lat, marcado.lng], 18)
    else if (puntos.length === 1) mapa.setView(puntos[0], 18)
    else mapa.fitBounds(puntos, { padding: [40, 40], maxZoom: 18 })

    return () => mapa.remove()
  }, [puestos, resaltarId, navegar])

  return <div ref={contenedor} className="mapa" style={{ height: alto }} role="region" aria-label="Mapa de puestos" />
}
