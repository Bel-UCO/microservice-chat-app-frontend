import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { paths } from '../../../routes/paths.js'

const initialForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, isRegistering } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const name = form.name.trim()
    const email = form.email.trim()

    if (!name || !email || !form.password || !form.confirmPassword) {
      setError('Please complete all fields.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Password confirmation does not match.')
      return
    }

    try {
      await register({ name, email, password: form.password })
      navigate(paths.rooms, { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.')
    }
  }

  return (
    <form className="login-card" onSubmit={handleSubmit}>
      <div className="form-heading">
        <p className="eyebrow">Create account</p>
        <h2>Start a new chat workspace</h2>
        <p>Register once, then enter group rooms and join real-time conversations.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <label className="field-group">
        <span>Name</span>
        <input
          autoComplete="name"
          name="name"
          onChange={handleChange}
          placeholder="Your display name"
          type="text"
          value={form.name}
        />
      </label>

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
          autoComplete="new-password"
          name="password"
          onChange={handleChange}
          placeholder="Minimum 6 characters"
          type="password"
          value={form.password}
        />
      </label>

      <label className="field-group">
        <span>Confirm password</span>
        <input
          autoComplete="new-password"
          name="confirmPassword"
          onChange={handleChange}
          placeholder="Repeat password"
          type="password"
          value={form.confirmPassword}
        />
      </label>

      <button className="button button-primary button-full" type="submit" disabled={isRegistering}>
        {isRegistering ? 'Creating account...' : 'Create account'}
      </button>

      <p className="auth-switch">
        Already have an account? <Link to={paths.login}>Sign in</Link>
      </p>
    </form>
  )
}
