import { Outlet } from 'react-router-dom'
import { env } from '../config/env.js'

export function AuthLayout() {
  return (
    <main className="auth-page">
      <section className="auth-hero" aria-label="Application introduction">
        <div className="brand-row">
          <span className="logo-mark">P</span>
          <span>{env.appName}</span>
        </div>
        <div className="hero-copy">
          <p className="eyebrow">Group messaging</p>
          <h1>Fast, focused conversations for every team room.</h1>
          <p>
            Create rooms, invite your team, and keep every conversation organized
            in a simple real-time workspace.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>Secure</strong>
            <span>account based access</span>
          </div>
          <div>
            <strong>Groups</strong>
            <span>room based chats</span>
          </div>
          <div>
            <strong>Live</strong>
            <span>real-time delivery</span>
          </div>
        </div>
      </section>
      <section className="auth-panel" aria-label="Authentication form">
        <Outlet />
      </section>
    </main>
  )
}
