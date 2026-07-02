import { http } from '../../../services/http.js'

function unwrapPayload(response) {
  return response?.data || response
}

function normalizeAuthResponse(response) {
  const payload = unwrapPayload(response)

  return {
    accessToken: payload.accessToken || payload.token,
    refreshToken: payload.refreshToken || null,
    user: normalizeUser(payload.user),
  }
}

function normalizeUser(user) {
  if (!user) return null

  return {
    id: String(user.id),
    name: user.name || user.displayName || user.fullName || user.username || 'User',
    username: user.username || user.email || String(user.id),
    email: user.email || '',
    role: user.role || 'user',
    avatarUrl: user.avatarUrl || user.avatar_url || '',
  }
}

function assertSession(session, action) {
  if (!session.accessToken || !session.user) {
    throw new Error(`${action} response is incomplete. Please check the auth service response.`)
  }

  return session
}

export const authApi = {
  async register(payload) {
    const response = await http.post('/auth/register', payload, { api: 'auth' })
    return assertSession(normalizeAuthResponse(response), 'Register')
  },

  async login(credentials) {
    const response = await http.post('/auth/login', credentials, { api: 'auth' })
    return assertSession(normalizeAuthResponse(response), 'Login')
  },

  async me() {
    const response = await http.get('/auth/me', { api: 'auth' })
    const payload = unwrapPayload(response)
    return normalizeUser(payload.user || payload)
  },

  async logout() {
    return null
  },
}
