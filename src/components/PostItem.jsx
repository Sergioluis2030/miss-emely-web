import { resolveImageUrl } from '../utils/api'
import { formatRelativeTime } from '../utils/date'

export default function PostItem({ post, currentUser, onDelete }) {
  const isOwn = post.isOwn && currentUser && currentUser.id === post.authorId
  const authorImageUrl = resolveImageUrl(post.authorProfileImageUrl)

  return (
    <article className="post-item">
      <div className="post-header">
        <div className="post-author">
          {authorImageUrl ? (
            <img src={authorImageUrl} alt={post.authorName} className="post-avatar" />
          ) : (
            <div className="post-avatar-placeholder" style={{ background: post.authorColor }}>
              {post.authorEmoji}
            </div>
          )}
          <div className="post-author-info">
            <strong>{post.authorName}</strong>
            <time className="post-time">{formatRelativeTime(post.createdAt)}</time>
          </div>
        </div>
        {isOwn && (
          <button
            className="post-delete"
            onClick={() => onDelete(post.id)}
            aria-label="Eliminar post"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
      </div>
      <div className="post-content">
        <p>{post.content}</p>
      </div>
    </article>
  )
}