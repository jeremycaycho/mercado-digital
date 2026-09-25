import { evaluarClave } from '../utils/clave'

// Barra de seguridad de la contraseña con sus requisitos
export default function MedidorClave({ clave }) {
  if (!clave) return null
  const { nivel, texto, clase, requisitos, comun } = evaluarClave(clave)
  return (
    <div className={`medidor ${clase}`} aria-live="polite">
      <div className="medidor-barras" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => <span key={i} className={i <= nivel ? 'llena' : ''} />)}
      </div>
      <p className="medidor-texto">Seguridad: <strong>{texto}</strong></p>
      {comun && <p className="medidor-aviso">Es una contraseña muy común o repetida. Elige otra.</p>}
      <ul className="medidor-requisitos">
        {requisitos.map((r) => (
          <li key={r.texto} className={r.ok ? 'ok' : ''}>
            <span aria-hidden="true">{r.ok ? '✓' : '•'}</span> {r.texto}
          </li>
        ))}
      </ul>
    </div>
  )
}
