import { useState } from 'react'
import { supabase } from '../supabaseClient'

export const MOTIVOS = [
  ['no_existe', 'El puesto no existe o ya cerró'],
  ['datos_falsos', 'Los datos son falsos o están mal'],
  ['precios_enganosos', 'Los precios no son los reales'],
  ['contenido_inapropiado', 'Fotos o textos inapropiados'],
  ['producto_prohibido', 'Vende algo prohibido'],
  ['otro', 'Otro motivo'],
]

export default function ReportarPuesto({ puesto }) {
  const [abierto, setAbierto] = useState(false)
  const [motivo, setMotivo] = useState('')
  const [detalle, setDetalle] = useState('')
  const [estado, setEstado] = useState('editando')

  async function enviar(e) {
    e.preventDefault()
    setEstado('enviando')
    const { error } = await supabase
      .from('reportes')
      .insert({ puesto_id: puesto.id, motivo, detalle: detalle.trim().slice(0, 500) || null })
    setEstado(error ? 'error' : 'enviado')
  }

  function cerrar() {
    setAbierto(false)
    setMotivo('')
    setDetalle('')
    setEstado('editando')
  }

  return (
    <>
      <button className="enlace enlace-reportar" onClick={() => setAbierto(true)}>Reportar este puesto</button>
      {abierto && (
        <div className="confirmar-fondo" role="dialog" aria-modal="true" aria-labelledby="titulo-reporte">
          <div className="confirmar-caja">
            {estado === 'enviado' ? (
              <>
                <h2 id="titulo-reporte" className="subtitulo">Gracias por avisarnos</h2>
                <p className="sin-margen">Revisaremos "{puesto.nombre}". Tu reporte es anónimo.</p>
                <button className="btn-principal" onClick={cerrar}>Listo</button>
              </>
            ) : (
              <form onSubmit={enviar} className="reporte-form">
                <h2 id="titulo-reporte" className="subtitulo">¿Qué problema encontraste?</h2>
                <fieldset className="grupo-pagos">
                  <legend className="oculto">Motivo</legend>
                  {MOTIVOS.map(([valor, texto]) => (
                    <label key={valor} className="opcion-radio">
                      <input type="radio" name="motivo" value={valor} checked={motivo === valor} onChange={() => setMotivo(valor)} required />
                      {texto}
                    </label>
                  ))}
                </fieldset>
                <label className="campo-etiqueta">
                  Cuéntanos más (opcional)
                  <textarea className="campo-simple" rows={3} maxLength={500} value={detalle} onChange={(e) => setDetalle(e.target.value)} />
                </label>
                {estado === 'error' && <p className="aviso-error">No se pudo enviar. Revisa tu conexión e intenta de nuevo.</p>}
                <button className="btn-principal" disabled={!motivo || estado === 'enviando'}>
                  {estado === 'enviando' ? 'Enviando…' : 'Enviar reporte'}
                </button>
                <button type="button" className="enlace" onClick={cerrar}>Cancelar</button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
