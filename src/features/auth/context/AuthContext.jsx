import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../services/authApi.js'
import { clearAuthSession, readAuthSession, saveAuthSession } from '../../../utils/storage.js'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => readAuthSession())
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function bootstrap() {
      const storedSession = readAuthSession()

      if (!storedSession?.accessToken) {
        if (isMounted) setIsBootstrapping(false)
        return
      }

      try {
        const user = await authApi.me()
        const nextSession = { ...storedSession, user }
        saveAuthSession(nextSession)
        if (isMounted) setSession(nextSession)
      } catch {
        clearAuthSession()
        if (isMounted) setSession(null)
      } finally {
        if (isMounted) setIsBootstrapping(false)
      }
    }

    bootstrap()

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async (credentials) => {
    setIsLoggingIn(true)
    try {
      const nextSession = await authApi.login(credentials)
      saveAuthSession(nextSession)
      setSession(nextSession)
      return nextSession
    } finally {
      setIsLoggingIn(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setIsLoggingOut(true)
    try {
      await authApi.logout().catch(() => null)
    } finally {
      clearAuthSession()
      setSession(null)
      setIsLoggingOut(false)
    }
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      accessToken: session?.accessToken || null,
      isAuthenticated: Boolean(session?.accessToken),
      isBootstrapping,
      isLoggingIn,
      isLoggingOut,
      login,
      logout,
    }),
    [session, isBootstrapping, isLoggingIn, isLoggingOut, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
