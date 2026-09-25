import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSesion } from '../hooks/useSesion'
import { useEsAdmin } from '../hooks/useEsAdmin'
import Toast from '../components/Toast'
import AdminPuestos from './admin/AdminPuestos'
import AdminCatalogo from './admin/AdminCatalogo'
import AdminSinonimos from './admin/AdminSinonimos'
import AdminMercados from './admin/AdminMercados'
import AdminEstadisticas from './admin/AdminEstadisticas'

const PESTANAS = [
  ['estadisticas', 'Estadísticas'],
  ['puestos', 'Puestos'],
  ['catalogo', 'Catálogo'],
  ['sinonimos', 'Sinónimos'],
  ['mercados', 'Mercados'],
]

export default function Admin() {
  const sesion = useSesion()
  const esAdmin = useEsAdmin(sesion === undefined ? undefined : sesion?.user?.id ?? null)
  const [params, setParams] = useSearchParams()
  const pestana = params.get('tab') || 'puestos'
  const [toast, setToast] = useState(null)
  const avisar = useCallback((texto) => setToast({ texto, id: Date.now() }), [])
  const cerrarToast = useCallback(() => setToast(null), [])

  if (sesion === undefined || (sesion && esAdmin === undefined)) {
    return <main className="pagina"><p className="vacio">Cargando…</p></main>
  }

  if (!sesion || !esAdmin) {
    return (
      <main className="pagina">
        <p className="aviso-error">
          {!sesion ? 'Primero ingresa con tu cuenta.' : 'Esta sección es solo para administradores de Mercado Digital.'}
        </p>
        <p className="pie"><Link to="/vendedor">Ir a ingresar</Link></p>
      </main>
    )
  }

  return (
    <main className="pagina">
      <header className="cabecera cabecera-admin">
        <p className="mercado-nombre">Mercado Digital</p>
        <h1>Administración</h1>
        <div className="cabecera-acciones">
          <Link to="/vendedor" className="enlace-claro">Mi puesto</Link>
          <Link to="/" className="enlace-claro">Ver la app</Link>
        </div>
      </header>

      <nav className="pestanas" role="tablist" aria-label="Secciones de administración">
        {PESTANAS.map(([id, texto]) => (
          <button
            key={id}
            role="tab"
            aria-selected={pestana === id}
            className={`pestana ${pestana === id ? 'activa' : ''}`}
            onClick={() => setParams({ tab: id }, { replace: true })}
          >
            {texto}
          </button>
        ))}
      </nav>

      {pestana === 'estadisticas' && <AdminEstadisticas />}
      {pestana === 'puestos' && <AdminPuestos usuarioId={sesion.user.id} avisar={avisar} />}
      {pestana === 'catalogo' && <AdminCatalogo avisar={avisar} />}
      {pestana === 'sinonimos' && <AdminSinonimos avisar={avisar} />}
      {pestana === 'mercados' && <AdminMercados avisar={avisar} />}

      <Toast mensaje={toast} onCerrar={cerrarToast} />
    </main>
  )
}
