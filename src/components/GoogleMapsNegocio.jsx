// Guía para que el vendedor aparezca en Google Maps con su propio Perfil de Negocio
export default function GoogleMapsNegocio({ puesto }) {
  return (
    <details className="mi-cuenta google-maps">
      <summary>Aparece también en Google Maps</summary>
      <p className="sin-margen">
        Google no permite que otras apps agreguen negocios a su mapa: lo haces tú, gratis, con un <strong>Perfil de
        Negocio de Google</strong>. Así te encuentran quienes buscan "{puesto.rubro?.toLowerCase() ?? 'mercado'} cerca de mí".
      </p>
      <ol className="pasos-google">
        <li>Abre Google Maps, toca tu foto de perfil y elige <strong>"Agregar tu negocio"</strong> (o entra al enlace de abajo).</li>
        <li>Escribe el mismo nombre que usas aquí: <strong>{puesto.nombre}</strong>, y tu categoría.</li>
        <li>Marca tu ubicación en el mismo punto que marcaste en Mercado Digital.</li>
        <li>Agrega tu WhatsApp y tu horario.</li>
        <li>Google te pedirá <strong>verificar</strong> tu negocio (a veces con un video corto del puesto). Hasta verificarlo, no aparecerá.</li>
      </ol>
      <a className="btn-secundario centrado" href="https://www.google.com/business/" target="_blank" rel="noreferrer">
        Crear mi Perfil de Negocio de Google
      </a>
      <p className="nota sin-margen">
        Mientras tanto, tus clientes ya pueden llegar a ti con el botón "Cómo llegar con Google Maps" de tu página.
      </p>
    </details>
  )
}
