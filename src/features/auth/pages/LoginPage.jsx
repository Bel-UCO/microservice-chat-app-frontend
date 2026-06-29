import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { paths } from '../../../routes/paths.js'

const initialForm = {
  username: '',
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

    if (!form.username.trim() || !form.password) {
      setError('Username and password are required.')
      return
    }

    try {
      await login({ username: form.username.trim(), password: form.password })
      navigate(location.state?.from || paths.rooms, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to login. Please check your credentials.')
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <p className="eyebrow">Welcome back</p>
        <h2>Login to your chat workspace</h2>
        <p>Use your backend account. This frontend will call <code>/auth/login</code>.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <label className="field-group">
        <span>Username or email</span>
        <input
          autoComplete="username"
          name="username"
          onChange={handleChange}
          placeholder="example: belinda"
          type="text"
          value={form.username}
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
    </form>
  )
}
