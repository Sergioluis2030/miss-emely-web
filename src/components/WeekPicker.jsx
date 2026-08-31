import { useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, X } from 'lucide-react'

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

// Devuelve el lunes de la semana a la que pertenece la fecha dada
function startOfWeek(date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dow = (d.getDay() + 6) % 7 // lunes = 0
  d.setDate(d.getDate() - dow)
  return d
}

function formatRange(monday) {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const start = `${DIAS[monday.getDay()].slice(0, 3)} ${monday.getDate()}`
  const end = `${DIAS[sunday.getDay()].slice(0, 3)} ${sunday.getDate()} de ${formatMonth(sunday)}`
  return `${start} – ${end}`
}

function formatMonth(d) {
  const MESES = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ]
  return MESES[d.getMonth()]
}

function addWeeks(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n * 7)
  return d
}

export default function WeekPicker({ selectedMonday, onSelect }) {
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(selectedMonday)

  // Genera la grilla del mes que contiene `cursor`
  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // lunes = 0
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < offset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  const mLabel = `${formatMonth(cursor)} ${year}`

  function handlePick(d) {
    const monday = startOfWeek(d)
    onSelect(monday)
    setOpen(false)
  }

  return (
    <div className="week-picker">
      <div className="week-picker-current">
        <button
          type="button"
          className="week-picker-trigger"
          onClick={() => {
            setCursor(selectedMonday)
            setOpen((s) => !s)
          }}
          aria-expanded={open}
        >
          <CalendarDays size={18} />
          <span>
            Semana del <strong>{formatRange(selectedMonday)}</strong>
          </span>
        </button>
        <button
          type="button"
          className="week-picker-nav-btn"
          onClick={() => onSelect(addWeeks(selectedMonday, -1))}
          aria-label="Semana anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          type="button"
          className="week-picker-nav-btn"
          onClick={() => onSelect(addWeeks(selectedMonday, 1))}
          aria-label="Semana siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {open && (
        <div className="week-picker-popover">
          <div className="week-picker-head">
            <button
              type="button"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              aria-label="Mes anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <span>{mLabel}</span>
            <button
              type="button"
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              aria-label="Mes siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="week-picker-grid week-picker-labels">
            {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          <div className="week-picker-grid">
            {cells.map((d, i) => {
              if (!d) return <span key={i} className="week-picker-empty" />
              const isSelected =
                d >= selectedMonday && d <= new Date(selectedMonday.getTime() + 6 * 86400000)
              return (
                <button
                  key={i}
                  type="button"
                  className={`week-picker-day ${isSelected ? 'week-picker-day-selected' : ''}`}
                  onClick={() => handlePick(d)}
                >
                  {d.getDate()}
                </button>
              )
            })}
          </div>

          <button
            type="button"
            className="week-picker-close"
            onClick={() => setOpen(false)}
          >
            <X size={14} />
            Cerrar
          </button>
        </div>
      )}
    </div>
  )
}
