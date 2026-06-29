export function Avatar({ name = 'User', src, size = 'md' }) {
  const initial = name.trim().slice(0, 1).toUpperCase() || 'U'

  return (
    <span className={`avatar avatar-${size}`} aria-label={name}>
      {src ? <img src={src} alt="" /> : initial}
    </span>
  )
}
