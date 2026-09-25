// Insignia para puestos que Mercado Digital visitó y confirmó en persona
export default function InsigniaVerificado({ compacta = false }) {
  return (
    <span className="insignia-verificado" title="Mercado Digital visitó y confirmó este puesto">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {compacta ? <span className="oculto">Puesto verificado</span> : 'Verificado'}
    </span>
  )
}
