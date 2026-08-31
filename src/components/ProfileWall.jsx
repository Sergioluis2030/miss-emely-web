import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import PostForm from './PostForm'
import PostItem from './PostItem'

export default function ProfileWall({ profile, isOwn, currentUser }) {
  const { posts, addPost, removePost, loading } = useProfile()
  const [newPostContent, setNewPostContent] = useState('')

  const handleSubmitPost = async (content) => {
    await addPost(content)
    setNewPostContent('')
  }

  const handleDeletePost = async (postId) => {
    if (window.confirm('¿Eliminar este post?')) {
      await removePost(postId)
    }
  }

  return (
    <section className="profile-wall">
      <div className="wall-header">
        <h2>Muro de {profile.full_name}</h2>
      </div>

      {isOwn && (
        <PostForm
          value={newPostContent}
          onChange={setNewPostContent}
          onSubmit={handleSubmitPost}
          disabled={loading}
          placeholder="¿Qué quieres compartir hoy?"
        />
      )}

      <div className="posts-list">
        {posts.length === 0 ? (
          <div className="posts-empty">
            {isOwn
              ? 'Tu muro está vacío. ¡Escribe tu primer post!'
              : `${profile.full_name} aún no ha escrito nada en su muro.`}
          </div>
        ) : (
          posts.map(post => (
            <PostItem
              key={post.id}
              post={post}
              currentUser={currentUser}
              onDelete={handleDeletePost}
            />
          ))
        )}
      </div>
    </section>
  )
}