import { CalendarCheck2, ClipboardCheck, KeyRound, LogOut, Star, UserPlus, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Sidebar({ isOpen, onClose, section, onNavigate }) {
  const { user, logout } = useAuth()
  const isTeacher = user?.role === 'teacher'

  function go(sectionName, id) {
    onNavigate(sectionName, id)
    onClose()
  }

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
          <button
            className={`sidebar-link ${section === 'actividades' ? 'sidebar-link-active' : ''}`}
            type="button"
            onClick={() => go('actividades')}
          >
            <CalendarCheck2 size={20} />
            <span>Actividades</span>
          </button>

          {isTeacher ? (
            <>
              <button
                className={`sidebar-link ${section === 'usuarios' ? 'sidebar-link-active' : ''}`}
                type="button"
                onClick={() => go('usuarios')}
              >
                <UserPlus size={20} />
                <span>Usuarios</span>
              </button>

              <button
                className={`sidebar-link ${section === 'asistencia' ? 'sidebar-link-active' : ''}`}
                type="button"
                onClick={() => go('asistencia')}
              >
                <ClipboardCheck size={20} />
                <span>Asistencia</span>
              </button>
            </>
          ) : (
            <>
              <button
                className={`sidebar-link ${section === 'asistencia' ? 'sidebar-link-active' : ''}`}
                type="button"
                onClick={() => go('asistencia')}
              >
                <ClipboardCheck size={20} />
                <span>Mi asistencia</span>
              </button>

              <button
                className={`sidebar-link ${section === 'contrasena' ? 'sidebar-link-active' : ''}`}
                type="button"
                onClick={() => go('contrasena')}
              >
                <KeyRound size={20} />
                <span>Cambiar contraseña</span>
              </button>
            </>
          )}

          <button
            className={`sidebar-link ${section === 'perfil' ? 'sidebar-link-active' : ''}`}
            type="button"
            onClick={() => go('perfil', user.id)}
          >
            <UserPlus size={20} />
            <span>Mi perfil</span>
          </button>
        </nav>

        <p className="sidebar-hint">Más secciones llegarán pronto ✨</p>

        <div className="sidebar-footer">
          {user && (
            <button
              className="sidebar-user-link"
              onClick={() => go('perfil', user.id)}
              type="button"
              aria-label="Ir a mi perfil"
            >
              <div className="sidebar-user-avatar" style={{ background: user.avatarColor }}>
                {user.avatarEmoji}
              </div>
              <div>
                <p className="sidebar-user-name">{user.fullName}</p>
                <p className="sidebar-user-role">
                  {user.role === 'teacher' ? 'Docente' : user.grade || 'Alumno/a'}
                </p>
              </div>
            </button>
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
