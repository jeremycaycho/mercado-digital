// El cliente puede ver todos los negocios o solo los de un mercado
export default function SelectorMercado({ mercados, actual, onElegir, onCancelar }) {
  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Mercado Digital</p>
        <h1>¿Dónde quieres buscar?</h1>
      </header>
      <ul className="lista-puestos">
        <li>
          <button className={`mercado-opcion ${actual === 'todos' ? 'activa' : ''}`} onClick={() => onElegir('todos')}>
            <strong>Todos los negocios</strong>
            <span>De todos los mercados y los que están por su cuenta</span>
          </button>
        </li>
        {mercados.map((m) => (
          <li key={m.id}>
            <button className={`mercado-opcion ${actual === m.id ? 'activa' : ''}`} onClick={() => onElegir(m.id)}>
              <strong>{m.nombre}</strong>
              {m.distrito && <span>{m.distrito}</span>}
            </button>
          </li>
        ))}
      </ul>
      {onCancelar && <p className="pie"><button className="enlace" onClick={onCancelar}>Volver</button></p>}
    </main>
  )
}
