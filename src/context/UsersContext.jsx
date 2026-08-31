import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../utils/api'

const UsersContext = createContext(null)

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Carga la lista de usuarios desde el backend al montar.
  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await api('/users')
        if (active) setUsers(data.users)
      } catch (err) {
        if (active) setError(err.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  // Crea un usuario (alumno/padre/madre). Devuelve el usuario creado junto con
  // la contraseña generada, para mostrarla una sola vez.
  async function createUser({ fullName, kinship, password, birthday, favoriteColor, extra, childId }) {
    const data = await api('/users', {
      method: 'POST',
      body: {
        fullName,
        kinship,
        password,
        birthday: birthday || null,
        favoriteColor: favoriteColor || null,
        extra: extra || null,
        childId: kinship !== 'alumno' ? childId || null : null,
      },
    })
    setUsers((prev) => [...prev, data.user])
    return { ...data.user, password: data.password }
  }

  // Alterna el bloqueo de comentarios de un usuario (solo maestra).
  async function toggleCommentBlock(userId) {
    const data = await api(`/users/${userId}/block-comment`, {
      method: 'PATCH',
      body: {},
    })
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, canComment: data.canComment } : u))
    )
    return data
  }

  async function updateUser(userId, fields) {
    const data = await api(`/users/${userId}`, { method: 'PATCH', body: fields })
    setUsers((prev) => prev.map((u) => (u.id === userId ? data.user : u)))
    return data.user
  }

  async function removeUser(userId) {
    await api(`/users/${userId}`, { method: 'DELETE' })
    setUsers((prev) => prev.filter((u) => u.id !== userId))
  }

  // Cambia la contraseña de un usuario, validando antes la anterior.
  // Devuelve { ok: true } o lanza Error con el mensaje.
  async function changePassword(userId, currentPassword, newPassword) {
    try {
      await api(`/users/${userId}/password`, {
        method: 'PATCH',
        body: { currentPassword, newPassword },
      })
      return { ok: true }
    } catch (err) {
      return { ok: false, message: err.message }
    }
  }

  return (
    <UsersContext.Provider
      value={{
        users,
        loading,
        error,
        createUser,
        toggleCommentBlock,
        updateUser,
        removeUser,
        changePassword,
      }}
    >
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers debe usarse dentro de <UsersProvider>')
  return ctx
}
