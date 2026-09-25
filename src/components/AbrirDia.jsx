import { useState } from 'react'

function saludo() {
  const hora = Number(new Date().toLocaleString('en-US', { timeZone: 'America/Lima', hour: 'numeric', hour12: false }))
  if (hora < 12) return 'Buenos días'
  if (hora < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

// Tarjeta que aparece cada día hasta que el vendedor marca si abre o no
export default function AbrirDia({ productos, onAbrir, onNoAbro }) {
  const [reponer, setReponer] = useState(true)
  const [abriendo, setAbriendo] = useState(false)
  const faltan = productos.filter((p) => p.estado !== 'disponible').length

  async function abrir() {
    setAbriendo(true)
    await onAbrir(reponer)
    setAbriendo(false)
  }

  return (
    <section className="abrir-dia" aria-labelledby="titulo-abrir-dia" data-guia="abrir-dia">
      <h2 id="titulo-abrir-dia" className="abrir-dia-titulo">{saludo()}. ¿Abres hoy?</h2>
      <p className="abrir-dia-texto">
        Con un toque avisas a tus clientes que estás atendiendo y confirmas que tus precios siguen vigentes.
      </p>
      {faltan > 0 && (
        <label className="abrir-dia-opcion">
          <input type="checkbox" checked={reponer} onChange={(e) => setReponer(e.target.checked)} />
          Poner mis {faltan} productos agotados o con pocos como "Hay"
        </label>
      )}
      <button className="btn-principal btn-abrir" onClick={abrir} disabled={abriendo}>
        {abriendo ? 'Abriendo…' : 'Abrir el día'}
      </button>
      <button className="enlace-claro" onClick={onNoAbro} disabled={abriendo}>Hoy no abro</button>
    </section>
  )
}
