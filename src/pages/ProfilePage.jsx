import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProfile } from '../context/ProfileContext'
import ProfileHeader from '../components/ProfileHeader'
import ProfileWall from '../components/ProfileWall'

export default function ProfilePage({ profileId }) {
  const { user } = useAuth()
  const { profile, loading, error, loadProfile, refreshProfile } = useProfile()

  const targetId = Number(profileId)
  const isOwnProfile = user && user.id === targetId

  useEffect(() => {
    if (targetId) loadProfile(targetId)
  }, [loadProfile, targetId])

  if (loading) {
    return (
      <div className="profile-page loading">
        <div className="spinner" />
        <p>Cargando perfil...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-page error">
        <p>Error: {error}</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="profile-page error">
        <p>Usuario no encontrado.</p>
      </div>
    )
  }

  return (
    <div className="profile-page">
      <ProfileHeader
        profile={profile}
        isOwn={isOwnProfile}
        onRefresh={refreshProfile}
      />
      <ProfileWall
        profile={profile}
        isOwn={isOwnProfile}
        currentUser={user}
      />
    </div>
  )
}