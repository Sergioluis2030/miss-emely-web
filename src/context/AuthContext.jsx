import { createContext, useContext, useEffect, useState } from 'react'
import { findUser } from '../data/mockUsers'

const AuthContext = createContext(null)
const STORAGE_KEY = 'missemely.session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      // sesión corrupta o no disponible, se ignora
    } finally {
      setIsReady(true)
    }
  }, [])

  function login(username, password) {
    const found = findUser(username, password)
    if (!found) {
      return { ok: false, message: 'Usuario o contraseña incorrectos. Inténtalo de nuevo.' }
    }
    const { password: _pw, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
    return { ok: true }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
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
