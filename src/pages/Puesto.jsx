import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ProductoFila from '../components/ProductoFila'
import { ubicacion, linkWhatsApp } from '../utils/formato'

const ORDEN = { disponible: 0, pocos: 1, agotado: 2 }

export default function Puesto() {
  const { id } = useParams()
  const [puesto, setPuesto] = useState(null)
  const [estado, setEstado] = useState('cargando')

  useEffect(() => {
    supabase
      .from('puestos')
      .select('*, mercados(nombre), productos(*)')
      .eq('id', id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) return setEstado('error')
        if (!data) return setEstado('noexiste')
        setPuesto(data)
        setEstado('listo')
      })
  }, [id])

  if (estado === 'cargando') {
    return <main className="pagina"><p className="vacio">Cargando puesto…</p></main>
  }

  if (estado !== 'listo') {
    return (
      <main className="pagina">
        <Link to="/" className="volver">Volver al buscador</Link>
        <p className="aviso-error">
          {estado === 'error'
            ? 'No se pudo cargar el puesto. Revisa tu conexión.'
            : 'Este puesto no existe o ya no está activo.'}
        </p>
      </main>
    )
  }

  const productos = [...puesto.productos].sort(
    (a, b) => ORDEN[a.estado] - ORDEN[b.estado] || a.nombre.localeCompare(b.nombre)
  )
  const wa = linkWhatsApp(
    puesto.whatsapp,
    `Hola, te escribo desde Mercado Digital por tu puesto ${puesto.nombre}.`
  )

  return (
    <main className="pagina">
      <Link to="/" className="volver">Volver al buscador</Link>

      <header className="puesto-cabecera">
        <span className="puesto-rubro">{puesto.rubro}</span>
        <h1>{puesto.nombre}</h1>
        {puesto.descripcion && <p className="puesto-desc">{puesto.descripcion}</p>}
        <p className="puesto-donde">
          <strong>{ubicacion(puesto)}</strong> en {puesto.mercados?.nombre}
        </p>
      </header>

      <h2 className="subtitulo">{productos.length} productos</h2>
      <ul className="lista">
        {productos.map((p) => (
          <ProductoFila key={p.id} {...p} whatsapp={puesto.whatsapp} />
        ))}
      </ul>

      {wa && (
        <a className="btn-wa btn-wa-fijo" href={wa} target="_blank" rel="noreferrer">
          Escribir al puesto por WhatsApp
        </a>
      )}
    </main>
  )
}
