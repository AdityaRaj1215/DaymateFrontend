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
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        return { data: null, error: `HTTP error! status: ${response.status}` }
      }
      return { data: null, error: null }
    }
    
    const data = await response.json()
    
    if (!response.ok) {
      // Handle API error responses
      return { 
        data: null, 
        error: data.message || data.error || `HTTP error! status: ${response.status}` 
      }
    }
    
    return { data, error: null }
  } catch (error) {
    return { data: null, error: error.message || 'Network error occurred' }
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


