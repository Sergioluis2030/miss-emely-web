import { createContext, useContext, useEffect, useState } from 'react'
import { api, setStoredToken, clearStoredToken, getStoredToken } from '../utils/api'

const AuthContext = createContext(null)
const SESSION_KEY = 'missemely.session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // Al montar, si hay token guardado intentamos restaurar la sesión con /auth/me
  useEffect(() => {
    async function restore() {
      const token = getStoredToken()
      if (!token) {
        setIsReady(true)
        return
      }
      try {
        const data = await api('/auth/me')
        setUser(data.user)
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.user))
      } catch {
        // token inválido o expirado: limpiamos la sesión
        clearStoredToken()
        localStorage.removeItem(SESSION_KEY)
      } finally {
        setIsReady(true)
      }
    }
    restore()
  }, [])

  async function login(username, password) {
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: { username, password },
      })
      setStoredToken(data.token)
      setUser(data.user)
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user))
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }

  function logout() {
    clearStoredToken()
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
