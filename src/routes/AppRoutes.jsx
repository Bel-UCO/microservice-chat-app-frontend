import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../layouts/AppLayout.jsx'
import { AuthLayout } from '../layouts/AuthLayout.jsx'
import { ProtectedRoute } from './ProtectedRoute.jsx'
import { GuestRoute } from './GuestRoute.jsx'
import { paths } from './paths.js'
import LoginPage from '../features/auth/pages/LoginPage.jsx'
import RegisterPage from '../features/auth/pages/RegisterPage.jsx'
import RoomsPage from '../features/rooms/pages/RoomsPage.jsx'
import ChatRoomPage from '../features/chat/pages/ChatRoomPage.jsx'
import NotFoundPage from '../routes/NotFoundPage.jsx'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path={paths.login} element={<LoginPage />} />
          <Route path={paths.register} element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to={paths.rooms} replace />} />
          <Route path={paths.rooms} element={<RoomsPage />} />
          <Route path={paths.room()} element={<ChatRoomPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
