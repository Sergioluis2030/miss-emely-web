import { formatRelativeTime } from '../utils/date'

const ROLE_EMOJI = { teacher: '👩‍🏫', student: '🙋' }

export default function Comment({ comment }) {
  return (
    <li className="comment">
      <div className="comment-avatar" aria-hidden="true">
        {ROLE_EMOJI[comment.authorRole] || '🙂'}
      </div>
      <div className="comment-body">
        <p className="comment-meta">
          <span className="comment-author">{comment.authorName}</span>
          <span className="comment-time">{formatRelativeTime(comment.createdAt)}</span>
        </p>
        <p className="comment-text">{comment.text}</p>
      </div>
    </li>
  )
}
