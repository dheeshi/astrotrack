import { useState, useEffect } from 'react'

function App() {
  // Authentication States
  const [token, setToken] = useState(
    localStorage.getItem('astro_token') || null
  )

  const [username, setUsername] = useState(
    localStorage.getItem('astro_user') || ''
  )

  const [userId, setUserId] = useState(
    localStorage.getItem('astro_user_id') || null
  )

const [toast, setToast] = useState('');
const [page, setPage] = useState('home')
const [publicObservations, setPublicObservations] = useState([])
const [isRegistering, setIsRegistering] = useState(false)
const [isPublic, setIsPublic] = useState(false)

const [showDeleteModal, setShowDeleteModal] = useState(false)
const [deleteId, setDeleteId] = useState(null)
const [observationToDelete, setObservationToDelete] =
  useState(null);

  // Auth Form Fields
  const [authUsername, setAuthUsername] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authError, setAuthError] = useState('')

  // Dashboard Telemetry States
  const [astronomyData, setAstronomyData] = useState(null)
  const [observations, setObservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const [communityPage, setCommunityPage] = useState(0)
  const [apod, setApod] = useState(null);
  const [totalPages, setTotalPages] = useState(0)
  const [totalPublicObservations,
         setTotalPublicObservations] =
         useState(0);

  // Form States for Logging Observations
  const [celestialBody, setCelestialBody] = useState('Mars')
  const [notes, setNotes] = useState('')
  const [formMessage, setFormMessage] = useState('')

  // Fetch telemetry when authenticated
 useEffect(() => {
   if (!token) return

   setLoading(true)

   fetch(
     'https://astrotrack.onrender.com/dashboard?lat=12.97&lon=77.59'
   )
     .then(res => res.json())
     .then(data => {
       setAstronomyData(data)
       setLoading(false)
     })
     .catch(err =>
       console.error('Telemetry error:', err)
     )

   fetch(
     `https://astrotrack.onrender.com/observations/user/${userId}`
   )
     .then(res => res.json())
     .then(data => setObservations(data))
     .catch(err =>
       console.error('Database fetch error:', err)
     )

  fetch(
    `https://astrotrack.onrender.com/observations/public?page=${communityPage}&size=5`
  )
  .then(res => res.json())
  .then(data => {

    setPublicObservations(data.content || [])

    setTotalPages(data.totalPages || 0)

    setTotalPublicObservations(
      data.totalElements || 0
    )

  })

fetch('https://astrotrack.onrender.com/nasa/apod')
  .then(res => res.json())
  .then(data => {
    console.log("NASA APOD:", data);
    setApod(data);
  })
  .catch(err => console.error(err));

 }, [token, userId])

//unauthenticated
useEffect(() => {

  fetch(
    `https://astrotrack.onrender.com/observations/public?page=${communityPage}&size=5`
  )
    .then(res => res.json())
    .then(data => {

      setPublicObservations(data.content || []);

      setTotalPages(data.totalPages || 0);

      setTotalPublicObservations(
        data.totalElements || 0
      );

    })
    .catch(err => {
      console.error(err);
      setPublicObservations([]);
    });

}, [communityPage]);

  // AUTHENTICATION HANDLERS
const handleAuthSubmit = (e) => {
  e.preventDefault()
  setAuthError('')

  const endpoint = isRegistering
    ? '/api/auth/register'
    : '/api/auth/login'

  const payload = isRegistering
    ? {
        username: authUsername,
        password: authPassword,
        email: authEmail
      }
    : {
        username: authUsername,
        password: authPassword
      }

  fetch(`https://astrotrack.onrender.com${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
    .then(async (res) => {

      const data = await res.text()

      if (!res.ok) {
        throw new Error(data || 'Authentication failed')
      }

      if (isRegistering) {

        setIsRegistering(false)
        setAuthError('Registration successful. Please login.')
        setAuthPassword('')

      } else {

        const json = JSON.parse(data)

        localStorage.setItem('astro_token', json.jwt)
        localStorage.setItem('astro_user', json.username)
        localStorage.setItem('astro_user_id', json.userId)

        setToken(json.jwt)
        setUsername(json.username)
        setUserId(json.userId)

        setPage('welcome')
      }
    })
    .catch(err => setAuthError(err.message))
}

  const handleLogout = () => {

    localStorage.removeItem('astro_token')
    localStorage.removeItem('astro_user')
    localStorage.removeItem('astro_user_id')

    setToken(null)
    setUsername('')
    setUserId(null)

    setPage('home')
  }

 // LOG DATA SUBMISSION HANDLER
  const handleLogObservation = (e) => {

    e.preventDefault()

    setFormMessage('')

    const payload = {
      userId,
      celestialBody,
      notes,
      publicObservation: isPublic
    }


const url = editingId
  ? `https://astrotrack.onrender.com/observations/${editingId}`
  : 'https://astrotrack.onrender.com/observations'

const method = editingId
  ? 'PUT'
  : 'POST'

fetch(url, {

method,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },

  body: JSON.stringify(payload)

})
.then(async (res) => {

  if (!res.ok) {

    const errorText = await res.text();

    throw new Error(
      errorText || 'Failed to transmit data'
    );
  }

  setFormMessage('🚀 Transmitted successfully!')
  setTimeout(() => {
    setFormMessage('');
  }, 3000);

  setNotes('')
  setIsPublic(false)
  setEditingId(null)

  return fetch(
    `https://astrotrack.onrender.com/observations/user/${userId}`
  );

})
.then(res => res.json())
.then(data => {

  setObservations(data);

  return fetch(
    `https://astrotrack.onrender.com/observations/public?page=${communityPage}&size=5`
  );

})
.then(res => res.json())
.then(data => {

  setPublicObservations(data.content || []);

})
.catch(err => {

  setFormMessage(`❌ ${err.message}`);

});
  }

//DELETE
const handleDeleteObservation = (id) => {

  fetch(
    `https://astrotrack.onrender.com/observations/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  .then(() =>
    fetch(
      `https://astrotrack.onrender.com/observations/user/${userId}`
    )
  )
  .then(res => res.json())
  .then(data => {

    setObservations(data);

    // CLOSE MODAL
    setShowDeleteModal(false);
    setObservationToDelete(null);

    setFormMessage(
      '🗑️ Observation deleted successfully!'
    );

    setTimeout(() => {
      setFormMessage('');
    }, 3000);

    return fetch(
      `https://astrotrack.onrender.com/observations/public?page=${communityPage}&size=5`
    );

  })
  .then(res => res.json())
  .then(data => setPublicObservations(data.content || []))

  .catch(err =>
    console.error(err)
  );
}

//EDIT
const handleEditObservation = (obs) => {

  setEditingId(obs.id)

  setCelestialBody(obs.celestialBody)

  setNotes(obs.notes)

  setIsPublic(obs.public)

}
  // RENDER UNAUTHENTICATED GATE
  if (!token && page === 'home') {
    return (
      <div className="min-h-screen bg-[#0b0f19] text-white overflow-hidden">

        {/* SPACE BACKGROUND */}
        <div className="fixed inset-0 pointer-events-none">

          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-[#0b0f19] to-purple-950" />

          {/* Nebula Glow */}
          <div className="absolute top-10 left-20 w-96 h-96 bg-purple-600/20 blur-[160px] rounded-full" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-600/20 blur-[160px] rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-cyan-500/10 blur-[120px] rounded-full" />

          {/* Stars */}
          <div className="absolute top-20 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-20 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>

        </div>

        {/* HERO */}
        <section className="relative max-w-7xl mx-auto px-6 pt-36 pb-28 text-center">

          <div className="inline-flex items-center gap-2 border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 rounded-full text-indigo-300 mb-8">

            🔭 Astronomy Observation Platform

          </div>

          <h1 className="text-7xl md:text-8xl font-extrabold mb-8 bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">

            AstroTrack

          </h1>

          <p className="max-w-3xl mx-auto text-xl text-slate-400 leading-relaxed mb-12">

            Record celestial observations, maintain a personal astronomy log,
            and share discoveries with a growing community of stargazers,
            telescope enthusiasts, and space explorers.

          </p>

          <button
            onClick={() => {
              setPage('login')
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl shadow-indigo-900/50"
          >
            🚀 Start Observing
          </button>

        </section>

        {/* PROFESSIONAL FEATURES */}
        <section className="relative max-w-6xl mx-auto px-6 py-20">

          <h2 className="text-4xl font-bold text-center mb-14">

            Built For Astronomy Enthusiasts

          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-3xl">

              <div className="text-5xl mb-5">🔭</div>

              <h3 className="text-xl font-bold mb-3">
                Observation Journal
              </h3>

              <p className="text-slate-400">
                Maintain a personal log of planets, galaxies,
                nebulae, satellites and deep-sky discoveries.
              </p>

            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-3xl">

              <div className="text-5xl mb-5">🌌</div>

              <h3 className="text-xl font-bold mb-3">
                Community Discoveries
              </h3>

              <p className="text-slate-400">
                Share selected observations publicly and
                explore sightings from fellow observers.
              </p>

            </div>

            <div className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-3xl">

              <div className="text-5xl mb-5">📡</div>

              <h3 className="text-xl font-bold mb-3">
                Space Exploration
              </h3>

              <p className="text-slate-400">
                Organize celestial records in a modern,
                professional astronomy dashboard.
              </p>

            </div>

          </div>

        </section>

        {/* COMMUNITY PREVIEW */}
        <section className="relative max-w-6xl mx-auto px-6 py-20">

          <h2 className="text-4xl font-bold mb-10">

            🌍 Recent Community Discoveries

          </h2>

          <div className="grid md:grid-cols-2 gap-6">

            {publicObservations.slice(0, 4).map(obs => (

              <div
                key={obs.id}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-indigo-500 transition"
              >

                <div className="flex justify-between mb-4">

                  <span className="font-bold text-indigo-400">
                    {obs.celestialBody}
                  </span>

                  <span className="text-xs text-slate-500">
                    @{obs.user?.username}
                  </span>

                </div>

                <p className="text-slate-300">
                  {obs.notes}
                </p>

              </div>

            ))}

          </div>

        </section>

        {/* Create Account */}
        <section className="relative max-w-5xl mx-auto px-6 py-24">

          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[32px] p-14 text-center shadow-2xl shadow-indigo-950/50">

            <h2 className="text-5xl font-bold mb-5">

              The Night Sky Is Waiting

            </h2>

            <p className="text-lg text-indigo-100 mb-8">

              Create your observation journal and begin exploring
              the universe today.

            </p>

            <button
              onClick={() => {
                setIsRegistering(true)
                setPage('login')
              }}
              className="bg-white text-black px-10 py-4 rounded-xl font-bold hover:scale-105 transition"
            >
              Create Free Account
            </button>

          </div>

        </section>

        {/* FOOTER */}
        <footer className="border-t border-slate-800">

          <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-4">

            <p className="text-slate-500">
              © 2026 AstroTrack
            </p>

            <p className="text-slate-500">
              React • Spring Boot • PostgreSQL
            </p>

          </div>

        </footer>

      </div>
    )
  }

//SIGN IN OR SIGN UP
  if (!token && page === 'login'){
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
              <button
                onClick={() => setPage('welcome')}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  page === 'welcome'
                    ? 'bg-slate-800 text-indigo-400'
                    : 'text-slate-400'
                }`}
              >
                🚀 Home
              </button>

            <button
              onClick={() => setPage('dashboard')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                page === 'dashboard'
                  ? 'bg-slate-800 text-indigo-400'
                  : 'text-slate-400'
              }`}
            >
              🛰️ My Dashboard
            </button>

            <button
              onClick={() => setPage('community')}
              className={`w-full text-left px-4 py-2 rounded-lg ${
                page === 'community'
                  ? 'bg-slate-800 text-indigo-400'
                  : 'text-slate-400'
              }`}
            >
              🌍 Community Feed
            </button>

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
              <p className="text-xs text-emerald-400 font-mono">OBSERVER</p>
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

          {/* Home Page */}
          {page === 'welcome' ? (

          <div>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-slate-800 p-12 mb-8">

              <div className="absolute top-10 left-20 w-40 h-40 bg-indigo-500/20 blur-[100px] rounded-full"></div>

              <div className="absolute bottom-0 right-20 w-40 h-40 bg-purple-500/20 blur-[100px] rounded-full"></div>

              <div className="relative z-10">

                <h1 className="text-5xl font-bold mb-4">
                  Welcome {username} 🚀
                </h1>

                <p className="text-slate-300 text-lg max-w-3xl">
                  Continue exploring the cosmos, record new celestial
                  observations and discover what the AstroTrack
                  community is seeing tonight.
                </p>

              </div>

            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-4xl font-bold text-indigo-400">
                  {observations.length}
                </h3>
                <p className="text-slate-400 mt-2">
                  Your Observations
                </p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-4xl font-bold text-purple-400">
                  {totalPublicObservations}
                </h3>
                <p className="text-slate-400 mt-2">
                  Community Discoveries
                </p>
              </div>

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
                <h3 className="text-4xl font-bold text-cyan-400">
                  LIVE
                </h3>
                <p className="text-slate-400 mt-2">
                  Space Monitoring
                </p>
              </div>

            </div>

            {/* NASA APOD */}
            {apod && (

              <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 mb-8">

                <h2 className="text-2xl font-bold mb-6">
                  🌌 NASA Astronomy Picture of the Day
                </h2>

                <img
                  src={apod.url}
                  alt={apod.title}
                  className="w-full max-h-[300px] object-cover rounded-xl mb-6"
                />

                <h3 className="text-xl font-bold text-indigo-400 mb-3">
                  {apod.title}
                </h3>

                <p className="text-slate-300 leading-relaxed">
                  {apod.explanation}
                </p>

                <div className="mt-4 text-xs text-slate-500">
                  NASA APOD • {apod.date}
                </div>

              </div>

            )}


            <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">

              <h2 className="text-2xl font-bold mb-6">
                🌍 Recent Community Discoveries
              </h2>

              <div className="space-y-4">

                {publicObservations.slice(0,3).map(obs => (

                  <div
                    key={obs.id}
                    className="border border-slate-800 rounded-lg p-4"
                  >

                    <div className="flex justify-between mb-2">

                      <span className="text-indigo-400 font-bold">
                        {obs.celestialBody}
                      </span>

                      <span className="text-xs text-slate-500">
                        @{obs.user?.username}
                      </span>

                    </div>

                    <p className="text-slate-300 whitespace-pre-wrap">
                      {obs.notes}
                    </p>

                  </div>
                ))}

              </div>

            </div>

          </div>

          //community section
          ) : page === 'community' ? (

          <div>

            <h2 className="text-2xl font-bold mb-6">
              🌍 Community Feed
            </h2>

            <div className="space-y-4">

              {publicObservations.map(obs => (

                <div
                  key={obs.id}
                  className="bg-[#111827] border border-slate-800 rounded-xl p-4"
                >

                  <div className="flex justify-between mb-2">

                    <span className="text-indigo-400 font-bold">
                      {obs.celestialBody}
                    </span>

                    <span className="text-xs text-slate-500">
                      @{obs.user?.username}
                    </span>

                  </div>

                  <p className="text-slate-300 whitespace-pre-wrap">
                    {obs.notes}
                  </p>

                </div>

              ))}

          {/* PAGINATION */}

           <div className="flex gap-3 mt-6">

             <button
               onClick={() =>
                 setCommunityPage(
                   communityPage - 1
                 )
               }
               disabled={communityPage === 0}
               className="
                 bg-slate-700
                 px-4
                 py-2
                 rounded-lg
                 disabled:opacity-40
               "
             >
               ‹
             </button>

             <button
               onClick={() =>
                 setCommunityPage(
                   communityPage + 1
                 )
               }
               disabled={
                 communityPage >= totalPages - 1
               }
               className="
                 bg-indigo-600
                 px-4
                 py-2
                 rounded-lg
                 disabled:opacity-40
               "
             >
               ›
             </button>

           </div>

            </div>

          </div>

          ) : (

          <>
         {/* Dashboard Page */}
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-100">🔭 Observation Center</h2>
            <p className="text-sm text-slate-400">Record discoveries and explore the night sky.</p>
          </div>
          <div className="text-xs bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-md text-slate-400 font-mono">
            <span className="text-emerald-400 font-bold animate-pulse">✨ Astronomy Session Active</span>
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
                    <option value="Saturn">Saturn (Ring Planet)</option>
                    <option value="Venus">Venus</option>

                    <option value="Hubble Space Telescope region">Hubble Deep Field / Hubble Region</option>
                    <option value="International Space Station">ISS</option>

                    <option value="Comet Observation">Comet Observation</option>
                    <option value="Meteor Shower Event">Meteor Shower Observation</option>

                    <option value="Milky Way Core">Galactic Center</option>
                    <option value="Andromeda Galaxy">Andromeda (M31)</option>
                    <option value="Orion Nebula">Orion Nebula (M42)</option>
                    <option value="Sombrero Galaxy">Sombrero Galaxy (M104)</option>
                    <option value="Whirlpool Galaxy">Whirlpool Galaxy (M51)</option>

                    <option value="Betelgeuse (Red Supergiant)">Betelgeuse</option>
                    <option value="Sirius (Brightest Star)">Sirius</option>
                    <option value="Polaris (North Star)">Polaris</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Observation Log Details</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={8}
                    maxLength={5000}
                    placeholder="Enter environmental data, equipment details, or visibility logs..."
                                        className="w-full bg-[#0b0f19] border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                                        required
                  />

                  <p className="text-xs text-slate-400 mt-1">
                    {notes.length}/5000 characters
                  </p>

                  <div className="mt-2">
                    <label className="flex items-center gap-2 text-sm text-slate-300">

                      <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) =>
                          setIsPublic(e.target.checked)
                        }
                      />

                      Share With Community

                    </label>
                  </div>

                </div>
               <button
                 type="submit"
                 className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-semibold tracking-wide transition shadow-md shadow-indigo-600/10"
               >
                 {editingId
                   ? 'Update Observation'
                   : 'Transmit to Database'}
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
            <h3 className="text-lg font-bold text-slate-200 mb-2 border-b border-slate-800 pb-2">📖 Observation History</h3>
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
                   <div className="mt-3 border-t border-slate-900 pt-2">

                     <div className="flex justify-between items-center">
                       <span className="text-[11px] font-mono text-slate-500">
                         DATALOG_TIMESTAMP:
                       </span>

                       <span className="text-[11px] font-mono text-slate-400">
                         {obs.observedAt
                           ? obs.observedAt.substring(0,16).replace('T',' ')
                           : 'Just Now'}
                       </span>
                     </div>

                   <div className="flex gap-2 mt-3">

                     <button
                       onClick={() => handleEditObservation(obs)}
                       className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 rounded"
                     >
                       ✏️
                     </button>

                     <button
                        onClick={() => {
                           setObservationToDelete(obs.id);
                           setShowDeleteModal(true);
                         }}
                       className="px-3 py-1 text-xs bg-red-600 hover:bg-red-500 rounded"
                     >
                       🗑
                     </button>

                   </div>

                   </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </section>

        </>
        )}

          {/* DELETE CONFIRMATION MODAL */}
          {showDeleteModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-[#111827] border border-slate-700 rounded-xl p-6 w-[380px]">

                <h3 className="text-xl font-bold text-white mb-2">
                  Delete Observation?
                </h3>

                <p className="text-slate-400 text-sm mb-5">
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-3">

                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setObservationToDelete(null);
                    }}
                    className="bg-slate-600 px-6 py-3 rounded-lg"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteObservation(
                        observationToDelete
                      )
                    }
                    className="bg-red-600 px-6 py-3 rounded-lg"
                  >
                    Delete
                  </button>

                </div>

              </div>
            </div>
          )}

          </main>

        </div>
      )}

export default App