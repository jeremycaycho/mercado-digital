// Evalúa qué tan segura es una contraseña: 0 insegura, 1 poco segura, 2 segura, 3 muy segura
const COMUNES = ['123456', '12345678', 'password', 'contraseña', 'qwerty', 'abc123', '111111', 'mercado', 'peru123', 'admin']

export function evaluarClave(clave = '') {
  const requisitos = [
    { ok: clave.length >= 8, texto: 'Al menos 8 caracteres' },
    { ok: /[a-z]/.test(clave) && /[A-Z]/.test(clave), texto: 'Mayúsculas y minúsculas' },
    { ok: /\d/.test(clave), texto: 'Al menos un número' },
    { ok: /[^A-Za-z0-9]/.test(clave), texto: 'Un símbolo (por ejemplo: ! @ # $ . -)' },
  ]
  let puntos = requisitos.filter((r) => r.ok).length
  if (clave.length >= 12) puntos += 1
  const comun = COMUNES.some((c) => clave.toLowerCase().includes(c)) || /^(.)\1+$/.test(clave)

  let nivel
  if (!clave || clave.length < 8 || comun) nivel = 0
  else if (puntos <= 2) nivel = 1
  else if (puntos <= 4) nivel = 2
  else nivel = 3

  const NIVELES = [
    { texto: 'Insegura', clase: 'nivel-0' },
    { texto: 'Poco segura', clase: 'nivel-1' },
    { texto: 'Segura', clase: 'nivel-2' },
    { texto: 'Muy segura', clase: 'nivel-3' },
  ]
  return { nivel, ...NIVELES[nivel], requisitos, comun }
}

export const CLAVE_MINIMA = 2 // se exige al menos "Segura"
