import QRCode from 'qrcode'

const C = { verde: '#0E6B41', tinta: '#16241C', cartulina: '#FFD84A', gris: '#5E6B63' }
const TEXTO = '"Atkinson Hyperlegible", system-ui, sans-serif'
const TITULO = '"Bricolage Grotesque", "Atkinson Hyperlegible", system-ui, sans-serif'

// Divide un texto en líneas que quepan en el ancho indicado
function partirLineas(ctx, texto, anchoMax) {
  const lineas = []
  let actual = ''
  for (const palabra of texto.split(' ')) {
    const prueba = actual ? `${actual} ${palabra}` : palabra
    if (ctx.measureText(prueba).width > anchoMax && actual) {
      lineas.push(actual)
      actual = palabra
    } else actual = prueba
  }
  if (actual) lineas.push(actual)
  return lineas
}

// Dibuja el cartel del puesto (1080 x 1350, formato vertical para imprimir o compartir)
export async function dibujarCartel(canvas, { url, nombre, ubicacion, mercado, lema = ['Escanea y mira mis productos', 'y precios del día'] }) {
  await document.fonts?.ready
  const W = 1080
  const H = 1350
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)

  // Cabecera verde con el nombre del puesto
  ctx.fillStyle = C.verde
  ctx.fillRect(0, 0, W, 370)
  ctx.fillStyle = '#fff'
  ctx.font = `700 36px ${TEXTO}`
  ctx.fillText('Mercado Digital', W / 2, 80)

  let tam = 88
  ctx.font = `800 ${tam}px ${TITULO}`
  let lineas = partirLineas(ctx, nombre, W - 120)
  while (lineas.length > 2 && tam > 50) {
    tam -= 6
    ctx.font = `800 ${tam}px ${TITULO}`
    lineas = partirLineas(ctx, nombre, W - 120)
  }
  lineas = lineas.slice(0, 2)
  const inicio = lineas.length === 1 ? 210 : 175
  lineas.forEach((l, i) => ctx.fillText(l, W / 2, inicio + i * tam * 1.05))

  ctx.font = `400 36px ${TEXTO}`
  ctx.fillText([ubicacion, mercado].filter(Boolean).join(' en '), W / 2, 325)

  // Etiqueta amarilla con sombra (la identidad de la app)
  const centroY = 775
  const qrTam = 560
  const etiqueta = qrTam + 80
  ctx.save()
  ctx.translate(W / 2, centroY)
  ctx.rotate((-2 * Math.PI) / 180)
  ctx.fillStyle = C.tinta
  ctx.fillRect(-etiqueta / 2 + 14, -etiqueta / 2 + 14, etiqueta, etiqueta)
  ctx.fillStyle = C.cartulina
  ctx.fillRect(-etiqueta / 2, -etiqueta / 2, etiqueta, etiqueta)
  ctx.restore()

  // El QR va recto para que se escanee sin problemas
  const qr = document.createElement('canvas')
  await QRCode.toCanvas(qr, url, {
    width: qrTam,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: { dark: C.tinta, light: '#FFFFFF' },
  })
  ctx.drawImage(qr, W / 2 - qrTam / 2, centroY - qrTam / 2, qrTam, qrTam)

  ctx.fillStyle = C.tinta
  ctx.font = `800 46px ${TITULO}`
  lema.slice(0, 2).forEach((l, i) => ctx.fillText(l, W / 2, 1180 + i * 56))

  ctx.fillStyle = C.gris
  ctx.font = `400 28px ${TEXTO}`
  ctx.fillText(new URL(url).host, W / 2, 1305)
}
