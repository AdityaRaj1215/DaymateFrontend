import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Tasks from './pages/Tasks'
import Notes from './pages/Notes'
import Button from './components/Button'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        if (userData.loggedIn) {
          setUser(userData)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-cursor-text">Loading...</div>
        </div>
      )
    }
    return user ? children : <Navigate to="/login" replace />
  }

  // Home Component
  const Home = () => {
    const navigate = useNavigate()

    if (user) {
      return <Navigate to="/tasks" replace />
    }

    const skills = ['Task Manager', 'Note Taker', 'Organizer', 'Productivity', 'Efficient']

    return (
      <div className="min-h-screen bg-gradient-portfolio relative overflow-hidden">
        {/* Header */}
        <header className="absolute top-0 left-0 right-0 z-10">
          <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 border-2 border-accent-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span className="text-white text-xl font-semibold">Daymate</span>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-white hover:text-accent-orange transition-colors">Features</a>
              <a href="#about" className="text-white hover:text-accent-orange transition-colors">About</a>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-white text-white hover:bg-white hover:text-cursor-bg"
              >
                Login
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                className="bg-accent-orange hover:bg-orange-600 border-accent-orange"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-white text-white text-sm px-4 py-2"
              >
                Login
              </Button>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-12">
          <div className="max-w-4xl w-full text-center">
            {/* Main Title */}
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
              Daymate
            </h1>

            {/* Tagline with Orange Accent */}
            <p className="text-2xl md:text-3xl text-accent-orange font-semibold mb-4">
              Your Personal Productivity Hub |
            </p>

            {/* Sub Taglines */}
            <p className="text-xl md:text-2xl text-white mb-2">
              Organize your life, one task at a time.
            </p>
            <p className="text-lg md:text-xl text-gray-300 mb-12">
              Transform your ideas into actionable tasks and meaningful notes.
            </p>

            {/* Skill Tags */}
            <div className="flex flex-wrap justify-center gap-3 mb-16">
              {skills.map((skill, index) => (
                <div
                  key={index}
                  className="px-6 py-2 border border-white/30 rounded-full text-white hover:border-accent-orange hover:text-accent-orange transition-all cursor-pointer"
                >
                  {skill}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                className="px-10 py-4 text-lg bg-accent-orange hover:bg-orange-600 border-accent-orange"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="px-10 py-4 text-lg border-white text-white hover:bg-white hover:text-cursor-bg"
              >
                Sign In
              </Button>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white text-sm">Scroll to explore</span>
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cursor-text">Loading...</div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/tasks" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/tasks" replace />
              ) : (
                <Register onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <Notes user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
