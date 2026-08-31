import { useState } from 'react'
import { Check, Eye, EyeOff, KeyRound, ShieldAlert } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../context/UsersContext'

export default function CambiarContrasena() {
  const { user } = useAuth()
  const { changePassword } = useUsers()

  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setDone(false)

    if (!current) {
      setError('Escribe tu contraseña anterior.')
      return
    }
    if (next.length < 4) {
      setError('La nueva contraseña debe tener al menos 4 caracteres.')
      return
    }
    if (next !== confirm) {
      setError('La nueva contraseña y su confirmación no coinciden.')
      return
    }

    const result = await changePassword(user.id, current, next)
    if (!result.ok) {
      setError(result.message)
      return
    }
    setDone(true)
    setCurrent('')
    setNext('')
    setConfirm('')
  }

  return (
    <div className="usuarios-page">
      <div className="usuarios-title-row">
        <div className="usuarios-title">
          <KeyRound size={26} color="var(--blue)" />
          <h1>Cambiar contraseña</h1>
        </div>
        <p className="ususarios-subtitle">
          Para actualizar tu contraseña, primero escribe la anterior.
        </p>
      </div>

      <div className="contrasena-hint">
        <ShieldAlert size={18} />
        <span>Escribe tu contraseña actual para confirmar que eres tú.</span>
      </div>

      <form className="usuarios-form" onSubmit={handleSubmit}>
        <label className="new-activity-field">
          <span>Contraseña anterior *</span>
          <div className="password-field">
            <input
              type={show ? 'text' : 'password'}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Tu contraseña actual"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
              className="password-toggle"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        <label className="new-activity-field">
          <span>Nueva contraseña *</span>
          <div className="password-field">
            <input
              type={show ? 'text' : 'password'}
              value={next}
              onChange={(e) => setNext(e.target.value)}
              placeholder="Nueva contraseña"
              autoComplete="new-password"
            />
          </div>
        </label>

        <label className="new-activity-field">
          <span>Confirmar nueva contraseña *</span>
          <div className="password-field">
            <input
              type={show ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la nueva contraseña"
              autoComplete="new-password"
            />
            </div>
        </label>

        {error && <p className="field-error">{error}</p>}
        {done && (
          <p className="contrasena-success">
            <Check size={16} />
            ¡Contraseña actualizada correctamente!
          </p>
        )}

        <button type="submit" className="new-activity-submit">
          Actualizar contraseña
        </button>
      </form>
    </div>
  )
}
