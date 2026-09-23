import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import ProductoFila from '../components/ProductoFila'
import { ubicacion } from '../utils/formato'

export default function Inicio() {
  const [termino, setTermino] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const [puestos, setPuestos] = useState([])
  const [error, setError] = useState(null)

  // Carga la lista de puestos
  useEffect(() => {
    supabase
      .from('puestos')
      .select('id, nombre, rubro, pasillo, numero_puesto, productos(count)')
      .eq('activo', true)
      .order('nombre')
      .then(({ data, error }) => {
        if (error) setError('No se pudieron cargar los puestos. Revisa tu conexión.')
        else setPuestos(data)
      })
  }, [])

  // Búsqueda con pausa de 300 ms mientras el usuario escribe
  useEffect(() => {
    const t = termino.trim()
    if (t.length < 2) {
      setResultados([])
      setBuscando(false)
      return
    }
    setBuscando(true)
    const timer = setTimeout(async () => {
      const { data, error } = await supabase.rpc('buscar_productos', { termino: t })
      if (error) setError('La búsqueda falló. Intenta de nuevo.')
      else {
        setError(null)
        setResultados(data)
      }
      setBuscando(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [termino])

  const texto = termino.trim()
  const hayBusqueda = texto.length >= 2

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Mercado Digital</p>
        <h1>¿Qué estás buscando?</h1>
        <input
          type="search"
          className="buscador"
          placeholder="Ej: limón, arroz, pollo"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          aria-label="Buscar producto"
        />
      </header>

      {error && <p className="aviso-error">{error}</p>}

      {hayBusqueda ? (
        <section>
          <h2 className="subtitulo">
            {buscando
              ? 'Buscando…'
              : `${resultados.length} ${resultados.length === 1 ? 'puesto tiene' : 'resultados para'} "${texto}"`}
          </h2>
          {!buscando && resultados.length === 0 && (
            <p className="vacio">
              Ningún puesto tiene "{texto}" todavía. Prueba con una palabra más corta, por ejemplo "papa" en vez de "papas amarillas".
            </p>
          )}
          <ul className="lista">
            {resultados.map((r) => (
              <ProductoFila
                key={r.producto_id}
                nombre={r.producto}
                precio={r.precio}
                unidad={r.unidad}
                estado={r.estado}
                foto_url={r.foto_url}
                whatsapp={r.whatsapp}
                puesto={{
                  id: r.puesto_id,
                  nombre: r.puesto,
                  pasillo: r.pasillo,
                  numero_puesto: r.numero_puesto,
                }}
              />
            ))}
          </ul>
        </section>
      ) : (
        <section>
          <h2 className="subtitulo">Puestos del mercado</h2>
          <ul className="lista-puestos">
            {puestos.map((p) => (
              <li key={p.id}>
                <Link to={`/puesto/${p.id}`} className="puesto-fila">
                  <span className="puesto-rubro">{p.rubro}</span>
                  <span className="puesto-nombre">{p.nombre}</span>
                  <span className="puesto-ubicacion">{ubicacion(p)}</span>
                  <span className="puesto-conteo">{p.productos?.[0]?.count ?? 0} productos</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="pie">
        ¿Tienes un puesto? <Link to="/vendedor">Ingresa como vendedor</Link>
      </p>
    </main>
  )
}
