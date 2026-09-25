import { soles, totales } from '../utils/pedido'

// Barra fija abajo con el resumen del pedido
export default function BarraPedido({ items, onAbrir }) {
  const { cantidad, total } = totales(items)
  if (!cantidad) return null
  return (
    <button className="barra-pedido" onClick={onAbrir} data-guia="barra-pedido">
      <span className="barra-pedido-cantidad">{cantidad}</span>
      <span>Ver mi pedido</span>
      <strong>{soles(total)}</strong>
    </button>
  )
}
