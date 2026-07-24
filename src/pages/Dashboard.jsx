import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import Activities from './Activities'
import { ActivitiesProvider } from '../context/ActivitiesContext'
import './Dashboard.css'

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <ActivitiesProvider>
      <div className="dashboard">
        <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
        <div className="dashboard-main">
          <Topbar onOpenMenu={() => setMenuOpen(true)} />
          <main className="dashboard-content">
            <Activities />
          </main>
        </div>
      </div>
    </ActivitiesProvider>
  )
}
