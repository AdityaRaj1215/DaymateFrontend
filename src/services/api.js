import { API_BASE_URL } from '../utils/constants'

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('user_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message }
  }
}

// API methods
export const api = {
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'GET' }),
  
  post: (endpoint, body, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),
  
  put: (endpoint, body, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  
  delete: (endpoint, options = {}) => 
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
  
  patch: (endpoint, body, options = {}) => 
    apiRequest(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),
}

export default api


