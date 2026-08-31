import { useRef, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { useActivities } from '../context/ActivitiesContext'

const MAX_IMAGE_MB = 4

export default function EditActivityForm({ activity, onClose }) {
  const { updateActivity } = useActivities()
  const fileInputRef = useRef(null)

  const [date, setDate] = useState(activity.date)
  const [title, setTitle] = useState(activity.title)
  const [description, setDescription] = useState(activity.description)
  const [imageUrl, setImageUrl] = useState(activity.imageUrl)
  const [imageFile, setImageFile] = useState(null)
  const [imageError, setImageError] = useState('')
  const [error, setError] = useState('')

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

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !date) {
      setError('Completa la fecha, el título y la descripción de la actividad.')
      return
    }
    try {
      await updateActivity(activity.id, { date, title, description, image: imageFile })
      onClose()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="edit-activity-overlay" onClick={onClose}>
      <form
        className="edit-activity-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="new-activity-form-head">
          <h3>Editar actividad</h3>
          <button
            type="button"
            className="new-activity-close"
            onClick={onClose}
            aria-label="Cerrar editor"
          >
            <X size={20} />
          </button>
        </div>

        <label className="new-activity-field">
          <span>Fecha</span>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </label>

        <label className="new-activity-field">
          <span>Título</span>
          <input
            type="text"
            placeholder="Ej. Sumas con dibujitos 🍎"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            required
          />
        </label>

        <label className="new-activity-field">
          <span>Descripción de la actividad</span>
          <textarea
            placeholder="Explica qué harán los alumnos y qué deben traer o repasar en casa…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={600}
            required
          />
        </label>

        <div className="new-activity-field">
          <span>Foto (opcional)</span>
          <label className="image-upload">
            <ImagePlus size={18} />
            {imageUrl ? 'Cambiar imagen' : 'Subir una foto'}
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
              <img src={imageUrl} alt="Vista previa de la actividad" />
              <button
                type="button"
                onClick={() => {
                  setImageUrl(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                aria-label="Quitar imagen"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {error && <p className="field-error">{error}</p>}

        <div className="edit-activity-form-actions">
          <button type="button" className="edit-activity-cancel" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="new-activity-submit">
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  )
}
