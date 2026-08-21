import React from 'react'

function Login({ setScreen, setRole }) {
    const [identifier, setIdentifier] = React.useState('')

  return (
    <main className="page form-page">
      <button className="back" onClick={() => setScreen('customer')}>
        ←
      </button>

      <p className="eyebrow">WELCOME BACK</p>
      <h1>Log in to Zanaab</h1>

      <form>
        <label>
          Phone or email
          <input
  placeholder="Phone or email"
  autoComplete="username"
  type="text"
  value={identifier}
  onChange={(event) => {
    let value = event.target.value

    // If entering a phone number, allow only digits
    // and stop at 10 digits.
   if (/^\d/.test(value)) {
      value = value.replace(/\D/g, '').slice(0, 10)
    } else {
      value = value.replace(/\s/g, '')
    }

    setIdentifier(value)
  }}
/>
        </label>

        <label>
          Password
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
          />
        </label>

        <button className="primary full" type="submit">
          Log in <span>→</span>
        </button>
      </form>

      <p className="login-prompt">
        Don't have an account?{' '}
        <button type="button" onClick={() => setScreen('signup')}>
          Sign up
        </button>
      </p>
    </main>
  )
}

export default Login