import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

// userId: undefined = aún cargando la sesión, null = sin sesión
export function useEsAdmin(userId) {
  const [esAdmin, setEsAdmin] = useState(undefined)

  useEffect(() => {
    if (userId === undefined) return
    if (!userId) return setEsAdmin(false)
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => setEsAdmin(!!data))
  }, [userId])

  return esAdmin
}
