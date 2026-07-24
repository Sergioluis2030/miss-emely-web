import { createContext, useContext, useEffect, useState } from 'react'
import { SEED_ACTIVITIES } from '../data/mockActivities'

const ActivitiesContext = createContext(null)
const STORAGE_KEY = 'missemely.activities'

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // si falla, seguimos con la data semilla
  }
  return SEED_ACTIVITIES
}

export function ActivitiesProvider({ children }) {
  const [activities, setActivities] = useState(loadInitial)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
  }, [activities])

  // Simula POST /api/activities (ver CreateActivityDTO)
  function createActivity({ date, title, description, imageUrl, author }) {
    const newActivity = {
      id: `act-${Date.now()}`,
      date,
      title: title.trim(),
      description: description.trim(),
      imageUrl: imageUrl || null,
      authorId: author.id,
      authorName: author.fullName,
      createdAt: new Date().toISOString(),
      comments: [],
    }
    setActivities((prev) => [newActivity, ...prev])
    return newActivity
  }

  // Simula DELETE /api/activities/:id
  function deleteActivity(activityId) {
    setActivities((prev) => prev.filter((a) => a.id !== activityId))
  }

  // Simula POST /api/activities/:id/comments (ver CreateCommentDTO)
  function addComment(activityId, { text, author }) {
    const newComment = {
      id: `c-${Date.now()}`,
      authorId: author.id,
      authorName: author.fullName,
      authorRole: author.role,
      text: text.trim(),
      createdAt: new Date().toISOString(),
    }
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId ? { ...a, comments: [...a.comments, newComment] } : a
      )
    )
  }

  return (
    <ActivitiesContext.Provider
      value={{ activities, createActivity, deleteActivity, addComment }}
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
