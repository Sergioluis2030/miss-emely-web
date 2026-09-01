const API_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'https://backend2.sergioluisqf.lat/api'

const TOKEN_KEY = 'missemely.token'

export function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // almacenamiento no disponible
  }
}

export function clearStoredToken() {
  setStoredToken(null)
}

// Llamada genérica al backend. Adjunta el token JWT si existe.
// Devuelve la respuesta JSON si todo va bien.
// lanza un Error con el mensaje del servidor si la petición falla.
export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const authToken = token || getStoredToken()
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.')
  }

  let data
  try {
    data = await res.json()
  } catch {
    data = {}
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Ocurrió un error inesperado.')
  }

  return data
}

// Envía datos multipart/form-data (subida de archivos). Adjunta el token JWT.
export async function apiUpload(path, { method = 'POST', formData, token } = {}) {
  const headers = {}
  const authToken = token || getStoredToken()
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, { method, headers, body: formData })
  } catch {
    throw new Error('No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.')
  }

  let data
  try {
    data = await res.json()
  } catch {
    data = {}
  }

  if (!res.ok) {
    throw new Error(data?.message || 'Ocurrió un error inesperado.')
  }

  return data
}

// Resuelve una ruta de imagen almacenada (/uploads/xxx) a la URL completa del backend.
export function resolveImageUrl(path) {
  if (!path) return null
  if (/^https?:\/\//.test(path) || /^data:/.test(path)) return path
  if (path.startsWith('/uploads/')) {
    return API_URL.replace(/\/api\/?$/, '') + path
  }
  return path
}

export default api

// Profile API
export async function getProfile(userId) {
  return api(`/profile/${userId}`)
}

export async function updateProfile({ bio, preferences, image }) {
  const formData = new FormData()
  if (bio !== undefined) formData.append('bio', bio)
  if (preferences !== undefined) formData.append('preferences', JSON.stringify(preferences))
  if (image) formData.append('image', image)
  return apiUpload('/profile', { method: 'PATCH', formData })
}

// Posts API
export async function getPosts(userId) {
  return api(`/profile/posts/${userId}`)
}

export async function createPost(content) {
  return api('/profile/posts', { method: 'POST', body: { content } })
}

export async function deletePost(postId) {
  return api(`/profile/posts/${postId}`, { method: 'DELETE' })
}
