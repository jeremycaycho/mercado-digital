import { supabase } from '../supabaseClient'

// Evita contar dos veces lo mismo en la misma visita (por ejemplo, al recargar)
const yaRegistrado = new Set()
function primeraVez(clave) {
  try {
    const guardado = JSON.parse(sessionStorage.getItem('md-registrado') || '[]')
    guardado.forEach((c) => yaRegistrado.add(c))
  } catch { /* sin almacenamiento: se usa solo la memoria */ }
  if (yaRegistrado.has(clave)) return false
  yaRegistrado.add(clave)
  try {
    sessionStorage.setItem('md-registrado', JSON.stringify([...yaRegistrado].slice(-200)))
  } catch { /* ignorar */ }
  return true
}

// Nunca debe romper la app: si falla, se ignora en silencio
export function registrarBusqueda(termino, resultados, exactos, mercadoId = null) {
  const t = termino.trim().slice(0, 60)
  if (t.length < 3 || !primeraVez(`b:${t.toLowerCase()}`)) return
  supabase.from('busquedas').insert({ termino: t, resultados, exactos, mercado_id: mercadoId }).then(() => {})
}

// tipo: 'vista_puesto' | 'whatsapp' | 'como_llegar'
export async function registrarEvento(tipo, puestoId, duenoId) {
  if (!puestoId) return
  if (tipo === 'vista_puesto' && !primeraVez(`v:${puestoId}`)) return
  // El vendedor mirando su propio puesto no cuenta
  if (duenoId) {
    const { data } = await supabase.auth.getSession()
    if (data.session?.user?.id === duenoId) return
  }
  supabase.from('eventos').insert({ tipo, puesto_id: puestoId }).then(() => {})
}
