import { http } from '../../../services/http.js'

function normalizeRoom(room) {
  return {
    id: String(room.id),
    name: room.name,
    description: room.description || '',
    memberCount: room.memberCount || room.member_count || 0,
    lastMessageAt: room.lastMessageAt || room.last_message_at || null,
    createdAt: room.createdAt || room.created_at || null,
  }
}

function normalizeRoomsResponse(response) {
  const payload = response?.data || response
  const rooms = Array.isArray(payload) ? payload : payload.rooms || []
  return rooms.map(normalizeRoom)
}

export const roomApi = {
  async listRooms() {
    const response = await http.get('/rooms')
    return normalizeRoomsResponse(response)
  },

  async createRoom(payload) {
    const response = await http.post('/rooms', payload)
    return normalizeRoom(response?.data || response?.room || response)
  },

  async updateRoom(roomId, payload) {
    const response = await http.put(`/rooms/${roomId}`, payload)
    return normalizeRoom(response?.data || response?.room || response)
  },

  async deleteRoom(roomId) {
    await http.delete(`/rooms/${roomId}`)
    return true
  },
}
