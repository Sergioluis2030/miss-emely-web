import { CalendarCheck2, LogOut, Star, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <Star size={22} fill="#F1C40F" stroke="#F1C40F" />
            <span>Miss Emely</span>
          </div>
          <button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú">
            <X size={22} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          <button className="sidebar-link sidebar-link-active" type="button">
            <CalendarCheck2 size={20} />
            <span>Actividades</span>
          </button>
        </nav>

        <p className="sidebar-hint">Más secciones llegarán pronto ✨</p>

        <div className="sidebar-footer">
          {user && (
            <div className="sidebar-user">
              <div className="sidebar-user-avatar" style={{ background: user.avatarColor }}>
                {user.avatarEmoji}
              </div>
              <div>
                <p className="sidebar-user-name">{user.fullName}</p>
                <p className="sidebar-user-role">
                  {user.role === 'teacher' ? 'Docente' : user.grade || 'Alumno/a'}
                </p>
              </div>
            </div>
          )}
          <button className="sidebar-logout" onClick={logout} type="button">
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
