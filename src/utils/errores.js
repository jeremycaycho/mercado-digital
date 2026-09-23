// Traduce los mensajes de Supabase a español claro
export function traducirError(mensaje = '') {
  const m = mensaje.toLowerCase()
  if (m.includes('invalid login credentials')) return 'Correo o contraseña incorrectos.'
  if (m.includes('already registered')) return 'Ese correo ya tiene cuenta. Ingresa con tu contraseña.'
  if (m.includes('email not confirmed')) return 'Aún no confirmas tu correo. Revisa tu bandeja de entrada o la carpeta de spam.'
  if (m.includes('at least')) return 'La contraseña debe tener al menos 8 caracteres.'
  if (m.includes('should be different')) return 'La nueva contraseña debe ser distinta a la anterior.'
  if (m.includes('weak') || m.includes('pwned')) return 'Esa contraseña es muy fácil de adivinar. Usa una más larga o con números.'
  if (m.includes('rate limit') || m.includes('security purposes') || m.includes('too many'))
    return 'Hiciste varios intentos seguidos. Espera un minuto y vuelve a intentarlo.'
  if (m.includes('fetch')) return 'No hay conexión. Revisa tu internet e intenta de nuevo.'
  return 'Algo salió mal. Intenta de nuevo en un momento.'
}
