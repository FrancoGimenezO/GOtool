// Utilidades para manejar enlaces externos
export function convertGoogleDriveUrl(url) {
  if (!url || !url.includes('drive.google.com/file/d/')) {
    return url
  }

  const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1]
  if (fileId) {
    // Para archivos compartidos públicamente, usar este formato
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  }

  return url
}

// Función para obtener múltiples URLs de fallback para Google Drive
export function getGoogleDriveUrls(url) {
  if (!url || !url.includes('drive.google.com/file/d/')) {
    return [url]
  }

  const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1]
  if (fileId) {
    return [
      `https://drive.google.com/uc?export=download&id=${fileId}`,
      `https://drive.google.com/uc?id=${fileId}&export=download`,
      `https://docs.google.com/uc?export=download&id=${fileId}`,
      url // URL original como último recurso
    ]
  }

  return [url]
}

// Función para detectar el tipo de URL y obtener la URL apropiada para reproducción
export function getMediaUrl(url) {
  if (!url) return url

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return getYouTubeEmbedUrl(url)
  }

  // Google Drive
  if (url.includes('drive.google.com')) {
    return getGoogleDriveUrls(url)
  }

  // Otros servicios - devolver la URL tal cual
  return [url]
}

// Función para convertir URLs de YouTube a formato embed
export function getYouTubeEmbedUrl(url) {
  if (!url) return url

  let videoId = null

  // Formato: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  if (watchMatch) {
    videoId = watchMatch[1]
  }

  // Formato: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/)
  if (shortMatch) {
    videoId = shortMatch[1]
  }

  // Formato embed: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/)
  if (embedMatch) {
    videoId = embedMatch[1]
  }

  if (videoId) {
    return [`https://www.youtube.com/embed/${videoId}`]
  }

  return [url]
}

// Función para determinar si una URL es embeddable
export function isEmbeddableUrl(url) {
  if (!url) return false

  return url.includes('youtube.com/embed') ||
         url.includes('youtu.be') ||
         url.includes('vimeo.com') ||
         url.includes('dailymotion.com')
}

// Función para verificar si una URL es accesible
export async function checkUrlAccessibility(url) {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors'
    })
    return response.ok || response.type === 'opaque'
  } catch (error) {
    console.log('URL check failed:', url, error)
    return false
  }
}