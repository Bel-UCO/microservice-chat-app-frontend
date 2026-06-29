import { AuthProvider } from '../features/auth/context/AuthContext.jsx'
import { RoomsProvider } from '../features/rooms/context/RoomsContext.jsx'
import { AppRoutes } from '../routes/AppRoutes.jsx'

function App() {
  return (
    <AuthProvider>
      <RoomsProvider>
        <AppRoutes />
      </RoomsProvider>
    </AuthProvider>
  )
}

export default App
