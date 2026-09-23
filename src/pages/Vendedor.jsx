import { useSesion } from '../hooks/useSesion'
import Ingresar from './Ingresar'
import Panel from './Panel'

export default function Vendedor() {
  const sesion = useSesion()
  if (sesion === undefined) return <main className="pagina"><p className="vacio">Cargando…</p></main>
  if (!sesion) return <Ingresar />
  return <Panel usuario={sesion.user} />
}
