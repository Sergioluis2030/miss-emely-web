import { useRef, useState } from 'react'
import { ImagePlus, X, PenLine } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useActivities } from '../context/ActivitiesContext'
import { todayISO } from '../utils/date'

const MAX_IMAGE_MB = 4

export default function NewActivityForm() {
  const { user } = useAuth()
  const { createActivity } = useActivities()
  const fileInputRef = useRef(null)

  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState(todayISO())
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const [imageError, setImageError] = useState('')
  const [error, setError] = useState('')

  function resetForm() {
    setDate(todayISO())
    setTitle('')
    setDescription('')
    setImageUrl(null)
    setImageError('')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

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
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !date) {
      setError('Completa la fecha, el título y la descripción de la actividad.')
      return
    }
    createActivity({ date, title, description, imageUrl, author: user })
    resetForm()
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <button type="button" className="new-activity-trigger" onClick={() => setIsOpen(true)}>
        <PenLine size={19} />
        Redactar actividad de hoy
      </button>
    )
  }

  return (
    <form className="new-activity-form" onSubmit={handleSubmit}>
      <div className="new-activity-form-head">
        <h3>Nueva actividad</h3>
        <button
          type="button"
          className="new-activity-close"
          onClick={() => {
            resetForm()
            setIsOpen(false)
          }}
          aria-label="Cerrar formulario"
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

      <button type="submit" className="new-activity-submit">
        Publicar actividad
      </button>
    </form>
  )
}
