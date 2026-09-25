import { useCallback, useEffect, useState } from 'react'
import { leer, guardar, borrar } from '../utils/almacen'
import { reglaDe, redondear } from '../utils/pedido'

// El pedido se guarda en el celular del cliente, por puesto, para que no se pierda si sale y vuelve
export function usePedido(puestoId) {
  const clave = `md-pedido-${puestoId}`
  const [items, setItems] = useState(() => {
    try { return JSON.parse(leer(clave) || '{}') } catch { return {} }
  })

  useEffect(() => {
    Object.keys(items).length ? guardar(clave, JSON.stringify(items)) : borrar(clave)
  }, [clave, items])

  const fijar = useCallback((producto, cantidad) => {
    setItems((actual) => {
      const nuevo = { ...actual }
      const c = redondear(cantidad)
      if (c < reglaDe(producto.unidad).minimo) delete nuevo[producto.id]
      else nuevo[producto.id] = { id: producto.id, nombre: producto.nombre, unidad: producto.unidad, precio: producto.precio, cantidad: c }
      return nuevo
    })
  }, [])

  // Mantiene nombres y precios al día con lo que publicó el vendedor; quita lo agotado o eliminado
  const sincronizar = useCallback((productos) => {
    setItems((actual) => {
      const porId = new Map(productos.map((p) => [p.id, p]))
      const nuevo = {}
      for (const i of Object.values(actual)) {
        const p = porId.get(i.id)
        if (p && p.estado !== 'agotado') nuevo[i.id] = { ...i, nombre: p.nombre, unidad: p.unidad, precio: p.precio }
      }
      return nuevo
    })
  }, [])

  const vaciar = useCallback(() => setItems({}), [])

  return { items, fijar, sincronizar, vaciar }
}
