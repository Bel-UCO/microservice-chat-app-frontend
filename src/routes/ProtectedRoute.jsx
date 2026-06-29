import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { FullPageLoader } from '../components/ui/FullPageLoader.jsx'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { paths } from './paths.js'

export function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return <FullPageLoader label="Checking your session" />
  }

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
