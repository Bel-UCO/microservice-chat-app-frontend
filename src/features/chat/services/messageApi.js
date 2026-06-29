import { http } from '../../../services/http.js'

function normalizeMessage(message) {
  return {
    id: String(message.id),
    roomId: String(message.roomId || message.room_id),
    type: message.type || 'text',
    content: message.content || message.message || '',
    createdAt: message.createdAt || message.created_at || new Date().toISOString(),
    sender: {
      id: message.sender?.id || message.senderId || message.sender_id,
      name: message.sender?.name || message.senderName || message.sender_name || 'Unknown',
      username: message.sender?.username || message.senderUsername || message.sender_username || '',
      avatarUrl: message.sender?.avatarUrl || message.sender?.avatar_url || '',
    },
  }
}

function normalizeMessagesResponse(response) {
  const payload = response?.data || response
  const messages = Array.isArray(payload) ? payload : payload.messages || []
  return messages.map(normalizeMessage)
}

export const messageApi = {
  async listMessages(roomId) {
    const response = await http.get(`/rooms/${roomId}/messages`)
    return normalizeMessagesResponse(response)
  },
}
