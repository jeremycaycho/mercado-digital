import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { leer, guardar } from '../utils/almacen'

// ¿Ya vio esta guía? Se guarda en el celular
export const guiaVista = (id) => leer(`md-guia-${id}`) === '1'

// Para volver a verla desde "Ayuda" o "Mi cuenta"
export const repetirGuia = () => window.dispatchEvent(new Event('md-repetir-guia'))

export function useRecorrido(id, listo = true) {
  const [activo, setActivo] = useState(false)
  useEffect(() => {
    if (!listo || guiaVista(id)) return
    const t = setTimeout(() => setActivo(true), 700) // espera a que la pantalla termine de dibujarse
    return () => clearTimeout(t)
  }, [id, listo])
  useEffect(() => {
    const repetir = () => setActivo(true)
    window.addEventListener('md-repetir-guia', repetir)
    return () => window.removeEventListener('md-repetir-guia', repetir)
  }, [])
  const terminar = useCallback(() => {
    guardar(`md-guia-${id}`, '1')
    setActivo(false)
  }, [id])
  return { activo, terminar }
}

const MARGEN = 8

/**
 * Guía paso a paso: ilumina un elemento de la pantalla y explica qué hace.
 * Cada paso: { objetivo: 'nombre de data-guia', titulo, texto }. Si el elemento no existe, se salta.
 */
export default function Recorrido({ pasos, activo, onTerminar }) {
  const [indice, setIndice] = useState(0)
  const [caja, setCaja] = useState(null)
  const burbuja = useRef(null)
  const visibles = pasos.filter((p) => !p.objetivo || document.querySelector(`[data-guia="${p.objetivo}"]`))
  const paso = visibles[indice]

  useEffect(() => { if (activo) setIndice(0) }, [activo])

  // Mientras dura la guía, la app queda bloqueada: no se puede tocar, escribir ni desplazar por error.
  // Solo responden los botones de la guía.
  useEffect(() => {
    if (!activo) return
    const raiz = document.getElementById('root')
    const overflowAnterior = document.body.style.overflow
    raiz?.setAttribute('inert', '')
    raiz?.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = 'hidden'
    document.activeElement?.blur?.()
    return () => {
      raiz?.removeAttribute('inert')
      raiz?.removeAttribute('aria-hidden')
      document.body.style.overflow = overflowAnterior
    }
  }, [activo])

  // Ubica el elemento a iluminar y lo mantiene alineado al hacer scroll o girar el celular
  useLayoutEffect(() => {
    if (!activo || !paso) return
    const el = paso.objetivo && document.querySelector(`[data-guia="${paso.objetivo}"]`)
    if (!el) return setCaja(null)
    el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    let cuadro
    let anterior = ''
    const medir = () => {
      const r = el.getBoundingClientRect()
      const nueva = { top: r.top - MARGEN, left: r.left - MARGEN, width: r.width + MARGEN * 2, height: r.height + MARGEN * 2 }
      const clave = `${nueva.top}|${nueva.left}|${nueva.width}|${nueva.height}`
      if (clave !== anterior) {
        anterior = clave
        setCaja(nueva)
      }
      cuadro = requestAnimationFrame(medir)
    }
    medir()
    return () => cancelAnimationFrame(cuadro)
  }, [activo, paso])

  useEffect(() => { if (activo) burbuja.current?.focus() }, [activo, indice])

  useEffect(() => {
    if (!activo) return
    const alTeclear = (e) => {
      if (e.key === 'Escape') onTerminar()
      if (e.key === 'ArrowRight') setIndice((i) => Math.min(i + 1, visibles.length - 1))
      if (e.key === 'ArrowLeft') setIndice((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [activo, onTerminar, visibles.length])

  if (!activo || !paso) return null
  const ultimo = indice === visibles.length - 1
  const alto = window.innerHeight
  const abajo = !caja || caja.top + caja.height / 2 < alto / 2 // la burbuja va debajo si el elemento está arriba

  const posicionBurbuja = caja
    ? abajo
      ? { top: Math.min(caja.top + caja.height + 14, alto - 220) }
      : { bottom: Math.max(alto - caja.top + 14, 16) }
    : { top: '50%', transform: 'translateY(-50%)' }

  return createPortal(
    <div className="recorrido" aria-live="polite">
      {/* Capa invisible que atrapa cualquier toque fuera de la burbuja */}
      <div className="recorrido-bloqueo" onClick={(e) => e.stopPropagation()} onTouchMove={(e) => e.preventDefault()} />
      {caja ? (
        <div className="recorrido-foco" style={caja} />
      ) : (
        <div className="recorrido-fondo" />
      )}
      <div
        ref={burbuja}
        className={`recorrido-burbuja ${caja ? (abajo ? 'flecha-arriba' : 'flecha-abajo') : ''}`}
        style={posicionBurbuja}
        role="dialog"
        aria-modal="true"
        aria-labelledby="recorrido-titulo"
        tabIndex={-1}
        key={indice}
      >
        <p className="recorrido-contador">Paso {indice + 1} de {visibles.length}</p>
        <h2 id="recorrido-titulo">{paso.titulo}</h2>
        <p>{paso.texto}</p>
        <div className="recorrido-barra"><span style={{ width: `${((indice + 1) / visibles.length) * 100}%` }} /></div>
        <div className="recorrido-botones">
          <button className="enlace" onClick={() => window.confirm('¿Salir de la guía? Podrás verla otra vez desde Ayuda o Mi cuenta.') && onTerminar()}>
            Saltar guía
          </button>
          <div>
            {indice > 0 && <button className="btn-secundario" onClick={() => setIndice(indice - 1)}>Atrás</button>}
            <button className="btn-principal btn-compacto" onClick={() => (ultimo ? onTerminar() : setIndice(indice + 1))}>
              {ultimo ? '¡Entendido!' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
