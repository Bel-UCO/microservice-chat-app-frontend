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
          <p className="eyebrow">MQTT group messaging</p>
          <h1>Real-time chat rooms for teams, classes, and operations.</h1>
          <p>
            Frontend first architecture with real API authentication, protected
            routes, HTTP utilities, and EMQX WebSocket messaging.
          </p>
        </div>
        <div className="hero-stats">
          <div>
            <strong>EMQX</strong>
            <span>MQTT broker</span>
          </div>
          <div>
            <strong>HTTP</strong>
            <span>auth and room API</span>
          </div>
          <div>
            <strong>React</strong>
            <span>route based UI</span>
          </div>
        </div>
      </section>
      <section className="auth-panel" aria-label="Authentication form">
        <Outlet />
      </section>
    </main>
  )
}
