import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../supabaseClient'
import { normalizarTexto, separarNombres } from '../../utils/formato'

export default function AdminSinonimos({ avisar }) {
  const [filas, setFilas] = useState(null)
  const [nuevo, setNuevo] = useState('')
  const [agregando, setAgregando] = useState({})
  const [filtro, setFiltro] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    supabase
      .from('sinonimos')
      .select('grupo, palabra')
      .then(({ data, error }) => (error ? setError('No se pudieron cargar los sinónimos.') : setFilas(data)))
  }, [])

  const grupos = useMemo(() => {
    const mapa = new Map()
    for (const f of filas ?? []) {
      if (!mapa.has(f.grupo)) mapa.set(f.grupo, [])
      mapa.get(f.grupo).push(f.palabra)
    }
    const texto = normalizarTexto(filtro)
    return [...mapa.entries()]
      .filter(([, palabras]) => !texto || palabras.some((p) => p.includes(texto)))
      .sort(([a], [b]) => b - a)
  }, [filas, filtro])

  async function crearGrupo(e) {
    e.preventDefault()
    const palabras = separarNombres(nuevo).map(normalizarTexto)
    if (palabras.length < 2) return setError('Escribe al menos dos palabras que signifiquen lo mismo, separadas por comas.')
    const grupo = (filas.length ? Math.max(...filas.map((f) => f.grupo)) : 0) + 1
    const registros = palabras.map((palabra) => ({ grupo, palabra }))
    const { error } = await supabase.from('sinonimos').insert(registros)
    if (error) return setError('No se pudo guardar. Intenta de nuevo.')
    setError(null)
    setFilas((actual) => [...actual, ...registros])
    setNuevo('')
    avisar('Sinónimos guardados: la búsqueda ya los usa')
  }

  async function agregarPalabra(grupo) {
    const palabra = normalizarTexto(agregando[grupo])
    if (!palabra) return
    const { error } = await supabase.from('sinonimos').insert({ grupo, palabra })
    if (error) return setError('No se pudo agregar la palabra (quizás ya existe en ese grupo).')
    setFilas((actual) => [...actual, { grupo, palabra }])
    setAgregando((a) => ({ ...a, [grupo]: '' }))
    avisar(`"${palabra}" agregada`)
  }

  async function quitarPalabra(grupo, palabra) {
    const { error } = await supabase.from('sinonimos').delete().eq('grupo', grupo).eq('palabra', palabra)
    if (error) return setError('No se pudo quitar la palabra.')
    setFilas((actual) => actual.filter((f) => !(f.grupo === grupo && f.palabra === palabra)))
  }

  if (!filas) return error ? <p className="aviso-error">{error}</p> : <p className="vacio">Cargando sinónimos…</p>

  return (
    <section>
      <p className="nota">
        Palabras distintas que significan lo mismo. Si un cliente busca una, encuentra los productos con cualquiera de las otras.
      </p>

      <form className="formulario" onSubmit={crearGrupo}>
        <label>
          Nuevo grupo de sinónimos
          <input value={nuevo} onChange={(e) => setNuevo(e.target.value)} placeholder="Ej: gallina, pollo de chacra" />
        </label>
        {error && <p className="aviso-error">{error}</p>}
        <button className="btn-principal">Guardar grupo</button>
      </form>

      <input
        type="search"
        className="campo-simple buscador-admin"
        placeholder="Buscar una palabra"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        aria-label="Buscar sinónimos"
      />

      <ul className="lista">
        {grupos.map(([grupo, palabras]) => (
          <li key={grupo} className="admin-item">
            <div className="chips">
              {palabras.map((p) => (
                <span key={p} className="chip chip-quitar">
                  {p}
                  <button onClick={() => quitarPalabra(grupo, p)} aria-label={`Quitar ${p}`}>×</button>
                </span>
              ))}
            </div>
            <div className="admin-agregar-palabra">
              <input
                className="campo-simple"
                value={agregando[grupo] ?? ''}
                onChange={(e) => setAgregando((a) => ({ ...a, [grupo]: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && agregarPalabra(grupo)}
                placeholder="Agregar otra palabra"
                aria-label="Agregar otra palabra a este grupo"
              />
              <button className="btn-secundario" onClick={() => agregarPalabra(grupo)}>Agregar</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
