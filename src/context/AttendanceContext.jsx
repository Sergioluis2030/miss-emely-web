import { createContext, useContext, useState } from 'react'
import { api } from '../utils/api'

const AttendanceContext = createContext(null)

// Estructura en memoria: { 'aaaa-mm-dd': { [userId]: true|false } }
export function AttendanceProvider({ children }) {
  const [attendance, setAttendance] = useState({})

  // Carga la asistencia en un rango de fechas [from, to] y la fusiona con la caché.
  // Devuelve el mapa de registros (por fecha) ya fusionado.
  async function loadRange(from, to) {
    try {
      const params = new URLSearchParams()
      if (from) params.set('from', from)
      if (to) params.set('to', to)
      const qs = params.toString()
      const data = await api(`/attendance${qs ? `?${qs}` : ''}`)
      const remote = data.records || {}

      let merged = {}
      setAttendance((prev) => {
        const next = { ...prev }
        for (const [dateISO, map] of Object.entries(remote)) {
          next[dateISO] = { ...(next[dateISO] || {}), ...map }
        }
        merged = next
        return next
      })
      return merged
    } catch {
      return attendance
    }
  }

  // Actualiza la asistencia de un alumno en una fecha (solo local; guardar requiere saveDay).
  function markAttendance(dateISO, userId, present) {
    setAttendance((prev) => {
      const day = prev[dateISO] || {}
      return { ...prev, [dateISO]: { ...day, [userId]: present } }
    })
  }

  // Guarda el registro completo de un día en el backend y actualiza la caché.
  async function saveDay(dateISO, dayRecords) {
    const normalized = {}
    for (const [id, present] of Object.entries(dayRecords)) normalized[id] = !!present
    await api(`/attendance/date/${dateISO}`, {
      method: 'PUT',
      body: { records: normalized },
    })
    setAttendance((prev) => ({ ...prev, [dateISO]: normalized }))
  }

  // Devuelve la asistencia guardada (caché) de una fecha.
  function getDay(dateISO) {
    return attendance[dateISO] || {}
  }

  return (
    <AttendanceContext.Provider value={{ attendance, loadRange, markAttendance, saveDay, getDay }}>
      {children}
    </AttendanceContext.Provider>
  )
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext)
  if (!ctx) throw new Error('useAttendance debe usarse dentro de <AttendanceProvider>')
  return ctx
}
