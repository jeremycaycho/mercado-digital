import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { colorRubro } from './IconoRubro'
import { nombreZona } from '../utils/formato'

const ordenNatural = (a, b) => String(a).localeCompare(String(b), 'es', { numeric: true })
const MAX_HUECOS = 80

// Agrupa los puestos por calle o pasillo y, si los números son correlativos,
// rellena los números que faltan con casilleros vacíos (puestos aún no registrados)
function armarPasillos(puestos) {
  const grupos = new Map()
  for (const p of puestos) {
    const clave = p.pasillo?.trim() || ''
    if (!grupos.has(clave)) grupos.set(clave, [])
    grupos.get(clave).push(p)
  }

  return [...grupos.entries()]
    .sort(([a], [b]) => (a === '' ? 1 : b === '' ? -1 : ordenNatural(a, b)))
    .map(([nombre, lista]) => {
      lista.sort((x, y) => ordenNatural(x.numero_puesto ?? '', y.numero_puesto ?? ''))
      const numeros = lista.map((p) => Number(p.numero_puesto))
      const correlativos =
        numeros.every((n) => Number.isInteger(n)) &&
        new Set(numeros).size === numeros.length &&
        Math.max(...numeros) - Math.min(...numeros) < MAX_HUECOS

      if (!correlativos) return { nombre, celdas: lista.map((p) => ({ puesto: p })) }

      const porNumero = new Map(lista.map((p) => [Number(p.numero_puesto), p]))
      const celdas = []
      for (let n = Math.min(...numeros); n <= Math.max(...numeros); n++) {
        celdas.push(porNumero.has(n) ? { puesto: porNumero.get(n) } : { vacio: n })
      }
      return { nombre, celdas }
    })
}

// Esquema por calle o pasillo, para los puestos que aún no marcaron su ubicación en el mapa
export default function PlanoMercado({ puestos, resaltarId }) {
  const marcado = useRef(null)

  // Desliza la fila para que el puesto marcado quede al centro (sin mover la página)
  useLayoutEffect(() => {
    const celda = marcado.current
    const fila = celda?.parentElement
    if (celda && fila) fila.scrollLeft = celda.offsetLeft - fila.clientWidth / 2 + celda.clientWidth / 2
  }, [puestos])

  const pasillos = armarPasillos(puestos)
  const rubros = [...new Set(puestos.map((p) => p.rubro))]
  const hayVacios = pasillos.some((pa) => pa.celdas.some((c) => c.vacio !== undefined))

  return (
    <div className="plano">
      {pasillos.map((pa) => {
        const activo = pa.celdas.some((c) => c.puesto?.id === resaltarId)
        return (
          <div key={pa.nombre} className={`plano-pasillo ${activo ? 'plano-pasillo-activo' : ''}`}>
            <p className="plano-pasillo-nombre">{nombreZona(pa.nombre) ?? 'Sin calle indicada'}</p>
            <div className="plano-fila">
              {pa.celdas.map((c) => {
                if (c.vacio !== undefined) {
                  return (
                    <span key={`v${c.vacio}`} className="plano-celda plano-vacia" aria-hidden="true">
                      {c.vacio}
                    </span>
                  )
                }
                const p = c.puesto
                const aqui = p.id === resaltarId
                const color = colorRubro(p.rubro)
                return (
                  <Link
                    key={p.id}
                    ref={aqui ? marcado : null}
                    to={`/puesto/${p.id}`}
                    className={`plano-celda ${aqui ? 'plano-aqui' : ''}`}
                    style={aqui ? undefined : { background: color.fondo, color: color.color, borderColor: color.color }}
                    aria-label={`Puesto ${p.numero_puesto ?? 'sin número'}: ${p.nombre}, ${p.rubro}${aqui ? ' (este puesto)' : ''}`}
                    title={p.nombre}
                  >
                    {p.numero_puesto || '•'}
                  </Link>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="plano-leyenda">
        {resaltarId && (
          <span><i className="leyenda-aqui" /> Este puesto</span>
        )}
        {rubros.map((r) => {
          const color = colorRubro(r)
          return (
            <span key={r}>
              <i style={{ background: color.fondo, borderColor: color.color }} /> {r}
            </span>
          )
        })}
        {hayVacios && (
          <span><i className="leyenda-vacia" /> Aún no está en la app</span>
        )}
      </div>
    </div>
  )
}
