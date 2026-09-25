import { useRef, useState } from 'react'

const CLAVE = 'md-intro-vista'

export const introVista = () => {
  try { return localStorage.getItem(CLAVE) === '1' } catch { return true }
}

const PASOS = [
  {
    titulo: 'Busca lo que necesitas',
    texto: 'Escribe "limón", "pollo" o "arroz" y mira qué puestos lo tienen y a qué precio.',
    dibujo: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <rect x="14" y="40" width="92" height="40" rx="12" fill="#fff" stroke="#16241C" strokeWidth="4" />
        <circle cx="40" cy="60" r="10" fill="none" stroke="#0E6B41" strokeWidth="5" />
        <path d="M47 67l9 9" stroke="#0E6B41" strokeWidth="5" strokeLinecap="round" />
        <path d="M64 60h28" stroke="#CBD3CE" strokeWidth="5" strokeLinecap="round" className="intro-escribe" />
      </svg>
    ),
  },
  {
    titulo: 'Compara y elige',
    texto: 'Ve precios, si hay stock y si el puesto abrió hoy. Los verificados fueron visitados en persona.',
    dibujo: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <g className="intro-etiqueta">
          <rect x="12" y="36" width="96" height="48" rx="4" fill="#FFD84A" stroke="#16241C" strokeWidth="4" />
          <text x="60" y="68" textAnchor="middle" fontSize="21" fontWeight="800" fill="#16241C">S/ 4.50</text>
        </g>
      </svg>
    ),
  },
  {
    titulo: 'Escribe o llega directo',
    texto: 'Pregunta por WhatsApp o abre la ruta hasta el puesto con Google Maps.',
    dibujo: (
      <svg viewBox="0 0 120 120" aria-hidden="true">
        <path d="M60 18c-17 0-30 13-30 29 0 22 30 53 30 53s30-31 30-53c0-16-13-29-30-29z" fill="#0E6B41" className="intro-pin" />
        <circle cx="60" cy="47" r="11" fill="#FFD84A" />
      </svg>
    ),
  },
]

// Presentación de 3 pantallas la primera vez que alguien abre la app
export default function Intro({ onTerminar }) {
  const [paso, setPaso] = useState(0)
  const inicioToque = useRef(null)
  const ultimo = paso === PASOS.length - 1

  function terminar() {
    try { localStorage.setItem(CLAVE, '1') } catch { /* sin almacenamiento */ }
    onTerminar()
  }

  const siguiente = () => (ultimo ? terminar() : setPaso((p) => p + 1))
  const anterior = () => setPaso((p) => Math.max(0, p - 1))

  // Deslizar con el dedo para avanzar o retroceder
  const alTocar = (e) => { inicioToque.current = e.touches[0].clientX }
  const alSoltar = (e) => {
    if (inicioToque.current == null) return
    const dx = e.changedTouches[0].clientX - inicioToque.current
    if (dx < -50) siguiente()
    if (dx > 50) anterior()
    inicioToque.current = null
  }

  const actual = PASOS[paso]
  return (
    <div className="intro" role="dialog" aria-modal="true" aria-labelledby="intro-titulo" onTouchStart={alTocar} onTouchEnd={alSoltar}>
      <button className="intro-saltar" onClick={terminar}>Saltar</button>
      <div className="intro-contenido" key={paso}>
        <div className="intro-dibujo">{actual.dibujo}</div>
        <h1 id="intro-titulo">{actual.titulo}</h1>
        <p>{actual.texto}</p>
      </div>
      <div className="intro-puntos" aria-label={`Paso ${paso + 1} de ${PASOS.length}`}>
        {PASOS.map((_, i) => (
          <button key={i} className={i === paso ? 'activo' : ''} onClick={() => setPaso(i)} aria-label={`Ir al paso ${i + 1}`} />
        ))}
      </div>
      <button className="btn-principal intro-boton" onClick={siguiente}>
        {ultimo ? 'Empezar a buscar' : 'Siguiente'}
      </button>
    </div>
  )
}
