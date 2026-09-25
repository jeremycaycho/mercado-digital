import { reglaDe, textoCantidad } from '../utils/pedido'

// Botón "Agregar" que se convierte en − cantidad + al tocarlo
export default function ControlCantidad({ producto, cantidad, onCambiar, compacto = false, guia = false }) {
  const regla = reglaDe(producto.unidad)
  const agotado = producto.estado === 'agotado'

  if (!cantidad) {
    return (
      <button
        className="btn-agregar"
        onClick={() => onCambiar(regla.inicial)}
        disabled={agotado}
        aria-label={`Agregar ${producto.nombre} al pedido`}
        data-guia={guia ? 'agregar' : undefined}
      >
        {agotado ? 'Agotado' : 'Agregar'}
      </button>
    )
  }

  return (
    <div className={`control-cantidad ${compacto ? 'compacto' : ''}`} role="group" aria-label={`Cantidad de ${producto.nombre}`}>
      <button onClick={() => onCambiar(cantidad - regla.paso)} aria-label="Menos">−</button>
      <span aria-live="polite">{textoCantidad(cantidad, producto.unidad)}</span>
      <button onClick={() => onCambiar(cantidad + regla.paso)} aria-label="Más">+</button>
    </div>
  )
}
