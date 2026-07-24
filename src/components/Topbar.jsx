import { Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const GREETING_EMOJI = ['👋', '🌟', '🎈', '🖍️']

export default function Topbar({ onOpenMenu }) {
  const { user } = useAuth()
  const emoji = GREETING_EMOJI[new Date().getDate() % GREETING_EMOJI.length]

  return (
    <header className="topbar">
      <button className="topbar-menu-btn" onClick={onOpenMenu} aria-label="Abrir menú">
        <Menu size={24} />
      </button>
      <div className="topbar-greeting">
        <h2>
          ¡Hola, {user?.fullName?.split(' ')[0]}! {emoji}
        </h2>
        <p>
          {user?.role === 'teacher'
            ? 'Comparte la actividad de hoy con tu clase'
            : 'Revisa las actividades de tu clase'}
        </p>
      </div>
      <div className="topbar-avatar" style={{ background: user?.avatarColor }} aria-hidden="true">
        {user?.avatarEmoji}
      </div>
    </header>
  )
}
