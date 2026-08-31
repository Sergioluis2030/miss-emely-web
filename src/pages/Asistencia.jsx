import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, ClipboardCheck, Save } from 'lucide-react'
import { useUsers } from '../context/UsersContext'
import { useAttendance } from '../context/AttendanceContext'
import { addDays, startOfWeek, toISODate, formatLongDate } from '../utils/date'

const WEEKDAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie']

export default function Asistencia({ readOnly = false }) {
  const { users } = useUsers()
  const { saveDay, loadRange } = useAttendance()

  const students = users.filter((u) => u.kinship === 'alumno')
  const [monday, setMonday] = useState(() => startOfWeek(new Date()))
  const [dayIndex, setDayIndex] = useState(0) // 0=Lun ... 4=Vie
  const [draft, setDraft] = useState({})
  const [saved, setSaved] = useState(false)

  const dateISO = useMemo(() => toISODate(addDays(monday, dayIndex)), [monday, dayIndex])
  const dateLabel = formatLongDate(dateISO)

  // Al cambiar de semana o día, cargamos los registros del backend y usamos
  // los del día seleccionado como borrador.
  useEffect(() => {
    let active = true
    async function load() {
      const fri = addDays(monday, 6)
      const merged = await loadRange(toISODate(monday), toISODate(fri))
      if (active) {
        setDraft(merged[dateISO] || {})
        setSaved(false)
      }
    }
    load()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateISO])

  function isPresent(userId) {
    return draft[userId] === true
  }

  function toggle(userId) {
    setSaved(false)
    setDraft((prev) => ({ ...prev, [userId]: !(prev[userId] === true) }))
  }

  async function handleSave() {
    await saveDay(dateISO, draft)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  function changeWeek(dir) {
    setMonday((prev) => addDays(prev, dir * 7))
  }

  const presentCount = students.filter((s) => isPresent(s.id)).length

  return (
    <div className="asistencia-page">
      <div className="usuarios-title-row">
        <div className="usuarios-title">
          <ClipboardCheck size={26} color="var(--blue)" />
          <h1>Asistencia</h1>
        </div>
        <p className="ususarios-subtitle">
          {readOnly
            ? 'Consulta el registro de asistencia de tu curso.'
            : 'Marca quién asistió cada día y guarda el registro.'}
        </p>
      </div>

      <div className="asistencia-toolbar">
        <div className="asistencia-week-nav">
          <button type="button" onClick={() => changeWeek(-1)} aria-label="Semana anterior">
            <ChevronLeft size={18} />
          </button>
          <div className="asistencia-days">
            {WEEKDAY_LABELS.map((label, i) => (
              <button
                key={label}
                type="button"
                className={`asistencia-day-btn ${i === dayIndex ? 'is-active' : ''}`}
                onClick={() => setDayIndex(i)}
              >
                {label}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => changeWeek(1)} aria-label="Semana siguiente">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="asistencia-date-label">
          <CalendarDays size={16} />
          {dateLabel}
        </div>
      </div>

      {students.length === 0 ? (
        <div className="activities-empty">
          <span role="img" aria-hidden="true">📋</span>
          <h3>No hay alumnos registrados</h3>
          <p>Agrega alumnos en la sección "Usuarios" para poder marcar asistencia.</p>
        </div>
      ) : (
        <div className="asistencia-card">
          <table className="asistencia-table">
            <thead>
              <tr>
                <th className="asistencia-th-name">Alumno/a</th>
                <th className="asistencia-th-check">¿Asistió?</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="asistencia-student">
                      <div
                        className="sidebar-user-avatar"
                        style={{ background: s.avatarColor }}
                      >
                        {s.avatarEmoji}
                      </div>
                      <span>{s.fullName}</span>
                    </div>
                  </td>
                  <td className="asistencia-check-cell">
                    {readOnly ? (
                      <span
                        className={`asistencia-badge ${isPresent(s.id) ? 'is-present' : 'is-absent'}`}
                      >
                        {isPresent(s.id) ? 'Presente' : 'Ausente'}
                      </span>
                    ) : (
                      <input
                        type="checkbox"
                        checked={isPresent(s.id)}
                        onChange={() => toggle(s.id)}
                        aria-label={`Asistencia de ${s.fullName}`}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="asistencia-footer">
            <p className="asistencia-summary">
              {presentCount} de {students.length} presente
              {students.length === 1 ? '' : 's'}
            </p>
            {!readOnly && (
              <button type="button" className="asistencia-save-btn" onClick={handleSave}>
                <Save size={18} />
                Guardar
              </button>
            )}
            {saved && <span className="asistencia-saved">✓ Guardado</span>}
          </div>
        </div>
      )}
    </div>
  )
}
