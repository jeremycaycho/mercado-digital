import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { CAPA_MAPA, ATRIBUCION, iconoPin } from './mapaComun'
import { CENTRO_POR_DEFECTO } from '../utils/formato'

const redondear = (n) => Math.round(n * 1e6) / 1e6

// El vendedor marca su puesto: con el GPS estando ahí, tocando el mapa o arrastrando el punto
export default function ElegirUbicacion({ lat, lng, onCambiar }) {
  const contenedor = useRef(null)
  const mapaRef = useRef(null)
  const pinRef = useRef(null)
  const avisar = useRef(onCambiar)
  avisar.current = onCambiar
  const [buscando, setBuscando] = useState(false)
  const [error, setError] = useState(null)

  const colocar = (latlng) => {
    const mapa = mapaRef.current
    if (!mapa) return
    if (pinRef.current) pinRef.current.setLatLng(latlng)
    else {
      pinRef.current = L.marker(latlng, { draggable: true, icon: iconoPin({ texto: '★', resaltado: true }) }).addTo(mapa)
      pinRef.current.on('dragend', (e) => {
        const p = e.target.getLatLng()
        avisar.current(redondear(p.lat), redondear(p.lng))
      })
    }
  }

  useEffect(() => {
    const hayPunto = lat != null && lng != null
    const mapa = L.map(contenedor.current).setView(hayPunto ? [lat, lng] : CENTRO_POR_DEFECTO, hayPunto ? 18 : 15)
    L.tileLayer(CAPA_MAPA, { maxZoom: 19, attribution: ATRIBUCION }).addTo(mapa)
    mapaRef.current = mapa
    if (hayPunto) colocar([lat, lng])
    mapa.on('click', (e) => {
      colocar(e.latlng)
      avisar.current(redondear(e.latlng.lat), redondear(e.latlng.lng))
    })
    // Si el mapa estaba oculto (por ejemplo, dentro de una sección plegable), se reajusta al mostrarse
    const observador = new ResizeObserver(() => mapa.invalidateSize())
    observador.observe(contenedor.current)
    return () => {
      observador.disconnect()
      mapa.remove()
      mapaRef.current = null
      pinRef.current = null
    }
    // Solo se crea una vez; luego el punto se mueve con colocar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function usarMiUbicacion() {
    if (!navigator.geolocation) return setError('Este celular no permite obtener la ubicación.')
    setBuscando(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const punto = [pos.coords.latitude, pos.coords.longitude]
        colocar(punto)
        mapaRef.current?.setView(punto, 18)
        avisar.current(redondear(punto[0]), redondear(punto[1]))
        setBuscando(false)
      },
      () => {
        setError('No se pudo obtener tu ubicación. Revisa que el navegador tenga permiso de ubicación y que el GPS esté activado.')
        setBuscando(false)
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    )
  }

  function quitar() {
    pinRef.current?.remove()
    pinRef.current = null
    avisar.current(null, null)
  }

  return (
    <div className="elegir-ubicacion">
      <button type="button" className="btn-secundario" onClick={usarMiUbicacion} disabled={buscando}>
        {buscando ? 'Buscando tu ubicación…' : 'Estoy en mi puesto: usar mi ubicación'}
      </button>
      <div ref={contenedor} className="mapa" style={{ height: 260 }} role="application" aria-label="Mapa para marcar la ubicación del puesto" />
      <p className="nota sin-margen">También puedes tocar el mapa o arrastrar la estrella para ajustarla.</p>
      {error && <p className="aviso-error">{error}</p>}
      {lat != null && (
        <button type="button" className="enlace" onClick={quitar}>Quitar ubicación del mapa</button>
      )}
    </div>
  )
}
