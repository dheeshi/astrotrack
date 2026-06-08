import { useState, useEffect } from 'react'

function App() {
  // Authentication States
  const [token, setToken] = useState(localStorage.getItem('astro_token') || null)
  const [username, setUsername] = useState(localStorage.getItem('astro_user') || '')
  const [isRegistering, setIsRegistering] = useState(false)

  // Auth Form Fields
  const [authUsername, setAuthUsername] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authError, setAuthError] = useState('')

  // Dashboard Telemetry States
  const [astronomyData, setAstronomyData] = useState(null)
  const [observations, setObservations] = useState([])
  const [loading, setLoading] = useState(true)

  // Form States for Logging Observations
  const [celestialBody, setCelestialBody] = useState('Mars')
  const [notes, setNotes] = useState('')
  const [formMessage, setFormMessage] = useState('')

  // Fetch telemetry when authenticated
  useEffect(() => {
    if (!token) return;

    setLoading(true)
    // Fetch live external space parameters
    fetch('http://localhost:8080/dashboard?lat=12.97&lon=77.59')
      .then(res => res.json())
      .then(data => {
        setAstronomyData(data)
        setLoading(false)
      })
      .catch(err => console.error("Telemetry error:", err))

    // Fetch localized telemetric database records
    fetch('http://localhost:8080/observations')
      .then(res => res.json())
      .then(data => setObservations(data))
      .catch(err => console.error("Database fetch error:", err))
  }, [token])

  // AUTHENTICATION HANDLERS
  const handleAuthSubmit = (e) => {
    e.preventDefault()
    setAuthError('')

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login'
    const payload = isRegistering
      ? { username: authUsername, password: authPassword, email: authEmail }
      : { username: authUsername, password: authPassword }

    fetch(`http://localhost:8080${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
   .then(async (res) => {
         const data = await res.text()
         if (!res.ok) throw new Error(data || 'Authentication failed')

         if (isRegistering) {
           setIsRegistering(false)
           setAuthError('🚀 Registration successful! Please log in.')
           setAuthPassword('')
         } else {
           // Core Fix: Extract the true JWT token from your real backend response
           let extractedToken = data;
           try {
             const json = JSON.parse(data)
             // If your backend returns an object like { token: "..." } or { jwt: "..." }
             extractedToken = json.token || json.jwt || data
           } catch(e) {
             // If your backend just returns a raw plain text token string
             extractedToken = data
           }

           localStorage.setItem('astro_token', extractedToken)
           localStorage.setItem('astro_user', authUsername)
           setToken(extractedToken)
           setUsername(authUsername)
         }
       })
    .catch(err => setAuthError(err.message))
  }

  const handleLogout = () => {
    localStorage.removeItem('astro_token')
    localStorage.removeItem('astro_user')
    setToken(null)
    setUsername('')
  }

 // LOG DATA SUBMISSION HANDLER
   const handleLogObservation = (e) => {
     e.preventDefault()
     setFormMessage('')

     const payload = { celestialBody, notes }

   fetch('http://localhost:8080/observations', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     },
     body: JSON.stringify(payload)
   })
     .then(async (res) => {
       if (!res.ok) {
         const errorText = await res.text()
         throw new Error(errorText || 'Failed to transmit data')
       }
       setFormMessage(`🚀 Transmitted successfully!`)
       setNotes('')
       // Refresh database feed list
       return fetch('http://localhost:8080/observations')
     })
     .then(res => res.json())
     .then(data => setObservations(data))
     .catch(err => setFormMessage(`❌ ${err.message}`))
   }

  // RENDER UNAUTHENTICATED GATE
  if (!token) {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center font-sans px-4">
        <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-xl shadow-indigo-950/20">
          <div className="flex flex-col items-center mb-8">
            <span className="text-4xl mb-2">🌌</span>
            <h1 className="text-2xl font-black tracking-wider text-indigo-400">ASTROTRACK TERMINAL</h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Secure Cloud Gateway</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Username</label>
              <input
                type="text"
                value={authUsername}
                onChange={(e) => setAuthUsername(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {isRegistering && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Access Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-semibold tracking-wide transition mt-2">
              {isRegistering ? 'Initialize Core Account' : 'Establish Secure Connection'}
            </button>
          </form>

          {authError && (
            <p className="mt-4 text-xs font-mono text-center text-indigo-400 p-2 bg-[#0b0f19] rounded border border-slate-800">
              {authError}
            </p>
          )}

          <div className="mt-6 text-center border-t border-slate-800 pt-4">
            <button
              onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
              className="text-xs text-slate-400 hover:text-indigo-400 transition"
            >
              {isRegistering ? 'Already registered? Return to Login' : 'First instance setup? Register Security Account'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // RENDER LIVE PROTECTED DASHBOARD PANEL
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex font-sans">

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#111827] border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="text-2xl">🌌</span>
            <h1 className="text-xl font-black tracking-wider text-indigo-400">ASTROTRACK</h1>
          </div>
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 bg-slate-800 text-indigo-400 px-4 py-2.5 rounded-lg font-medium text-sm">
              🛰️ Control Dashboard
            </a>
          </nav>
        </div>

        {/* PROFILE MANAGEMENT CONTAINER */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold text-white shadow-md shadow-indigo-500/20">
              {username ? username[0].toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-200 truncate">{username}</h3>
              <p className="text-xs text-emerald-400 font-mono">SECURE_SESSION</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-slate-800/80 hover:bg-red-900/30 hover:text-red-400 border border-slate-700/60 text-slate-400 text-xs py-1.5 rounded-md font-medium transition"
          >
            Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD PANEL CONTAINER */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">Satellite Control Deck</h2>
            <p className="text-sm text-slate-400">Monitoring relational database channels and external space parameters.</p>
          </div>
          <div className="text-xs bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-md text-slate-400 font-mono">
            SYS_STATUS: <span className="text-emerald-400 font-bold animate-pulse">ONLINE</span>
          </div>
        </header>

        {/* TOP METRICS GRID */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sunrise Telemetry</p>
            <h3 className="text-2xl font-mono font-bold text-emerald-400">{loading ? '...' : astronomyData?.sunrise}</h3>
          </div>
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Sunset Telemetry</p>
            <h3 className="text-2xl font-mono font-bold text-amber-400">{loading ? '...' : astronomyData?.sunset}</h3>
          </div>
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-sm">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Atmospheric Condition</p>
            <p className="text-sm text-indigo-300 font-medium mt-1">{loading ? '...' : astronomyData?.conditions}</p>
          </div>
        </section>

        {/* DATA UTILITY SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-1 bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-200 mb-2 border-b border-slate-800 pb-2">Log New Observation</h3>
              <form onSubmit={handleLogObservation} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Target Celestial Body</label>
                  <select
                    value={celestialBody}
                    onChange={(e) => setCelestialBody(e.target.value)}
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Mars">Mars (Red Planet)</option>
                    <option value="Jupiter">Jupiter (Gas Giant)</option>
                    <option value="International Space Station">ISS</option>
                    <option value="Andromeda Galaxy">Andromeda (M31)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Observation Log Details</label>
                  <textarea
                    rows="3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Enter environmental data, equipment details, or visibility logs..."
                    className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-semibold tracking-wide transition shadow-md shadow-indigo-600/10">
                  Transmit to Database
                </button>
              </form>
            </div>
            {formMessage && (
              <p className="mt-4 text-xs font-mono p-2 bg-[#0b0f19] border border-slate-800 rounded text-center font-bold text-indigo-400 animate-pulse">
                {formMessage}
              </p>
            )}
          </div>

          <div className="lg:col-span-2 bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-200 mb-2 border-b border-slate-800 pb-2">Relational Data Feed (PostgreSQL)</h3>
            <div className="mt-4 space-y-3 max-h-[340px] overflow-y-auto pr-2">
              {observations.length === 0 ? (
                <div className="text-center py-12 text-slate-600 border border-dashed border-slate-800 rounded-xl">
                  <p className="text-sm">No localized telemetric logs stored in database.</p>
                  <p className="text-xs text-slate-700 mt-1">Use the entry panel to log your initial record.</p>
                </div>
              ) : (
                observations.map((obs) => (
                  <div key={obs.id} className="bg-[#0b0f19] border border-slate-800 p-4 rounded-xl flex flex-col justify-between hover:border-slate-700 transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-indigo-400 bg-indigo-950/40 border border-indigo-900/50 px-2.5 py-0.5 rounded-md">
                        🛰️ {obs.celestialBody}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        ID: #{obs.id}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-normal">{obs.notes}</p>
                    <div className="text-[11px] font-mono text-slate-500 mt-3 border-t border-slate-900 pt-2 flex justify-between">
                      <span>DATALOG_TIMESTAMP:</span>
                      <span className="text-slate-400">{obs.observedAt ? obs.observedAt.substring(0,16).replace('T',' ') : 'Just Now'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>
      </main>
    </div>
  )
}

export default App