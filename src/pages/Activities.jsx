import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useActivities } from '../context/ActivitiesContext'
import ActivityCard from '../components/ActivityCard'
import NewActivityForm from '../components/NewActivityForm'
import WeekPicker from '../components/WeekPicker'
import { startOfWeek, isInWeek } from '../utils/date'

export default function Activities() {
  const { user } = useAuth()
  const { activities } = useActivities()
  const [selectedMonday, setSelectedMonday] = useState(() => startOfWeek(new Date()))

  const weekActivities = activities.filter((a) => isInWeek(a.date, selectedMonday))

  const sorted = [...weekActivities].sort((a, b) =>
    a.date === b.date ? new Date(b.createdAt) - new Date(a.createdAt) : b.date.localeCompare(a.date)
  )

  return (
    <div className="activities-page">
      <div className="activities-title-row">
        <div className="activities-title">
          <CalendarDays size={26} color="var(--blue)" />
          <h1>Agenda de actividades</h1>
        </div>
        <p className="activities-subtitle">
          {user?.role === 'teacher'
            ? 'Escribe la actividad del día para que tus alumnos la vean y comenten.'
            : 'Aquí encontrarás lo que Miss Emely preparó para cada día.'}
        </p>
        <div className="activities-week-row">
          <WeekPicker selectedMonday={selectedMonday} onSelect={setSelectedMonday} />
        </div>
      </div>

      {user?.role === 'teacher' && <NewActivityForm />}

      {sorted.length === 0 ? (
        <div className="activities-empty">
          <span role="img" aria-hidden="true">🗓️</span>
          <h3>
            {activities.length === 0
              ? 'Todavía no hay actividades'
              : 'No hay actividades en esta semana'}
          </h3>
          <p>
            {activities.length === 0
              ? user?.role === 'teacher'
                ? 'Usa el botón de arriba para publicar la primera actividad.'
                : 'Miss Emely aún no ha publicado actividades. ¡Vuelve pronto!'
              : 'Elige otra semana en el selector de arriba para ver más actividades.'}
          </p>
        </div>
      ) : (
        <div className="activities-list">
          {sorted.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  )
}
