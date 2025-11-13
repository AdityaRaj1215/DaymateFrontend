import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { isValidEmail } from '../utils/helpers'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      // Store user data
      const userData = {
        email: formData.email,
        name: formData.email.split('@')[0],
        loggedIn: true
      }
      localStorage.setItem('user', JSON.stringify(userData))
      onLogin(userData)
      navigate('/tasks')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="text-3xl font-bold text-cursor-text mb-2 text-center">Login</h1>
          <p className="text-cursor-text-muted text-center mb-6">Welcome back to Daymate</p>
          
          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mb-4"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-cursor-text-muted text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Register
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Login

