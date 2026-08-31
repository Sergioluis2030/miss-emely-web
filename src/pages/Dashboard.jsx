import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Activities from './Activities'
import Usuarios from './Usuarios'
import Asistencia from './Asistencia'
import CambiarContrasena from './CambiarContrasena'
import ProfilePage from './ProfilePage'
import { useAuth } from '../context/AuthContext'
import { UsersProvider } from '../context/UsersContext'
import { ActivitiesProvider } from '../context/ActivitiesContext'
import { AttendanceProvider } from '../context/AttendanceContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [section, setSection] = useState('actividades')
  const [profileId, setProfileId] = useState(null)
  const location = useLocation()

  const isTeacher = user?.role === 'teacher'

  // Detectar si la URL es /profile/:id
  useEffect(() => {
    if (location.pathname.startsWith('/profile/')) {
      const id = location.pathname.split('/profile/')[1]
      if (id) {
        setSection('perfil')
        setProfileId(Number(id))
      }
    } else {
      setSection('actividades')
      setProfileId(null)
    }
  }, [location.pathname])

  const handleNavigate = (newSection, id) => {
    setSection(newSection)
    if (newSection === 'perfil' && id) {
      setProfileId(id)
    } else {
      setProfileId(null)
    }
  }

  return (
    <UsersProvider>
      <ActivitiesProvider>
        <AttendanceProvider>
          <div className="dashboard">
            <Sidebar
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              section={section}
              onNavigate={handleNavigate}
            />
            <div className="dashboard-main">
              <Topbar onOpenMenu={() => setMenuOpen(true)} />
              <main className="dashboard-content">
                {section === 'actividades' && <Activities />}
                {section === 'usuarios' && isTeacher && <Usuarios />}
                {section === 'asistencia' && <Asistencia readOnly={!isTeacher} />}
                {section === 'contrasena' && !isTeacher && <CambiarContrasena />}
                {section === 'perfil' && <ProfilePage profileId={profileId} />}
              </main>
            </div>
          </div>
        </AttendanceProvider>
      </ActivitiesProvider>
    </UsersProvider>
  )
}
