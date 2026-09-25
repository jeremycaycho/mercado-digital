import { useEffect, useMemo, useState } from 'react'
import ControlCantidad from './ControlCantidad'
import { armarMensaje, reglaDe, soles, textoCantidad, totales, redondear } from '../utils/pedido'
import { leer, guardar } from '../utils/almacen'
import { registrarEvento } from '../utils/estadisticas'

const ENTREGAS = ['Recojo en el puesto', 'Coordinar entrega por WhatsApp']

export default function PedidoModal({ puesto, items, onFijar, onVaciar, onCerrar }) {
  const lista = Object.values(items)
  const { total, sinPrecio } = totales(items)
  const opcionesPago = [...(puesto.metodos_pago ?? []), 'Aún no sé']

  const [nombre, setNombre] = useState(() => leer('md-nombre-cliente') ?? '')
  const [pago, setPago] = useState(opcionesPago[0])
  const [entrega, setEntrega] = useState(ENTREGAS[0])
  const [nota, setNota] = useState('')
  const [editado, setEditado] = useState(null) // mensaje escrito a mano por el cliente
  const [enviado, setEnviado] = useState(false)

  const automatico = useMemo(
    () => armarMensaje({ tienda: puesto.nombre, items, nombre: nombre.trim(), pago, entrega, nota: nota.trim() }),
    [puesto.nombre, items, nombre, pago, entrega, nota]
  )
  const mensaje = editado ?? automatico

  useEffect(() => { guardar('md-nombre-cliente', nombre) }, [nombre])

  // Cerrar con la tecla Esc
  useEffect(() => {
    const alTeclear = (e) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [onCerrar])

  const enlace = `https://wa.me/${puesto.whatsapp}?text=${encodeURIComponent(mensaje)}`

  function enviar() {
    registrarEvento('pedido', puesto.id, puesto.owner_id)
    setEnviado(true)
  }


  return (
    <div className="confirmar-fondo" role="dialog" aria-modal="true" aria-labelledby="titulo-pedido">
      <div className="confirmar-caja pedido-caja">
        <div className="pedido-cabecera">
          <h2 id="titulo-pedido" className="subtitulo sin-margen">Tu pedido en {puesto.nombre}</h2>
          <button className="cerrar-x" onClick={onCerrar} aria-label="Cerrar">×</button>
        </div>

        <div className="pedido-cuerpo">
          {puesto.nota_pedidos && <p className="aviso-precio sin-margen">{puesto.nota_pedidos}</p>}

          {lista.length === 0 && <p className="vacio">Tu pedido está vacío. Agrega productos desde la lista.</p>}

          <ul className="lista pedido-lista">
            {lista.map((i) => {
              const regla = reglaDe(i.unidad)
              return (
                <li key={i.id} className="pedido-item">
                  <div className="pedido-item-fila">
                    <strong>{i.nombre}</strong>
                    <span>{i.precio != null ? soles(redondear(i.precio * i.cantidad)) : 'Por confirmar'}</span>
                  </div>
                  <div className="pedido-item-fila">
                    <ControlCantidad producto={i} cantidad={i.cantidad} onCambiar={(c) => onFijar(i, c)} compacto />
                    <button className="btn-eliminar" onClick={() => onFijar(i, 0)}>Quitar</button>
                  </div>
                  {regla.rapidas && (
                    <div className="chips cantidades-rapidas" role="group" aria-label="Cantidades rápidas">
                      {regla.rapidas.map((c) => (
                        <button key={c} className={`chip-rubro ${i.cantidad === c ? 'activa' : ''}`} onClick={() => onFijar(i, c)}>
                          {textoCantidad(c, i.unidad)}
                        </button>
                      ))}
                    </div>
                  )}
                  {i.precio != null && <span className="nota sin-margen">{soles(i.precio)} por {i.unidad}</span>}
                </li>
              )
            })}
          </ul>

          {lista.length > 0 && (
            <>
              <div className="pedido-total">
                <span>Total aproximado</span>
                <strong>{soles(total)}</strong>
              </div>
              <p className="nota sin-margen">
                {sinPrecio > 0 && `${sinPrecio} ${sinPrecio === 1 ? 'producto no tiene' : 'productos no tienen'} precio publicado. `}
                El vendedor te confirmará el total final: el peso exacto puede variar un poco.
              </p>

              <label className="campo-etiqueta">
                Tu nombre (opcional)
                <input className="campo-simple" value={nombre} onChange={(e) => { setNombre(e.target.value); setEditado(null) }} maxLength={40} />
              </label>

              <fieldset className="grupo-pagos">
                <legend>¿Cómo pagarás en persona?</legend>
                <div className="chips">
                  {opcionesPago.map((o) => (
                    <button key={o} type="button" className={`chip-rubro ${pago === o ? 'activa' : ''}`} aria-pressed={pago === o} onClick={() => { setPago(o); setEditado(null) }}>
                      {o}
                    </button>
                  ))}
                </div>
                <p className="nota sin-margen">
                  El pago se hace cara a cara, cuando recoges o recibes tu pedido y ya ves los productos. No pagues por adelantado.
                </p>
              </fieldset>

              <fieldset className="grupo-pagos">
                <legend>¿Cómo lo recibes?</legend>
                <div className="chips">
                  {ENTREGAS.map((o) => (
                    <button key={o} type="button" className={`chip-rubro ${entrega === o ? 'activa' : ''}`} aria-pressed={entrega === o} onClick={() => { setEntrega(o); setEditado(null) }}>
                      {o}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="campo-etiqueta">
                Nota para el vendedor (opcional)
                <input className="campo-simple" value={nota} onChange={(e) => { setNota(e.target.value); setEditado(null) }} placeholder="Ej: el limón bien jugoso, por favor" maxLength={120} />
              </label>

              <details className="mensaje-previo">
                <summary>Ver o editar el mensaje que se enviará</summary>
                <textarea className="campo-simple" rows={9} value={mensaje} onChange={(e) => setEditado(e.target.value)} />
                {editado !== null && <button className="enlace" onClick={() => setEditado(null)}>Volver al mensaje automático</button>}
              </details>
            </>
          )}
        </div>

        {lista.length > 0 && (
          <div className="pedido-pie">
            {enviado ? (
              <>
                <p className="pago-persona sin-margen">
                  Espera la confirmación del vendedor por WhatsApp. Pagarás <strong>en persona</strong> al recibir tu pedido.
                </p>
                <p className="nota sin-margen">¿Ya enviaste tu pedido por WhatsApp?</p>
                <div className="acciones">
                  <a className="btn-secundario centrado" href={enlace} target="_blank" rel="noreferrer">Enviar otra vez</a>
                  <button className="btn-principal" onClick={() => { onVaciar(); onCerrar() }}>Sí, vaciar pedido</button>
                </div>
              </>
            ) : (
              <a className="btn-principal btn-wa-pedido centrado" href={enlace} target="_blank" rel="noreferrer" onClick={enviar}>
                Enviar pedido por WhatsApp · {soles(total)}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
