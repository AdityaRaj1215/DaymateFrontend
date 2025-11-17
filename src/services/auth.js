import api from './api'
import { STORAGE_KEYS } from '../utils/constants'

export const authService = {
  // Login
  login: async (email, password) => {
    const response = await api.post('/api/users/login', { email, password })
    if (response.error) {
      return { success: false, error: response.error }
    }
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.data.token)
    }
    if (response.data.user) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user))
    }
    
    return { success: true, data: response.data }
  },

  // Register
  register: async (name, email, password) => {
    const response = await api.post('/api/users/register', { name, email, password })
    if (response.error) {
      return { success: false, error: response.error }
    }
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem(STORAGE_KEYS.USER_TOKEN, response.data.token)
    }
    if (response.data.user) {
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data.user))
    }
    
    return { success: true, data: response.data }
  },

  // Logout
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER_DATA)
    localStorage.removeItem('user') // Legacy support
  },

  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA)
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (error) {
        return null
      }
    }
    return null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem(STORAGE_KEYS.USER_TOKEN)
  }
}

