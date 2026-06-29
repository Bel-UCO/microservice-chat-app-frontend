import { Link } from 'react-router-dom'
import { paths } from './paths.js'

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <span className="logo-mark">P</span>
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The page you opened does not exist or has been moved.</p>
        <Link className="button button-primary" to={paths.rooms}>
          Back to chat rooms
        </Link>
      </section>
    </main>
  )
}
