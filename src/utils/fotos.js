import { supabase } from '../supabaseClient'

const BUCKET = 'fotos'

// Reduce la foto de la cámara (a veces 4-8 MB) a unos 100-200 KB
export async function comprimirImagen(file, maxLado = 1000, calidad = 0.75) {
  // Intenta decodificar ya reducida para no llenar la memoria del celular
  let bitmap
  try {
    bitmap = await createImageBitmap(file, { resizeWidth: maxLado, resizeQuality: 'medium' })
  } catch {
    bitmap = await createImageBitmap(file)
  }
  const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * escala)
  canvas.height = Math.round(bitmap.height * escala)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', calidad))
  if (!blob) throw new Error('No se pudo procesar la imagen')
  return blob
}

// Recibe la foto YA comprimida (la que el vendedor confirmó)
export async function subirFoto(usuarioId, blob) {
  const ext = blob.type === 'image/webp' ? 'webp' : blob.type === 'image/jpeg' ? 'jpg' : 'png'
  const nombre = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const ruta = `${usuarioId}/${nombre}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, blob, { contentType: blob.type, cacheControl: '31536000' })
  if (error) throw error

  return supabase.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl
}

export async function borrarFoto(url) {
  if (!url) return
  const marca = `/object/public/${BUCKET}/`
  const i = url.indexOf(marca)
  if (i === -1) return
  await supabase.storage.from(BUCKET).remove([url.slice(i + marca.length)])
}
