import { useCallback, useEffect, useState } from 'react'
import Toast from '../components/Toast'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ubicacion, estadoDeHoy, hoyLima } from '../utils/formato'
import CapturaFoto from '../components/CapturaFoto'
import EditarPuesto from '../components/EditarPuesto'
import MiQR from '../components/MiQR'
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
  const [editando, setEditando] = useState(false)
  const [verQR, setVerQR] = useState(false)
  const avisar = (texto) => setToast({ texto, id: Date.now() })
  const cerrarToast = useCallback(() => setToast(null), [])

  const cargar = useCallback(async () => {
    const { data, error } = await supabase
      .from('puestos')
      .select('*, mercados(nombre), productos(*)')
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

  async function actualizarPuesto(cambios, mensaje = 'Datos del puesto guardados') {
    const anterior = puesto
    setPuesto((p) => ({ ...p, ...cambios }))
    const { error } = await supabase.from('puestos').update(cambios).eq('id', puesto.id)
    if (error) {
      setPuesto(anterior)
      setAviso('No se guardó el cambio del puesto. Revisa tu conexión e intenta de nuevo.')
      return false
    }
    setAviso(null)
    avisar(mensaje)
    return true
  }

  const marcarHoy = (valor) =>
    actualizarPuesto(
      { estado_hoy: valor, estado_hoy_fecha: hoyLima() },
      valor === 'abierto' ? 'Marcado: abierto hoy' : 'Marcado: cerrado hoy'
    )

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

  const hoy = estadoDeHoy(puesto)

  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Tu puesto</p>
        <h1>{puesto.nombre}</h1>
        <p className="cabecera-sub">{ubicacion(puesto)}</p>
        <div className="cabecera-acciones">
          <Link to={`/puesto/${puesto.id}`} className="enlace-claro">Ver como cliente</Link>
          <button className="enlace-claro" onClick={() => setVerQR(true)}>Mi QR</button>
          <button className="enlace-claro" onClick={salir}>Salir</button>
        </div>
      </header>

      {aviso && <p className="aviso-error">{aviso}</p>}

      <section>
        <h2 className="subtitulo">¿Tu puesto abre hoy?</h2>
        <div className="selector-estado" role="group" aria-label="Estado del puesto hoy">
          <button
            className={`opcion opcion-disponible ${hoy === 'abierto' ? 'activa' : ''}`}
            aria-pressed={hoy === 'abierto'}
            onClick={() => hoy !== 'abierto' && marcarHoy('abierto')}
          >
            Abierto hoy
          </button>
          <button
            className={`opcion opcion-agotado ${hoy === 'cerrado' ? 'activa' : ''}`}
            aria-pressed={hoy === 'cerrado'}
            onClick={() => hoy !== 'cerrado' && marcarHoy('cerrado')}
          >
            Cerrado hoy
          </button>
        </div>
        {!hoy && <p className="nota">Aún no marcas si abres hoy. Tus clientes lo verán en tu página.</p>}
      </section>

      {editando ? (
        <EditarPuesto puesto={puesto} onGuardar={(cambios) => actualizarPuesto(cambios)} onCerrar={() => setEditando(false)} />
      ) : (
        <section className="perfil-resumen">
          <CapturaFoto
            className="foto-puesto-editar"
            titulo="Foto de tu puesto"
            fotoActual={puesto.foto_url}
            usuarioId={usuario.id}
            onGuardar={(url) => actualizarPuesto({ foto_url: url }, 'Foto del puesto guardada')}
            onError={setAviso}
            etiqueta={puesto.foto_url ? 'Cambiar foto del puesto' : 'Tomar foto del puesto'}
          >
            {puesto.foto_url ? <img src={puesto.foto_url} alt="" /> : <span>Foto del puesto</span>}
          </CapturaFoto>
          <div className="perfil-datos">
            <p>{puesto.horario || <span className="falta">Sin horario</span>}</p>
            <p>
              {puesto.metodos_pago?.length ? puesto.metodos_pago.join(', ') : <span className="falta">Sin métodos de pago</span>}
            </p>
            <button className="enlace" onClick={() => setEditando(true)}>Editar datos del puesto</button>
          </div>
        </section>
      )}

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

      {verQR && <MiQR puesto={puesto} onCerrar={() => setVerQR(false)} />}

      <Toast mensaje={toast} onCerrar={cerrarToast} />
    </main>
  )
}
