import { useRef } from 'react'

export default function PostForm({ value, onChange, onSubmit, disabled, placeholder }) {
  const textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim()) {
        onSubmit(value.trim())
      }
    }
  }

  return (
    <form className="post-form" onSubmit={handleSubmit}>
      <div className="post-form-header">
        <span className="post-form-placeholder">{placeholder}</span>
        <span className="post-form-limit">{value.length}/2000</span>
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        rows={3}
        maxLength={2000}
        placeholder={placeholder}
      />
      <div className="post-form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={disabled || !value.trim()}
        >
          Publicar
        </button>
      </div>
    </form>
  )
}