import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../utils/date'

const ROLE_EMOJI = { teacher: '👩‍🏫', student: '🙋' }

export default function Comment({ comment }) {
  return (
    <li className="comment">
      <Link to={`/profile/${comment.authorId}`} className="comment-avatar-link" aria-label={`Ver perfil de ${comment.authorName}`}>
        <div className="comment-avatar" aria-hidden="true">
          {ROLE_EMOJI[comment.authorRole] || '🙂'}
        </div>
      </Link>
      <div className="comment-body">
        <p className="comment-meta">
          <Link to={`/profile/${comment.authorId}`} className="comment-author">
            {comment.authorName}
          </Link>
          <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
        </p>
        <p className="comment-text">{comment.text}</p>
      </div>
    </li>
  )
}
