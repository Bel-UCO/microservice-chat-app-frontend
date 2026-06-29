import { http } from '../../../services/http.js'

function normalizeAuthResponse(response) {
  const payload = response?.data || response

  return {
    accessToken: payload.accessToken || payload.token,
    refreshToken: payload.refreshToken || null,
    user: normalizeUser(payload.user),
  }
}

function normalizeUser(user) {
  if (!user) return null

  return {
    id: user.id,
    name: user.name || user.displayName || user.fullName || user.username || 'User',
    username: user.username || user.email || user.id,
    email: user.email || '',
    avatarUrl: user.avatarUrl || user.avatar_url || '',
  }
}

export const authApi = {
  async login(credentials) {
    const response = await http.post('/auth/login', credentials)
    const session = normalizeAuthResponse(response)

    if (!session.accessToken || !session.user) {
      throw new Error('Login response must contain accessToken and user.')
    }

    return session
  },

  async me() {
    const response = await http.get('/auth/me')
    const payload = response?.data || response
    return normalizeUser(payload.user || payload)
  },

  async logout() {
    return http.post('/auth/logout', {})
  },
}
