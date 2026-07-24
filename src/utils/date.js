const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

// Colores por día de semana: usados como "pestaña" de la nota de agenda.
// Codifica visualmente qué día fue cada actividad (no es decorativo al azar).
const DAY_COLORS = [
  '#FF6B9D', // domingo
  '#4A90E2', // lunes
  '#2ECC71', // martes
  '#F1C40F', // miércoles
  '#FF8C42', // jueves
  '#9B59B6', // viernes
  '#4A90E2', // sábado
]

export function parseISODate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function formatLongDate(isoDate) {
  const date = parseISODate(isoDate)
  const dia = DIAS[date.getDay()]
  const mes = MESES[date.getMonth()]
  return `${dia} ${date.getDate()} de ${mes}`
}

export function formatShortDay(isoDate) {
  const date = parseISODate(isoDate)
  return {
    weekday: DIAS[date.getDay()].slice(0, 3).toUpperCase(),
    day: String(date.getDate()).padStart(2, '0'),
  }
}

export function dayColor(isoDate) {
  const date = parseISODate(isoDate)
  return DAY_COLORS[date.getDay()]
}

export function formatRelativeTime(isoDateTime) {
  const then = new Date(isoDateTime).getTime()
  const now = Date.now()
  const diffMin = Math.round((now - then) / 60000)
  if (diffMin < 1) return 'justo ahora'
  if (diffMin < 60) return `hace ${diffMin} min`
  const diffHr = Math.round(diffMin / 60)
  if (diffHr < 24) return `hace ${diffHr} h`
  const diffDay = Math.round(diffHr / 24)
  if (diffDay === 1) return 'ayer'
  return `hace ${diffDay} días`
}

export function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
