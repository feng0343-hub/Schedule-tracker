
import { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        setMessage(
          data.session
            ? 'Account created successfully.'
            : 'Account created. Check your email to confirm your account.'
        )
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        setMessage('Signed in successfully.')
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{isSignUp ? 'Create your account' : 'Sign in to Schedule Tracker'}</h2>

        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          minLength={6}
          required
        />

        <button type="submit" disabled={loading}>
          {loading
            ? 'Please wait...'
            : isSignUp
              ? 'Create account'
              : 'Sign in'}
        </button>

        <p role="status">{message}</p>

        <button
          type="button"
          className="auth-switch"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setMessage('')
          }}
        >
          {isSignUp
            ? 'Already have an account? Sign in'
            : 'New here? Create an account'}
        </button>
      </form>
    </div>
  )
}
