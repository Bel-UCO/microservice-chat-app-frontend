import { Navigate, Outlet } from 'react-router-dom'
import { FullPageLoader } from '../components/ui/FullPageLoader.jsx'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { paths } from './paths.js'

export function GuestRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return <FullPageLoader label="Loading" />
  }

  if (isAuthenticated) {
    return <Navigate to={paths.rooms} replace />
  }

  return <Outlet />
}
