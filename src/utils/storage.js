const AUTH_KEY = 'pulsechat.auth'

export function saveAuthSession(session) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

export function readAuthSession() {
  const rawSession = localStorage.getItem(AUTH_KEY)
  if (!rawSession) return null

  try {
    return JSON.parse(rawSession)
  } catch {
    clearAuthSession()
    return null
  }
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEY)
}

export function readAuthToken() {
  return readAuthSession()?.accessToken || null
}
