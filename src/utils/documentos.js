export const TIPOS_DOCUMENTO = [
  ['DNI', 'DNI'],
  ['CE', 'Carné de extranjería'],
  ['PASAPORTE', 'Pasaporte'],
]

export const limpiarDocumento = (n = '') => n.toUpperCase().replace(/[^A-Z0-9]/g, '')

// Validación de formato (no consulta a RENIEC)
export function validarDocumento(tipo, numero) {
  const n = limpiarDocumento(numero)
  if (tipo === 'DNI') return /^\d{8}$/.test(n) ? null : 'El DNI debe tener 8 números.'
  if (tipo === 'CE') return /^\d{9,12}$/.test(n) ? null : 'El carné de extranjería debe tener entre 9 y 12 números.'
  return /^[A-Z0-9]{6,12}$/.test(n) ? null : 'El pasaporte debe tener entre 6 y 12 letras o números.'
}

export const validarCelular = (c = '') => (/^9\d{8}$/.test(c.replace(/\D/g, '')) ? null : 'El celular debe tener 9 números y empezar con 9.')

export const validarNombre = (t = '', campo) =>
  t.trim().length >= 2 && /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/.test(t.trim()) ? null : `Escribe tus ${campo} (solo letras).`
