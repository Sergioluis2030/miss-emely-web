import { useRef, useState, useEffect } from 'react'
import { resolveImageUrl } from '../utils/api'

const MAX_IMAGE_MB = 4

export default function EditProfileModal({ profile, onClose, onSubmit, error }) {
  const fileInputRef = useRef(null)
  const [bio, setBio] = useState(profile.bio || '')
  const [preferences, setPreferences] = useState(profile.preferences || {})
  const [imageUrl, setImageUrl] = useState(resolveImageUrl(profile.profileImageUrl))
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const prefsDefault = {
      notifications: true,
      emailUpdates: false,
      theme: 'light',
      ...profile.preferences
    }
    setPreferences(prefsDefault)
  }, [profile])

  function handleImageChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageError('')

    if (!file.type.startsWith('image/')) {
      setImageError('Selecciona un archivo de imagen válido.')
      return
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setImageError(`La imagen debe pesar menos de ${MAX_IMAGE_MB} MB.`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => setImageUrl(reader.result)
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  function handlePreferenceChange(key, value) {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({ bio: bio.trim(), preferences, image: imageFile })
    } finally {
      setSubmitting(false)
    }
  }

  function removeImage() {
    setImageUrl(null)
    setImageFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal edit-profile-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Editar perfil</h3>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label>
                <span>Foto de perfil</span>
                <div className="image-upload-wrapper">
                  <label className="image-upload">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <path d="M21 15l-5-5L5 21" />
                    </svg>
                    {imageFile ? 'Cambiar imagen' : 'Subir foto'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      hidden
                    />
                  </label>
                  {imageError && <p className="field-error">{imageError}</p>}
                  {imageUrl && (
                    <div className="image-preview">
                      <img src={imageUrl} alt="Vista previa" />
                      <button type="button" onClick={removeImage} aria-label="Quitar imagen">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </label>
            </div>

            <div className="form-group">
              <label>
                <span>Descripción (Bio)</span>
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Cuéntanos sobre ti, tus intereses, tu vida..."
                />
                <small>{bio.length}/1000 caracteres</small>
              </label>
            </div>

            <fieldset className="form-group preferences-fieldset">
              <legend>Preferencias</legend>
              <div className="preferences-grid">
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={e => handlePreferenceChange('notifications', e.target.checked)}
                  />
                  <span>Recibir notificaciones</span>
                </label>
                <label className="preference-item">
                  <input
                    type="checkbox"
                    checked={preferences.emailUpdates}
                    onChange={e => handlePreferenceChange('emailUpdates', e.target.checked)}
                  />
                  <span>Actualizaciones por email</span>
                </label>
                <label className="preference-item">
                  <span>Tema</span>
                  <select
                    value={preferences.theme}
                    onChange={e => handlePreferenceChange('theme', e.target.value)}
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </label>
              </div>
            </fieldset>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}