import { http } from '../../../services/http.js'

function normalizeMessage(message) {
  return {
    id: String(message.id),
    roomId: String(message.roomId || message.room_id),
    type: message.type || 'text',
    content: message.content || message.body || message.message || '',
    createdAt: message.createdAt || message.created_at || new Date().toISOString(),
    sender: {
      id: String(message.sender?.id || message.senderId || message.sender_id || ''),
      name: message.sender?.name || message.senderName || message.sender_name || 'Unknown',
      username: message.sender?.username || message.senderUsername || message.sender_username || '',
      email: message.sender?.email || message.senderEmail || message.sender_email || '',
      avatarUrl: message.sender?.avatarUrl || message.sender?.avatar_url || '',
    },
  }
}

function normalizeMessagesResponse(response) {
  const payload = response?.data || response
  const messages = Array.isArray(payload) ? payload : payload.messages || []
  return messages.map(normalizeMessage)
}

function normalizeMessageResponse(response) {
  const payload = response?.data || response
  return normalizeMessage(payload.message || payload)
}

export const messageApi = {
  async listMessages(roomId) {
    const response = await http.get(`/rooms/${roomId}/messages`)
    return normalizeMessagesResponse(response)
  },

  async sendMessage(roomId, content) {
    const response = await http.post(`/rooms/${roomId}/messages`, {
      content,
      type: 'text',
    })
    return normalizeMessageResponse(response)
  },
}
