import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/hooks/useAuth.js'
import { useRooms } from '../features/rooms/context/RoomsContext.jsx'
import { paths } from '../routes/paths.js'
import { Avatar } from '../components/ui/Avatar.jsx'
import { ConnectionDot } from '../components/ui/ConnectionDot.jsx'

export function AppLayout() {
  const navigate = useNavigate()
  const { user, logout, isLoggingOut } = useAuth()
  const { rooms, isLoadingRooms } = useRooms()

  async function handleLogout() {
    await logout()
    navigate(paths.login, { replace: true })
  }

  return (
    <main className="chat-shell">
      <aside className="sidebar">
        <div className="sidebar-top">
          <NavLink className="brand-row brand-link" to={paths.rooms}>
            <span className="logo-mark">P</span>
            <span>PulseChat</span>
          </NavLink>
          <p className="sidebar-subtitle">Group rooms for your workspace</p>
        </div>

        <nav className="room-nav" aria-label="Chat rooms">
          <NavLink className="room-nav-item room-nav-all" to={paths.rooms} end>
            <span className="room-avatar">#</span>
            <span>
              <strong>All rooms</strong>
              <small>Manage groups</small>
            </span>
          </NavLink>

          <div className="room-nav-title">
            <span>Rooms</span>
            <small>{isLoadingRooms ? 'Loading' : rooms.length}</small>
          </div>

          {rooms.map((room) => (
            <NavLink key={room.id} className="room-nav-item" to={paths.room(room.id)}>
              <span className="room-avatar">{room.name.slice(0, 1).toUpperCase()}</span>
              <span>
                <strong>{room.name}</strong>
                <small>{room.description || 'No description'}</small>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user-card">
          <Avatar name={user?.name || user?.username || 'User'} src={user?.avatarUrl} />
          <div>
            <strong>{user?.name || user?.username}</strong>
            <small>{user?.email || user?.username}</small>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Dashboard</p>
            <h2>Chat workspace</h2>
          </div>
          <div className="topbar-actions">
            <ConnectionDot status="online" label="Session active" />
            <button className="button button-soft" type="button" onClick={handleLogout} disabled={isLoggingOut}>
              {isLoggingOut ? 'Signing out...' : 'Logout'}
            </button>
          </div>
        </header>
        <Outlet />
      </section>
    </main>
  )
}
