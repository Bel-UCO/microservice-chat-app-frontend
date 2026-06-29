export function ConnectionDot({ status = 'idle', label }) {
  const normalized = status === 'connected' ? 'online' : status

  return (
    <span className={`connection-dot connection-${normalized}`}>
      <span aria-hidden="true" />
      {label || status}
    </span>
  )
}
