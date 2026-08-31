import { useState } from 'react'
import { useProfile } from '../context/ProfileContext'
import { resolveImageUrl } from '../utils/api'
import { formatLongDate } from '../utils/date'
import EditProfileModal from './EditProfileModal'

export default function ProfileHeader({ profile, isOwn, onRefresh }) {
  const { updateProfile } = useProfile()
  const [showEditModal, setShowEditModal] = useState(false)
  const [error, setError] = useState('')

  const profileImageUrl = resolveImageUrl(profile.profileImageUrl)

  const handleEditSubmit = async (data) => {
    try {
      await updateProfile(data)
      setShowEditModal(false)
      onRefresh()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <header className="profile-header">
      <div className="profile-cover" />
      <div className="profile-info">
        <div className="profile-avatar-wrapper">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt={`${profile.full_name}`}
              className="profile-avatar"
            />
          ) : (
            <div
              className="profile-avatar-placeholder"
              style={{ background: profile.avatar_color }}
            >
              {profile.avatar_emoji}
            </div>
          )}
          {isOwn && (
            <button
              className="profile-avatar-edit"
              onClick={() => setShowEditModal(true)}
              aria-label="Cambiar foto de perfil"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
          )}
        </div>

        <div className="profile-main-info">
          <h1 className="profile-name">{profile.full_name}</h1>
          <div className="profile-meta">
            <span className="profile-role">{profile.role === 'teacher' ? '👩‍🏫 Maestra' : '👨‍🎓 Alumno'}</span>
            {profile.kinship && profile.kinship !== 'alumno' && (
              <span className="profile-kinship">({profile.kinship})</span>
            )}
            <span className="profile-joined">
              Miembro desde {formatLongDate(profile.created_at)}
            </span>
          </div>

          {profile.bio && (
            <div className="profile-bio">
              <p>{profile.bio}</p>
            </div>
          )}

          {isOwn && !profile.bio && (
            <p className="profile-empty-bio">Aún no has escrito tu descripción. ¡Edita tu perfil para contarnos sobre ti!</p>
          )}
        </div>

        {isOwn && (
          <div className="profile-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowEditModal(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Editar perfil
            </button>
          </div>
        )}
      </div>

      {showEditModal && (
        <EditProfileModal
          profile={profile}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditSubmit}
          error={error}
        />
      )}
    </header>
  )
}