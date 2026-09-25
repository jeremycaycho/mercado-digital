import { useCallback, useEffect, useState } from 'react'
import Toast from '../components/Toast'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { ubicacion, estadoDeHoy, hoyLima } from '../utils/formato'
import CapturaFoto from '../components/CapturaFoto'
import EditarPuesto from '../components/EditarPuesto'
import MiQR from '../components/MiQR'
import CatalogoModal from '../components/CatalogoModal'
import AbrirDia from '../components/AbrirDia'
import TuSemana from '../components/TuSemana'
import GuiaVendedor from '../components/GuiaVendedor'
import MiCuenta from '../components/MiCuenta'
import GoogleMapsNegocio from '../components/GoogleMapsNegocio'
import Esqueleto from '../components/Esqueleto'
import Recorrido, { useRecorrido } from '../components/Recorrido'
import { GUIA_VENDEDOR } from '../legal/guias'
import InsigniaVerificado from '../components/InsigniaVerificado'
import { useEsAdmin } from '../hooks/useEsAdmin'
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
  const [verCatalogo, setVerCatalogo] = useState(false)
  const esAdmin = useEsAdmin(usuario.id)
  const guia = useRecorrido('vendedor', estado === 'listo')
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
    else if ('otros_nombres' in cambios) avisar('Otros nombres guardados')
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

  async function abrirDia(reponer) {
    const { data, error } = await supabase.rpc('abrir_dia', { p_puesto: puesto.id, p_reponer: reponer })
    if (error) {
      setAviso('No se pudo abrir el día. Revisa tu conexión e intenta de nuevo.')
      return
    }
    await cargar()
    setAviso(null)
    avisar(`¡Listo! Tu puesto está abierto y tus ${data} productos están al día.`)
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

  async function agregarVarios(lista) {
    const { data, error } = await supabase
      .from('productos')
      .insert(lista.map((p) => ({ ...p, puesto_id: puesto.id })))
      .select()
    if (error) {
      setAviso('No se pudieron agregar los productos. Intenta de nuevo.')
      return false
    }
    setProductos((actual) => [...actual, ...data].sort(porNombre))
    setAviso(null)
    avisar(`${data.length} ${data.length === 1 ? 'producto agregado' : 'productos agregados'}. Ahora ponles precio.`)
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

  if (estado === 'cargando') return <main className="pagina"><Esqueleto filas={4} /></main>

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
        {puesto.verificado ? (
          <p className="cabecera-sub"><InsigniaVerificado /></p>
        ) : (
          <p className="cabecera-sub cabecera-nota">Tu puesto aún no está verificado. Un encargado de Mercado Digital lo visitará para darte la insignia.</p>
        )}
        <div className="cabecera-acciones">
          <Link to={`/puesto/${puesto.id}`} className="enlace-claro">Ver como cliente</Link>
          <button className="enlace-claro" onClick={() => setVerQR(true)} data-guia="mi-qr">Mi QR</button>
          {esAdmin && <Link to="/admin" className="enlace-claro">Administrar</Link>}
          <button className="enlace-claro" onClick={salir}>Salir</button>
        </div>
      </header>

      {aviso && <p className="aviso-error">{aviso}</p>}

      {!hoy && <AbrirDia productos={productos} onAbrir={abrirDia} onNoAbro={() => marcarHoy('cerrado')} />}

      <section data-guia="estado-hoy">
        <h2 className="subtitulo">{hoy ? 'Tu puesto hoy' : '¿Tu puesto abre hoy?'}</h2>
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
        {hoy && <p className="nota">Si cambias de idea durante el día, puedes cambiarlo aquí.</p>}
      </section>

      {editando ? (
        <div id="editar-puesto" className="ancla">
        <EditarPuesto puesto={puesto} onGuardar={(cambios) => actualizarPuesto(cambios)} onCerrar={() => setEditando(false)} />
        </div>
      ) : (
        <section className="perfil-resumen">
          <span data-guia="foto-puesto" className="guia-envoltura">
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
          </span>
          <div className="perfil-datos">
            <p>{puesto.horario || <span className="falta">Sin horario</span>}</p>
            <p>
              {puesto.metodos_pago?.length ? puesto.metodos_pago.join(', ') : <span className="falta">Sin métodos de pago</span>}
            </p>
            <button className="enlace" onClick={() => setEditando(true)} data-guia="editar-puesto">Editar datos del puesto</button>
          </div>
        </section>
      )}

      <GuiaVendedor
        puesto={puesto}
        productos={productos}
        onEditar={() => {
          setEditando(true)
          setTimeout(() => document.getElementById('editar-puesto')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
        }}
        onCatalogo={() => setVerCatalogo(true)}
        onQR={() => setVerQR(true)}
      />

      <TuSemana puestoId={puesto.id} />

      <button className="btn-principal" onClick={() => setVerCatalogo(true)} data-guia="catalogo">
        Elegir productos del catálogo
      </button>
      <div data-guia="agregar-mano"><NuevoProducto onAgregar={agregar} /></div>

      <h2 className="subtitulo">Tus productos ({productos.length})</h2>
      {productos.length === 0 && (
        <p className="vacio">
          Aún no tienes productos. Toca "Elegir productos del catálogo" y marca lo que vendes: es más rápido que escribirlos uno por uno.
        </p>
      )}
      {productos.some((p) => p.precio == null) && (
        <p className="aviso-precio">
          {productos.filter((p) => p.precio == null).length} productos sin precio. Los clientes verán "Consultar" hasta que lo pongas.
        </p>
      )}
      <ul className="lista">
        {productos.map((p, i) => (
          <ProductoEditable
            key={p.id}
            guia={i === 0}
            producto={p}
            usuarioId={usuario.id}
            onCambiar={(cambios) => actualizar(p.id, cambios)}
            onEliminar={() => eliminar(p)}
          />
        ))}
      </ul>

      {verQR && <MiQR puesto={puesto} onCerrar={() => setVerQR(false)} />}
      {verCatalogo && (
        <CatalogoModal
          rubroInicial={puesto.rubro}
          productosActuales={productos}
          onAgregar={agregarVarios}
          onCerrar={() => setVerCatalogo(false)}
        />
      )}

      <GoogleMapsNegocio puesto={puesto} />
      <MiCuenta usuario={usuario} puesto={puesto} productos={productos} />
      <Recorrido pasos={GUIA_VENDEDOR} activo={guia.activo} onTerminar={guia.terminar} />

      <Toast mensaje={toast} onCerrar={cerrarToast} />
    </main>
  )
}
