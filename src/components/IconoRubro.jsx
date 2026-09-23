// Imagen por defecto según el rubro, dibujada en SVG (no pesa nada ni usa almacenamiento)
const TRAZO = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.5, strokeLinecap: 'round', strokeLinejoin: 'round' }

const RUBROS = {
  Abarrotes: {
    fondo: '#FFF6CF', color: '#6B5500',
    dibujo: (
      <>
        <path d="M17 11h14l-3 7c6 3 10 9 10 15a9 9 0 0 1-9 9H19a9 9 0 0 1-9-9c0-6 4-12 10-15z" />
        <path d="M19 18h10" />
      </>
    ),
  },
  Verduras: {
    fondo: '#E3F1E8', color: '#0E6B41',
    dibujo: (
      <>
        <path d="M11 39 28 19l6 6z" />
        <path d="M31 21l3-10M32 22l9-4M31.5 21.5l7-8" />
        <path d="M19 30l3 2M23 25l3 2" />
      </>
    ),
  },
  Frutas: {
    fondo: '#FDECEA', color: '#B42A22',
    dibujo: (
      <>
        <path d="M24 17c-4-3-13-2-13 8 0 8 6 16 13 14 7 2 13-6 13-14 0-10-9-11-13-8z" />
        <path d="M24 17c0-4 2-7 6-9" />
      </>
    ),
  },
  Carnes: {
    fondo: '#FBE4E1', color: '#8E2A22',
    dibujo: (
      <>
        <path d="M13 17c6-7 21-6 23 4 2 9-5 16-13 16S8 33 8 27c0-4 2-6 5-10z" />
        <circle cx="28" cy="23" r="3.5" />
      </>
    ),
  },
  Pollo: {
    fondo: '#FFF3D1', color: '#8A5A00',
    dibujo: (
      <>
        <path d="M20 28c-4-8 2-18 11-17 9 1 11 11 5 16-5 4-12 3-16 1z" />
        <path d="M20 28l-7 7" />
        <circle cx="11" cy="34" r="2.5" />
        <circle cx="14" cy="37" r="2.5" />
      </>
    ),
  },
  Pescado: {
    fondo: '#E1EEF6', color: '#1F5F8B',
    dibujo: (
      <>
        <path d="M9 24c6-8 18-9 26 0-8 9-20 8-26 0z" />
        <path d="M35 24l6-6v12z" />
        <circle cx="16" cy="22.5" r="1.2" fill="currentColor" />
      </>
    ),
  },
  Menestras: {
    fondo: '#F3EADF', color: '#6B4A2B',
    dibujo: (
      <>
        <path d="M8 25h32c0 9-7 14-16 14S8 34 8 25z" />
        <ellipse cx="18" cy="20" rx="3.5" ry="2.3" />
        <ellipse cx="26" cy="17.5" rx="3.5" ry="2.3" />
        <ellipse cx="32" cy="21" rx="3.5" ry="2.3" />
      </>
    ),
  },
  'Lácteos': {
    fondo: '#EEF2F7', color: '#3A4A5E',
    dibujo: (
      <>
        <path d="M17 18l4-6h6l4 6v24H17z" />
        <path d="M17 18h14M21 12V7h6v5" />
        <path d="M21 28h6" />
      </>
    ),
  },
  Otros: {
    fondo: '#ECEFED', color: '#5E6B63',
    dibujo: (
      <>
        <path d="M9 21h30l-4 17H13z" />
        <path d="M16 21c0-10 16-10 16 0" />
        <path d="M19 26v8M24 26v8M29 26v8" />
      </>
    ),
  },
}

export default function IconoRubro({ rubro, className = '' }) {
  const r = RUBROS[rubro] ?? RUBROS.Otros
  return (
    <div className={`icono-rubro ${className}`} style={{ background: r.fondo, color: r.color }} aria-hidden="true">
      <svg viewBox="0 0 48 48" {...TRAZO}>{r.dibujo}</svg>
    </div>
  )
}
