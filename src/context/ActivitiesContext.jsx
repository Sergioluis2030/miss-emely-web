import { createContext, useContext, useEffect, useState } from 'react'
import { api, apiUpload } from '../utils/api'

const ActivitiesContext = createContext(null)

export function ActivitiesProvider({ children }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Carga las actividades (con sus comentarios) al montar.
  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await api('/activities')
        if (active) setActivities(data.activities)
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

  async function createActivity({ date, title, description, image }) {
    const formData = new FormData()
    formData.append('date', date)
    formData.append('title', title)
    formData.append('description', description)
    if (image) formData.append('image', image)
    const data = await apiUpload('/activities', { method: 'POST', formData })
    setActivities((prev) => [data.activity, ...prev])
    return data.activity
  }

  async function deleteActivity(activityId) {
    await api(`/activities/${activityId}`, { method: 'DELETE' })
    setActivities((prev) => prev.filter((a) => a.id !== activityId))
  }

  async function updateActivity(activityId, { date, title, description, image }) {
    const formData = new FormData()
    formData.append('date', date)
    formData.append('title', title)
    formData.append('description', description)
    if (image) formData.append('image', image)
    const data = await apiUpload(`/activities/${activityId}`, { method: 'PATCH', formData })
    setActivities((prev) =>
      prev.map((a) => (a.id === activityId ? data.activity : a))
    )
    return data.activity
  }

  async function addComment(activityId, { text }) {
    const data = await api(`/activities/${activityId}/comments`, {
      method: 'POST',
      body: { text },
    })
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId ? { ...a, comments: [...a.comments, data.comment] } : a
      )
    )
    return data.comment
  }

  return (
    <ActivitiesContext.Provider
      value={{ activities, loading, error, createActivity, deleteActivity, updateActivity, addComment }}
    >
      {children}
    </ActivitiesContext.Provider>
  )
}

export function useActivities() {
  const ctx = useContext(ActivitiesContext)
  if (!ctx) throw new Error('useActivities debe usarse dentro de <ActivitiesProvider>')
  return ctx
}
