import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Input from '../components/Input'
import Button from '../components/Button'
import { isValidEmail } from '../utils/helpers'
import { authService } from '../services/auth'

const Register = ({ onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    
    try {
      const result = await authService.register(formData.name, formData.email, formData.password)
      
      if (result.success) {
        // Store user data for compatibility
        const userData = result.data.user || {
          email: formData.email,
          name: formData.name,
          loggedIn: true
        }
        localStorage.setItem('user', JSON.stringify(userData))
        onLogin(userData)
        navigate('/tasks')
      } else {
        setErrors({ general: result.error || 'Registration failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ general: error.message || 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <Card>
          <h1 className="text-3xl font-bold text-cursor-text mb-2 text-center">Register</h1>
          <p className="text-cursor-text-muted text-center mb-6">Create your Daymate account</p>
          
          <form onSubmit={handleSubmit}>
            {errors.general && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-400 text-sm">
                {errors.general}
              </div>
            )}
            
            <Input
              label="Name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />

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

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mb-4"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>

          <div className="text-center mt-4">
            <p className="text-cursor-text-muted text-sm">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-500 hover:text-blue-400 font-medium"
              >
                Login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Register

