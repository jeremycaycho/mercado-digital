import { useCallback, useEffect, useState } from 'react'
import Toast from '../components/Toast'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ubicacion } from '../utils/formato'
import CrearPuesto from '../components/CrearPuesto'
import NuevoProducto from '../components/NuevoProducto'
import ProductoEditable from '../components/ProductoEditable'
import { borrarFoto } from '../utils/fotos'

const porNombre = (a, b) => a.nombre.localeCompare(b.nombre)

export default function Panel({ usuario }) {
  const [puesto, setPuesto] = useState(null)
  const [productos, setProductos] = useState([])
  const [estado, setEstado] = useState('cargando')
  const [aviso, setAviso] = useState(null)
  const [toast, setToast] = useState(null)
  const avisar = (texto) => setToast({ texto, id: Date.now() })
  const cerrarToast = useCallback(() => setToast(null), [])

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('puestos')
      .select('*, productos(*)')
      .eq('owner_id', usuario.id)
      .limit(1)
      .maybeSingle()
    if (error) return setEstado('error')
    if (!data) return setEstado('sinpuesto')
    setPuesto(data)
    setProductos([...data.productos].sort(porNombre))
    setEstado('listo')
  }, [usuario.id])

  useEffect(() => { cargar() }, [cargar])

  async function actualizar(id, cambios) {
    const anterior = productos
    const ahora = new Date().toISOString()
    setProductos((lista) => lista.map((p) => (p.id === id ? { ...p, ...cambios, updated_at: ahora } : p)))
    const { error } = await supabase.from('productos').update(cambios).eq('id', id)
    if (error) {
      setProductos(anterior)
      setAviso('No se guardó el cambio. Revisa tu conexión e intenta de nuevo.')
      return false
    }
    setAviso(null)
    if ('foto_url' in cambios) avisar('Foto guardada')
    else if ('precio' in cambios) avisar('Precio guardado')
    else if (cambios.estado) avisar(`Marcado como "${{ disponible: 'Hay', pocos: 'Pocos', agotado: 'Agotado' }[cambios.estado]}"`)
    return true
  }

  async function agregar(nuevo) {
    const { data, error } = await supabase
      .from('productos')
      .insert({ ...nuevo, puesto_id: puesto.id })
      .select()
      .single()
    if (error) {
      setAviso('No se pudo agregar el producto. Intenta de nuevo.')
      return false
    }
    setProductos((lista) => [...lista, data].sort(porNombre))
    setAviso(null)
    avisar('Producto agregado')
    return true
  }

  async function eliminar(producto) {
    if (!window.confirm(`¿Eliminar "${producto.nombre}" de tu puesto?`)) return
    const { error } = await supabase.from('productos').delete().eq('id', producto.id)
    if (error) setAviso('No se pudo eliminar el producto. Intenta de nuevo.')
    else {
      setProductos((lista) => lista.filter((p) => p.id !== producto.id))
      borrarFoto(producto.foto_url)
      avisar('Producto eliminado')
    }
  }

  const salir = () => supabase.auth.signOut()

  if (estado === 'cargando') return <main className="pagina"><p className="vacio">Cargando tu puesto…</p></main>

  if (estado === 'error') {
    return (
      <main className="pagina">
        <p className="aviso-error">No se pudo cargar tu puesto. Revisa tu conexión y recarga la página.</p>
        <button className="enlace" onClick={salir}>Salir</button>
      </main>
    )
  }

  if (estado === 'sinpuesto') return <CrearPuesto usuario={usuario} onCreado={cargar} onSalir={salir} />

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Tu puesto</p>
        <h1>{puesto.nombre}</h1>
        <p className="cabecera-sub">{ubicacion(puesto)}</p>
        <div className="cabecera-acciones">
          <Link to={`/puesto/${puesto.id}`} className="enlace-claro">Ver como cliente</Link>
          <button className="enlace-claro" onClick={salir}>Salir</button>
        </div>
      </header>

      {aviso && <p className="aviso-error">{aviso}</p>}

      <NuevoProducto onAgregar={agregar} />

      <h2 className="subtitulo">Tus productos ({productos.length})</h2>
      {productos.length === 0 && <p className="vacio">Agrega tu primer producto para que los clientes te encuentren.</p>}
      <ul className="lista">
        {productos.map((p) => (
          <ProductoEditable
            key={p.id}
            producto={p}
            usuarioId={usuario.id}
            onCambiar={(cambios) => actualizar(p.id, cambios)}
            onEliminar={() => eliminar(p)}
          />
        ))}
      </ul>

      <Toast mensaje={toast} onCerrar={cerrarToast} />
    </main>
  )
}
