import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// undefined = cargando, null = sin sesión, objeto = sesión activa
export function useSesion() {
  const [sesion, setSesion] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_evento, s) => setSesion(s))
    return () => subscription.unsubscribe()
  }, [])

  return sesion
}
