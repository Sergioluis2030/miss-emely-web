import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  const { user, isReady } = useAuth()

  if (!isReady) {
    return (
      <div className="app-loading">
        <span>Cargando…</span>
      </div>
    )
  }

  return (
    <Routes>
      {user ? (
        <>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/*" element={<Dashboard />} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      )}
    </Routes>
  )
}