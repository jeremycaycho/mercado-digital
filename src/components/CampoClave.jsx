import { useId, useState } from 'react'

// Campo de contraseña con botón para ver u ocultar lo escrito
export default function CampoClave({ etiqueta, valor, onCambiar, autoComplete = 'new-password', ayuda, error, ...resto }) {
  const [ver, setVer] = useState(false)
  const id = useId()
  return (
    <div className="campo-clave">
      <label htmlFor={id}>{etiqueta}</label>
      <div className="campo-clave-caja">
        <input
          id={id}
          type={ver ? 'text' : 'password'}
          value={valor}
          onChange={(e) => onCambiar(e.target.value)}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          {...resto}
        />
        <button type="button" className="ver-clave" onClick={() => setVer(!ver)} aria-label={ver ? 'Ocultar contraseña' : 'Mostrar contraseña'} aria-pressed={ver}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
            {ver && <path d="M4 4l16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />}
          </svg>
          <span>{ver ? 'Ocultar' : 'Ver'}</span>
        </button>
      </div>
      {ayuda}
      {error && <span className="error-campo">{error}</span>}
    </div>
  )
}
