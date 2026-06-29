export function formatMessageTime(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

export function formatRoomDate(value) {
  if (!value) return 'No activity yet'

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}
