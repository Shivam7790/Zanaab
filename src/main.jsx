import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import './signup.css'

const services = [
  { icon: '⚡', name: 'Electrician', desc: 'Wiring, fans & switches' },
  { icon: '🔧', name: 'Plumber', desc: 'Leaks, fittings & drains' },
  { icon: '🪚', name: 'Carpenter', desc: 'Furniture & repairs' },
  { icon: '💻', name: 'Laptop repair', desc: 'Home visit support' },
  { icon: '📺', name: 'TV repair', desc: 'Setup & servicing' },
  { icon: '⌂', name: 'Home automation', desc: 'Smart home help' },
]

const addresses = [
  {
    id: 'sector-70',
    label: 'Home',
    address: 'Sector 70, Mohali, Punjab',
  },
  {
    id: 'phase-8',
    label: 'Office',
    address: 'Phase 8, Industrial Area, Mohali, Punjab',
  },
  {
    id: 'sector-68',
    label: 'Parent’s Home',
    address: 'Sector 68, Mohali, Punjab',
  },
  {
    id: 'phase-5',
    label: 'Customer Home',
    address: 'Phase 5, Mohali, Punjab',
  },
  {
    id: 'sector-67',
    label: 'Other',
    address: 'Sector 67, Mohali, Punjab',
  },
]

function Status({ children, tone = 'green' }) {
  return <span className={`status ${tone}`}>{children}</span>
}

const createSignupDraft = () => ({ fullName: '', phone: '', email: '', password: '', services: [], terms: false })

function CustomerHome({ setScreen }) {
  return <main className="page">
    <section className="hero">
      <p className="eyebrow">GOOD MORNING, SHIVAM</p>
      <h1>What can we help<br />you fix today?</h1>
      <button className="location">⌖ &nbsp; Mohali, Punjab <span>⌄</span></button>
    </section>
    <section className="section service-section">
      <div className="section-title"><h2>Choose a service</h2><button>View all</button></div>
      <div className="service-grid">
        {services.map((service) => <button className="service-card" onClick={() => setScreen('request')} key={service.name}>
          <span className="service-icon">{service.icon}</span><strong>{service.name}</strong><small>{service.desc}</small>
        </button>)}
      </div>
    </section>
    <section className="section">
      <div className="section-title"><h2>Current request</h2><button onClick={() => setScreen('tracking')}>View</button></div>
      <button className="job-card" onClick={() => setScreen('tracking')}>
        <span className="job-icon">⚡</span><span><Status>Worker on the way</Status><strong>Ceiling fan installation</strong><small>Today · 4:30 PM</small></span><span className="arrow">›</span>
      </button>
    </section>
  </main>
}

function RequestJob({ setScreen, selectedAddress, setSelectedAddress }) {
  return <main className="page form-page">
    <button className="back" onClick={() => setScreen('customer')}>←</button>

    <p className="eyebrow">NEW SERVICE REQUEST</p>
    <h1>Tell us what you need</h1>

    <label>
      Service
      <select defaultValue="Electrician">
        <option>Electrician</option>
        <option>Plumber</option>
        <option>Carpenter</option>
        <option>Laptop repair</option>
      </select>
    </label>

    <label>
      Describe the issue
      <textarea defaultValue="Ceiling fan needs installation in the bedroom." />
    </label>

    <label>
      When do you need help?
      <select defaultValue="As soon as possible">
        <option>As soon as possible</option>
        <option>Today evening</option>
        <option>Tomorrow</option>
      </select>
    </label>

    <label>
      Service location
      <select
        value={selectedAddress.id}
        onChange={(event) => {
          const address = addresses.find(
            (item) => item.id === event.target.value
          )
          setSelectedAddress(address)
        }}
      >
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>
            {address.label} — {address.address}
          </option>
        ))}
      </select>
    </label>

    <div className="address">
      <span>⌖</span>
      <div>
        <strong>{selectedAddress.label}</strong>
        <small>{selectedAddress.address}</small>
      </div>
    </div>

    <div className="estimate">
      <span>Estimated visit charge</span>
      <strong>₹149–₹249</strong>
      <small>
        Final price is agreed with your worker before work begins.
      </small>
    </div>

    <button
      className="primary full"
      onClick={() => setScreen('matching')}
    >
      Find a worker <span>→</span>
    </button>
  </main>
}


  function Matching({ setScreen, selectedAddress }) {
  return <main className="page center-page">
    <div className="radar"><i></i><span>⚡</span></div>

    <Status tone="blue">REQUEST SENT</Status>

    <h1>Finding your<br />electrician</h1>

    <p>
      We’ve notified 10 verified electricians nearby.
      The first worker to accept gets the job.
    </p>

    <div className="address">
      <span>⌖</span>
      <div>
        <strong>Service location</strong>
        <small>{selectedAddress.address}</small>
      </div>
    </div>

    <div className="mini-workers">
      <span>RS</span>
      <span>AM</span>
      <span>VK</span>
      <span>+7</span>
    </div>

    <button
      className="text-button"
      onClick={() => setScreen('tracking')}
    >
      Preview assigned task
    </button>
  </main>
}

function Tracking({ setScreen, selectedAddress }) {
  return <main className="page">
    <button className="back" onClick={() => setScreen('customer')}>←</button>
    <p className="eyebrow">YOUR SERVICE REQUEST</p><h1>Worker is on the way</h1>
    <div className="map"><div className="route"></div><div className="pin home-pin">⌂</div><div className="pin worker-pin">🛵</div><span className="map-note">Arriving in 12 min</span></div>
    <section className="worker-summary"><div className="avatar">RK</div><div><Status>VERIFIED ELECTRICIAN</Status><h2>Rahul Kumar</h2><p>★ 4.9 &nbsp; · &nbsp; 326 jobs completed</p></div><button className="call">☎</button></section>
   <section className="detail-box">
  <span>Service</span>
  <strong>Ceiling fan installation</strong>

  <span>Service location</span>
  <strong>{selectedAddress.address}</strong>

  <span>Appointment</span>
  <strong>Today, 4:30 PM</strong>
</section>
    <p className="fine-note">If you cancel after Rahul checks in at your location, a ₹100 cancellation charge applies.</p>
    <button className="outline full">Need help?</button>
  </main>
}

function WorkerHome({ setScreen }) {
  return <main className="page worker-page">
    <div className="worker-header"><div><p className="eyebrow">GOOD MORNING</p><h1>Rahul 👋</h1></div><button className="online"><i></i> Online</button></div>
    <section className="earnings"><span>This week</span><h2>₹4,280</h2><p>8 jobs completed <button onClick={() => setScreen('wallet')}>View wallet →</button></p></section>
    <section className="active-task"><div className="section-title"><h2>Active task</h2><Status>ON THE WAY</Status></div><div className="task-main"><span>⚡</span><div><strong>Ceiling fan installation</strong><p>Shivam · 1.8 km away</p></div></div><button className="primary full" onClick={() => setScreen('job')}>Open task <span>→</span></button></section>
    <section className="section"><div className="section-title"><h2>Today’s activity</h2><button>View all</button></div><div className="activity"><span>✓</span><div><strong>Kitchen tap repair</strong><small>Completed · ₹480 earned</small></div><b>₹480</b></div><div className="activity"><span>✓</span><div><strong>Switch board repair</strong><small>Completed · ₹320 earned</small></div><b>₹320</b></div></section>
  </main>
}

function WorkerJob({ setScreen, selectedAddress }) {
  return <main className="page">
    <button className="back" onClick={() => setScreen('worker')}>←</button><p className="eyebrow">TASK #TN-18432</p><h1>Ceiling fan<br />installation</h1>
    <div className="map small-map"><div className="route"></div><div className="pin home-pin">⌂</div><div className="pin worker-pin">🛵</div></div>
    <section className="customer-card"><div className="avatar purple">SK</div><div><strong>Shivam Kumar</strong><small>{selectedAddress.address}</small></div><button className="call">☎</button></section>
    <div className="timer"><span>Travel time</span><strong>00:08:42</strong><Status tone="blue">LOCATION SHARING ON</Status></div>
    <button className="primary full" onClick={() => setScreen('arrived')}>I have arrived <span>⌖</span></button>
    <p className="fine-note">Check in only after reaching the customer’s location. You will need their 4-digit OTP.</p>
  </main>
}

function Arrived({ setScreen }) {
  return <main className="page center-page"><div className="success-circle">✓</div><Status>CHECK-IN CONFIRMED</Status><h1>You’ve arrived</h1><p>Your travel time has been recorded. Ask the customer for their OTP before beginning the job.</p><label className="otp-label">Customer OTP <input placeholder="•  •  •  •" inputMode="numeric" /></label><button className="primary full" onClick={() => setScreen('worker')}>Start the job <span>→</span></button></main>
}

function Wallet({ setScreen }) {
  return <main className="page"><button className="back" onClick={() => setScreen('worker')}>←</button><p className="eyebrow">YOUR WALLET</p><h1>₹1,840.00</h1><p className="subtext">Available to withdraw</p><button className="primary full">Withdraw earnings</button><section className="section"><div className="section-title"><h2>Recent activity</h2></div><div className="wallet-row"><span className="wallet-plus">+</span><div><strong>Job earnings</strong><small>Kitchen tap repair · Today</small></div><b>+₹480</b></div><div className="wallet-row"><span className="wallet-minus">−</span><div><strong>Cancellation charge</strong><small>Worker cancellation · Aug 18</small></div><b>−₹50</b></div><div className="wallet-row"><span className="wallet-plus">+</span><div><strong>Job earnings</strong><small>Switch board repair · Aug 17</small></div><b>+₹320</b></div></section></main>
}

function Signup({ setScreen, setRole }) {
  const [accountRole, setAccountRole] = React.useState('customer')
  const [errors, setErrors] = React.useState({})
  const [drafts, setDrafts] = React.useState({ customer: createSignupDraft(), worker: createSignupDraft() })
  const [formError, setFormError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const draft = drafts[accountRole]
  const submit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const nextErrors = {}
    const name = String(data.get('fullName') || '').trim()
    const phone = String(data.get('phone') || '').replace(/\D/g, '')
    const email = String(data.get('email') || '').trim()
    const password = String(data.get('password') || '')
    const nameWords = name.split(/\s+/).filter(Boolean)
    if (name.length < 2) nextErrors.fullName = 'Enter your full name.'
    else if (nameWords.length > 3) nextErrors.fullName = 'Use no more than 3 words for your full name.'
    if (!/^\d{10}$/.test(phone)) nextErrors.phone = 'Enter a valid 10-digit mobile number.'
    if (!/^[^\s@]+@[^\s@]+\.com$/i.test(email)) nextErrors.email = 'Enter an email address ending in .com.'
    if (password.length < 8) nextErrors.password = 'Password must be at least 8 characters.'
    if (accountRole === 'worker' && data.getAll('services').length === 0) nextErrors.services = 'Select at least one service.'
    if (!data.get('terms')) nextErrors.terms = 'You must agree before creating an account.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    setFormError('')
    setIsSubmitting(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: draft.fullName, phone: draft.phone, email: draft.email, password: draft.password, role: accountRole, services: accountRole === 'worker' ? draft.services : [] }),
      })
      const result = await response.json()
      if (!response.ok) {
        setErrors(result.errors || {})
        setFormError(result.message || 'We could not create your account.')
        return
      }
      setDrafts((current) => ({ ...current, [accountRole]: createSignupDraft() }))
      setRole(accountRole)
    } catch {
      setFormError('Could not reach the local database server. Run python3 backend/app.py and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  const updateDraft = (field, value) => { setFormError(''); setDrafts((current) => ({ ...current, [accountRole]: { ...current[accountRole], [field]: value } })) }
  const clearError = (field) => setErrors((current) => ({ ...current, [field]: undefined }))
  const chooseRole = (nextRole) => {
    setErrors({})
    setAccountRole(nextRole)
  }
  return <main className="page form-page signup-page">
    <button className="back" onClick={() => setScreen('customer')}>←</button>
    <div className="signup-heading"><span className="brand-mark">✦</span><p className="eyebrow">CREATE YOUR ACCOUNT</p><h1>Join TaskNest</h1><p>Book trusted local help, or grow your service business.</p></div>
    <form onSubmit={submit} noValidate>
      <div className="signup-role" role="group" aria-label="Choose account type">
        <button type="button" className={accountRole === 'customer' ? 'chosen' : ''} onClick={() => chooseRole('customer')}><span>⌂</span><strong>Customer</strong><small>I need a service</small></button>
        <button type="button" className={accountRole === 'worker' ? 'chosen' : ''} onClick={() => chooseRole('worker')}><span>🛠</span><strong>Worker</strong><small>I provide services</small></button>
      </div>
      <label>Full name <input name="fullName" value={draft.fullName} aria-invalid={Boolean(errors.fullName)} onChange={(event) => { updateDraft('fullName', event.target.value); clearError('fullName') }} placeholder="Enter your full name" autoComplete="name" />{errors.fullName && <small className="form-error">{errors.fullName}</small>}</label>
      <label>Phone number <div className="phone-input"><span>+91</span><input name="phone" value={draft.phone} aria-invalid={Boolean(errors.phone)} onInput={(event) => { updateDraft('phone', event.currentTarget.value.replace(/\D/g, '')); clearError('phone') }} type="tel" inputMode="numeric" maxLength="10" placeholder="10-digit mobile number" autoComplete="tel" /></div>{errors.phone && <small className="form-error">{errors.phone}</small>}</label>
      <label>Email address <input name="email" value={draft.email} aria-invalid={Boolean(errors.email)} onChange={(event) => { updateDraft('email', event.target.value); clearError('email') }} type="email" placeholder="name@example.com" autoComplete="email" />{errors.email && <small className="form-error">{errors.email}</small>}</label>
      <label>Password <input name="password" value={draft.password} aria-invalid={Boolean(errors.password)} onChange={(event) => { updateDraft('password', event.target.value); clearError('password') }} type="password" minLength="8" placeholder="At least 8 characters" autoComplete="new-password" />{errors.password && <small className="form-error">{errors.password}</small>}</label>
      {accountRole === 'worker' && <>
        <label>Your services <select name="services" value={draft.services} aria-invalid={Boolean(errors.services)} onChange={(event) => { updateDraft('services', Array.from(event.currentTarget.selectedOptions, (option) => option.value)); clearError('services') }} multiple size="3" aria-describedby="skills-help"><option value="carpenter">Carpenter</option><option value="electrician">Electrician</option><option value="desktop-repair">Desktop repair man</option></select><small id="skills-help" className="field-help">Hold ⌘ on Mac or Ctrl on Windows to select more than one service.</small>{errors.services && <small className="form-error">{errors.services}</small>}</label>
        <div className="verification-note"><span>✓</span><p><strong>Verification comes next</strong> We’ll ask for your ID and service-area details after you create your account.</p></div>
      </>}
      <label className="terms"><input name="terms" checked={draft.terms} aria-invalid={Boolean(errors.terms)} onChange={(event) => { updateDraft('terms', event.target.checked); clearError('terms') }} type="checkbox" /> <span>I agree to the Terms of Service and Privacy Policy.</span></label>{errors.terms && <p className="form-error terms-error">{errors.terms}</p>}
      {formError && <p className="form-error submit-error">{formError}</p>}
      <button className="primary full" disabled={isSubmitting} type="submit">{isSubmitting ? 'Creating account…' : `Create ${accountRole} account`} <span>→</span></button>
    </form>
    <p className="login-prompt">Already have an account? <button type="button" onClick={() => setRole(accountRole)}>Log in</button></p>
  </main>
}

function App() {
  const [role, setRole] = React.useState('customer')
  const [screen, setScreen] = React.useState('customer')
  const [selectedAddress, setSelectedAddress] = React.useState(addresses[0])
  const changeRole = (next) => { setRole(next); setScreen(next) }
  const view = { customer: CustomerHome, request: RequestJob, matching: Matching, tracking: Tracking, worker: WorkerHome, job: WorkerJob, arrived: Arrived, wallet: Wallet, signup: Signup }[screen]
  const View = view || CustomerHome
 const viewProps = {
  setScreen,
  setRole: changeRole,
  selectedAddress,
  setSelectedAddress,
}

return <div className="app-shell"><header><button className="brand" onClick={() => changeRole('customer')}><b>✦</b> TaskNest</button><div className="role-switch"><button className={role === 'customer' ? 'selected' : ''} onClick={() => changeRole('customer')}>Customer</button><button className={role === 'worker' ? 'selected' : ''} onClick={() => changeRole('worker')}>Worker</button></div><button className="signup-link" onClick={() => setScreen('signup')}>Sign up</button></header><View {...viewProps} /><nav><button onClick={() => changeRole(role)}><span>⌂</span>Home</button><button><span>▣</span>Jobs</button><button onClick={() => role === 'worker' && setScreen('wallet')}><span>◉</span>{role === 'worker' ? 'Wallet' : 'Support'}</button><button onClick={() => setScreen('signup')}><span>☻</span>Profile</button></nav></div>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
