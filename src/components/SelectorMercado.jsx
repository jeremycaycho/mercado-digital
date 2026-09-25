// Cuando hay varios mercados, el cliente elige en cuál está
export default function SelectorMercado({ mercados, onElegir }) {
  return (
    <main className="pagina">
      <header className="cabecera">
        <p className="mercado-nombre">Mercado Digital</p>
        <h1>¿En qué mercado estás?</h1>
      </header>
      <ul className="lista-puestos">
        {mercados.map((m) => (
          <li key={m.id}>
            <button className="mercado-opcion" onClick={() => onElegir(m.id)}>
              <strong>{m.nombre}</strong>
              {m.distrito && <span>{m.distrito}</span>}
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
