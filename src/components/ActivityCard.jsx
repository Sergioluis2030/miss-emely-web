import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Maximize2, MessageCircle, Pencil, Send, Trash2, ImageOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useActivities } from '../context/ActivitiesContext'
import { formatShortDay, formatLongDate, dayColor } from '../utils/date'
import { resolveImageUrl } from '../utils/api'
import Comment from './Comment'
import EditActivityForm from './EditActivityForm'

const MAX_VISIBLE_COMMENTS = 10

export default function ActivityCard({ activity }) {
  const { user } = useAuth()
  const { addComment, deleteActivity } = useActivities()
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(true)
  const [imgFailed, setImgFailed] = useState(false)
  const [editing, setEditing] = useState(false)
  const [viewingImage, setViewingImage] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)

  const { weekday, day } = formatShortDay(activity.date)
  const tabColor = dayColor(activity.date)

  const isTeacher = user?.role === 'teacher' && user.id === activity.authorId
  const canComment =
    user?.role === 'teacher' ? true : user?.canComment !== false
  const comments = activity.comments || []
  const visibleComments = showAllComments
    ? comments
    : comments.slice(0, MAX_VISIBLE_COMMENTS)
  const hiddenCount = comments.length - MAX_VISIBLE_COMMENTS

  async function handleAddComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      await addComment(activity.id, { text: commentText })
      setCommentText('')
    } catch {
      setCommentText(commentText)
    }
  }

  async function handleDelete() {
    if (window.confirm('¿Eliminar esta actividad y sus comentarios?')) {
      await deleteActivity(activity.id)
    }
  }

  return (
    <article className="activity-card">
      <div className="activity-date-tab" style={{ background: tabColor }}>
        <span className="activity-date-weekday">{weekday}</span>
        <span className="activity-date-day">{day}</span>
      </div>

      <div className="activity-body">
        <div className="activity-header">
          <div>
            <p className="activity-full-date">{formatLongDate(activity.date)}</p>
            <h3 className="activity-title">{activity.title}</h3>
          </div>
          {isTeacher && (
            <div className="activity-actions">
              <button
                className="activity-edit"
                onClick={() => setEditing(true)}
                aria-label="Editar actividad"
                type="button"
              >
                <Pencil size={18} />
              </button>
              <button
                className="activity-delete"
                onClick={handleDelete}
                aria-label="Eliminar actividad"
                type="button"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        <p className="activity-description">{activity.description}</p>

        {activity.imageUrl && !imgFailed && (
          <button
            type="button"
            className="activity-image-btn"
            onClick={() => setViewingImage(true)}
            aria-label="Ampliar imagen"
          >
            <img
              src={resolveImageUrl(activity.imageUrl)}
              alt={`Imagen de la actividad: ${activity.title}`}
              className="activity-image"
              onError={() => setImgFailed(true)}
            />
            <span className="activity-image-zoom">
              <Maximize2 size={20} />
            </span>
          </button>
        )}
        {activity.imageUrl && imgFailed && (
          <div className="activity-image-fallback">
            <ImageOff size={18} />
            <span>No se pudo cargar la imagen</span>
          </div>
        )}

        <p className="activity-author">
            Publicado por 
            <Link to={`/profile/${activity.authorId}`} className="author-link">
              {activity.authorName}
            </Link>
          </p>

        <button
          type="button"
          className="activity-comments-toggle"
          onClick={() => {
            setShowComments((s) => !s)
            setShowAllComments(false)
          }}
        >
          <MessageCircle size={17} />
          {comments.length === 0
            ? 'Sé el primero en comentar'
            : `${comments.length} comentario${comments.length === 1 ? '' : 's'}`}
        </button>

        {showComments && (
          <div className="activity-comments">
            {visibleComments.length > 0 && (
              <ul className="comment-list">
                {visibleComments.map((c) => (
                  <Comment key={c.id} comment={c} />
                ))}
              </ul>
            )}

            {hiddenCount > 0 && !showAllComments && (
              <button
                type="button"
                className="comments-show-more"
                onClick={() => setShowAllComments(true)}
              >
                Mostrar {hiddenCount} comentarios más
              </button>
            )}

            {canComment ? (
              <form className="comment-form" onSubmit={handleAddComment}>
                <div className="comment-form-avatar" style={{ background: user?.avatarColor }}>
                  {user?.avatarEmoji}
                </div>
                <input
                  type="text"
                  placeholder="Escribe un comentario…"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  aria-label="Escribir comentario"
                />
                <button type="submit" aria-label="Enviar comentario" disabled={!commentText.trim()}>
                  <Send size={17} />
                </button>
              </form>
            ) : (
              <p className="comment-readonly-note">🔒 Solo lectura: tu cuenta está bloqueada para comentar.</p>
            )}
          </div>
        )}
      </div>

      {editing && (
        <EditActivityForm activity={activity} onClose={() => setEditing(false)} />
      )}

      {viewingImage && (
        <div className="image-lightbox-overlay" onClick={() => setViewingImage(false)}>
          <div className="image-lightbox" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="image-lightbox-close"
              onClick={() => setViewingImage(false)}
              aria-label="Cerrar imagen"
            >
              <Maximize2 size={22} />
            </button>
            <img
              className="image-lightbox-img"
              src={resolveImageUrl(activity.imageUrl)}
              alt={`Imagen de la actividad: ${activity.title}`}
            />
          </div>
        </div>
      )}
    </article>
  )
}
