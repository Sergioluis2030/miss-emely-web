import { CalendarDays } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useActivities } from '../context/ActivitiesContext'
import ActivityCard from '../components/ActivityCard'
import NewActivityForm from '../components/NewActivityForm'

export default function Activities() {
  const { user } = useAuth()
  const { activities } = useActivities()

  const sorted = [...activities].sort((a, b) =>
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
      </div>

      {user?.role === 'teacher' && <NewActivityForm />}

      {sorted.length === 0 ? (
        <div className="activities-empty">
          <span role="img" aria-hidden="true">🗓️</span>
          <h3>Todavía no hay actividades</h3>
          <p>
            {user?.role === 'teacher'
              ? 'Usa el botón de arriba para publicar la primera actividad.'
              : 'Miss Emely aún no ha publicado actividades. ¡Vuelve pronto!'}
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
