// localStorage que nunca rompe la app (algunos navegadores lo bloquean)
export const leer = (clave) => {
  try { return localStorage.getItem(clave) } catch { return null }
}
export const guardar = (clave, valor) => {
  try { localStorage.setItem(clave, valor) } catch { /* ignorar */ }
}
export const borrar = (clave) => {
  try { localStorage.removeItem(clave) } catch { /* ignorar */ }
}
