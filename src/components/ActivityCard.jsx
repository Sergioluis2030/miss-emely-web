import { useState } from 'react'
import { MessageCircle, Send, Trash2, ImageOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useActivities } from '../context/ActivitiesContext'
import { formatShortDay, formatLongDate, dayColor } from '../utils/date'
import Comment from './Comment'

export default function ActivityCard({ activity }) {
  const { user } = useAuth()
  const { addComment, deleteActivity } = useActivities()
  const [commentText, setCommentText] = useState('')
  const [showComments, setShowComments] = useState(true)
  const [imgFailed, setImgFailed] = useState(false)

  const { weekday, day } = formatShortDay(activity.date)
  const tabColor = dayColor(activity.date)

  function handleAddComment(e) {
    e.preventDefault()
    if (!commentText.trim()) return
    addComment(activity.id, { text: commentText, author: user })
    setCommentText('')
  }

  function handleDelete() {
    if (window.confirm('¿Eliminar esta actividad y sus comentarios?')) {
      deleteActivity(activity.id)
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
          {user?.role === 'teacher' && user.id === activity.authorId && (
            <button
              className="activity-delete"
              onClick={handleDelete}
              aria-label="Eliminar actividad"
              type="button"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <p className="activity-description">{activity.description}</p>

        {activity.imageUrl && !imgFailed && (
          <img
            src={activity.imageUrl}
            alt={`Imagen de la actividad: ${activity.title}`}
            className="activity-image"
            onError={() => setImgFailed(true)}
          />
        )}
        {activity.imageUrl && imgFailed && (
          <div className="activity-image-fallback">
            <ImageOff size={18} />
            <span>No se pudo cargar la imagen</span>
          </div>
        )}

        <p className="activity-author">Publicado por {activity.authorName}</p>

        <button
          type="button"
          className="activity-comments-toggle"
          onClick={() => setShowComments((s) => !s)}
        >
          <MessageCircle size={17} />
          {activity.comments.length === 0
            ? 'Sé el primero en comentar'
            : `${activity.comments.length} comentario${activity.comments.length === 1 ? '' : 's'}`}
        </button>

        {showComments && (
          <div className="activity-comments">
            {activity.comments.length > 0 && (
              <ul className="comment-list">
                {activity.comments.map((c) => (
                  <Comment key={c.id} comment={c} />
                ))}
              </ul>
            )}

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
          </div>
        )}
      </div>
    </article>
  )
}
