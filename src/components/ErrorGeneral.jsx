import { Component } from 'react'

// Si algo falla inesperadamente, se muestra una pantalla amable en vez de una página en blanco
export default class ErrorGeneral extends Component {
  constructor(props) {
    super(props)
    this.state = { fallo: false }
  }

  static getDerivedStateFromError() {
    return { fallo: true }
  }

  componentDidCatch(error, info) {
    console.error('Error en la app:', error, info)
  }

  render() {
    if (!this.state.fallo) return this.props.children
    return (
      <main className="pagina pantalla-estado">
        <div className="estado-icono" aria-hidden="true">!</div>
        <h1 className="titulo-pagina">Algo salió mal</h1>
        <p>Tuvimos un problema al mostrar esta pantalla. Recarga para intentarlo de nuevo.</p>
        <button className="btn-principal" onClick={() => window.location.reload()}>Recargar</button>
        <a className="enlace-plano" href="/">Ir al inicio</a>
      </main>
    )
  }
}
