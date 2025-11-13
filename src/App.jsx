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

    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-5xl font-bold text-cursor-text mb-4">Welcome to Daymate</h1>
          <p className="text-xl text-cursor-text-muted mb-12">
            Manage your tasks and notes in one place
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate('/login')}
              className="px-8 py-3 text-lg"
            >
              Login
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/register')}
              className="px-8 py-3 text-lg"
            >
              Register
            </Button>
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
