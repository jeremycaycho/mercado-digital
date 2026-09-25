import { tieneCoordenadas } from '../utils/formato'

// Lista de tareas para dejar el puesto completo, con barra de avance
export default function GuiaVendedor({ puesto, productos, onEditar, onCatalogo, onQR }) {
  const conPrecio = productos.filter((p) => p.precio != null).length
  const conFoto = productos.filter((p) => p.foto_url).length

  const tareas = [
    { hecho: productos.length >= 5, texto: 'Agrega al menos 5 productos', accion: onCatalogo },
    { hecho: productos.length > 0 && conPrecio === productos.length, texto: 'Ponle precio a todos tus productos' },
    { hecho: !!puesto.foto_url, texto: 'Toma una foto de tu puesto', accion: null, pista: 'Toca el recuadro "Foto del puesto"' },
    { hecho: tieneCoordenadas(puesto), texto: 'Marca tu puesto en el mapa', accion: onEditar },
    { hecho: !!puesto.horario && puesto.metodos_pago?.length > 0, texto: 'Agrega tu horario y cómo te pagan', accion: onEditar },
    { hecho: conFoto >= 3, texto: 'Toma foto a 3 de tus productos', pista: 'Toca "Tomar foto" en cada producto' },
  ]
  const hechas = tareas.filter((t) => t.hecho).length
  if (hechas === tareas.length) return null

  return (
    <section className="guia" aria-labelledby="titulo-guia" data-guia="guia-puesto">
      <div className="guia-cabecera">
        <h2 id="titulo-guia" className="subtitulo sin-margen">Completa tu puesto</h2>
        <span className="guia-contador">{hechas} de {tareas.length}</span>
      </div>
      <div className="guia-barra" role="progressbar" aria-valuemin={0} aria-valuemax={tareas.length} aria-valuenow={hechas}>
        <span style={{ width: `${(hechas / tareas.length) * 100}%` }} />
      </div>
      <p className="nota sin-margen">Los puestos completos aparecen mejor y generan más confianza.</p>
      <ul className="guia-lista">
        {tareas.map((t) => (
          <li key={t.texto} className={t.hecho ? 'hecho' : ''}>
            <span className="guia-check" aria-hidden="true">{t.hecho ? '✓' : ''}</span>
            {t.hecho || !t.accion ? (
              <span>{t.texto}{!t.hecho && t.pista && <span className="guia-pista"> ({t.pista})</span>}</span>
            ) : (
              <button className="enlace" onClick={t.accion}>{t.texto}</button>
            )}
            <span className="oculto">{t.hecho ? '(hecho)' : '(pendiente)'}</span>
          </li>
        ))}
      </ul>
      {hechas >= 4 && (
        <p className="nota sin-margen">¡Ya casi! Cuando termines, <button className="enlace" onClick={onQR}>descarga tu QR</button> y ponlo en tu puesto.</p>
      )}
    </section>
  )
}
