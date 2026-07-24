import { useState } from 'react'
import { Eye, EyeOff, User, Lock, Star } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import LoginIllustration from '../components/LoginIllustration'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!username.trim() || !password) {
      setError('Completa tu usuario y contraseña para continuar.')
      return
    }
    setSubmitting(true)
    // Pequeña espera simulada, útil cuando esto se conecte a un backend real
    setTimeout(() => {
      const result = login(username, password)
      if (!result.ok) setError(result.message)
      setSubmitting(false)
    }, 300)
  }

  function fillDemo(role) {
    if (role === 'teacher') {
      setUsername('missemely')
      setPassword('profe123')
    } else {
      setUsername('sofia')
      setPassword('alumno123')
    }
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-hero">
        <LoginIllustration />
      </div>

      <div className="login-panel">
        <div className="login-card">
          <div className="login-brand">
            <Star size={30} fill="#F1C40F" stroke="#F1C40F" />
            <h1>Miss Emely</h1>
          </div>
          <p className="login-subtitle">¡Bienvenido de vuelta! Inicia sesión para ver las actividades.</p>

          <form onSubmit={handleSubmit} noValidate>
            <label className="field" htmlFor="username">
              <User size={20} className="field-icon" aria-hidden="true" />
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>

            <label className="field" htmlFor="password">
              <Lock size={20} className="field-icon" aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="field-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            {error && (
              <p className="login-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="login-submit" disabled={submitting}>
              {submitting ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="login-demo">
            <p>Cuentas de prueba:</p>
            <div className="login-demo-buttons">
              <button type="button" onClick={() => fillDemo('teacher')}>
                👩‍🏫 Soy Miss Emely
              </button>
              <button type="button" onClick={() => fillDemo('student')}>
                👧 Soy alumna/o
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
