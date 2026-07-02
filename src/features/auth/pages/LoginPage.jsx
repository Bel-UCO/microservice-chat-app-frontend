import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { paths } from '../../../routes/paths.js'

const initialForm = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isLoggingIn } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Email and password are required.')
      return
    }

    try {
      await login({ email: form.email.trim(), password: form.password })
      navigate(location.state?.from || paths.rooms, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to login. Please check your credentials.')
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <p className="eyebrow">Welcome back</p>
        <h2>Login to your workspace</h2>
        <p>Continue your group conversations securely with your account.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <label className="field-group">
        <span>Email</span>
        <input
          autoComplete="email"
          name="email"
          onChange={handleChange}
          placeholder="belinda@example.com"
          type="email"
          value={form.email}
        />
      </label>

      <label className="field-group">
        <span>Password</span>
        <input
          autoComplete="current-password"
          name="password"
          onChange={handleChange}
          placeholder="Enter password"
          type="password"
          value={form.password}
        />
      </label>

      <button className="button button-primary button-full" type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? 'Signing in...' : 'Sign in'}
      </button>

      <p className="auth-switch">
        New here? <Link to={paths.register}>Create an account</Link>
      </p>
    </form>
  )
}
