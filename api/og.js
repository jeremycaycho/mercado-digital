// Vista previa personalizada de cada puesto cuando se comparte su enlace.
// Solo la reciben los "robots" de WhatsApp, Facebook, Telegram, etc. (ver vercel.json);
// las personas siguen viendo la app normal.

const escapar = (t = '') =>
  String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

export default async function handler(req, res) {
  const id = String(req.query.id || '')
  const sitio = `https://${req.headers.host}`
  const url = `${sitio}/puesto/${id}`

  let titulo = 'Mercado Digital'
  let descripcion = 'Encuentra qué puesto del mercado tiene lo que buscas, a qué precio y dónde está.'
  let imagen = `${sitio}/og-imagen.png`

  if (/^[0-9a-f-]{36}$/i.test(id)) {
    try {
      const base = process.env.VITE_SUPABASE_URL
      const clave = process.env.VITE_SUPABASE_ANON_KEY
      const campos = 'nombre,descripcion,rubro,pasillo,numero_puesto,foto_url,mercados(nombre),productos(count)'
      const r = await fetch(`${base}/rest/v1/puestos?id=eq.${id}&activo=eq.true&select=${campos}`, {
        headers: { apikey: clave, Accept: 'application/json' },
      })
      const [p] = r.ok ? await r.json() : []
      if (p) {
        const donde = [p.pasillo && `Pasillo ${p.pasillo}`, p.numero_puesto && `puesto ${p.numero_puesto}`]
          .filter(Boolean)
          .join(', ')
        const cantidad = p.productos?.[0]?.count ?? 0
        titulo = `${p.nombre} | ${p.mercados?.nombre ?? 'Mercado Digital'}`
        descripcion = [p.descripcion || p.rubro, donde, `${cantidad} productos con precio`].filter(Boolean).join('. ') + '.'
        if (p.foto_url) imagen = p.foto_url
      }
    } catch {
      // Si algo falla, se usa la vista previa general
    }
  }

  const html = `<!doctype html>
<html lang="es"><head>
<meta charset="utf-8" />
<title>${escapar(titulo)}</title>
<meta name="description" content="${escapar(descripcion)}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Mercado Digital" />
<meta property="og:locale" content="es_PE" />
<meta property="og:title" content="${escapar(titulo)}" />
<meta property="og:description" content="${escapar(descripcion)}" />
<meta property="og:url" content="${escapar(url)}" />
<meta property="og:image" content="${escapar(imagen)}" />
<meta name="twitter:card" content="summary_large_image" />
</head><body><a href="${escapar(url)}">${escapar(titulo)}</a></body></html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600')
  res.status(200).send(html)
}
