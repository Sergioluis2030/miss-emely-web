import { createContext, useContext, useState, useCallback } from 'react'
import { getProfile, updateProfile, getPosts, createPost, deletePost } from '../utils/api'

const ProfileContext = createContext(null)

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadProfile = useCallback(async (userId) => {
    setLoading(true)
    setError('')
    try {
      const data = await getProfile(userId)
      setProfile(data.profile)
      setPosts(data.profile.posts || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    if (profile) await loadProfile(profile.id)
  }, [profile, loadProfile])

  const updateProfileData = useCallback(async ({ bio, preferences, image }) => {
    setLoading(true)
    setError('')
    try {
      const data = await updateProfile({ bio, preferences, image })
      setProfile(data.profile)
      setPosts(data.profile.posts || [])
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const loadPosts = useCallback(async (userId) => {
    try {
      const data = await getPosts(userId)
      setPosts(data.posts)
    } catch (err) {
      setError(err.message)
    }
  }, [])

  const addPost = useCallback(async (content) => {
    setError('')
    try {
      const data = await createPost(content)
      setPosts(prev => [data.post, ...prev])
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const removePost = useCallback(async (postId) => {
    setError('')
    try {
      await deletePost(postId)
      setPosts(prev => prev.filter(p => p.id !== postId))
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  const clearError = useCallback(() => setError(''), [])

  return (
    <ProfileContext.Provider
      value={{
        profile,
        posts,
        loading,
        error,
        loadProfile,
        refreshProfile,
        updateProfile: updateProfileData,
        loadPosts,
        addPost,
        removePost,
        clearError
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile debe usarse dentro de <ProfileProvider>')
  return ctx
}