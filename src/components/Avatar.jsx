export default function Avatar({ emoji, color = '#4A90E2', size = 44 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.52,
        flexShrink: 0,
        boxShadow: '0 3px 0 rgba(0,0,0,0.08)',
        border: '3px solid white',
      }}
      aria-hidden="true"
    >
      {emoji}
    </div>
  )
}
