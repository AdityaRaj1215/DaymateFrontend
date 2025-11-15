import api from './api'

export const tasksService = {
  // Get all tasks
  getAll: async () => {
    const response = await api.get('/tasks')
    if (response.error) {
      return { success: false, error: response.error, data: [] }
    }
    return { success: true, data: response.data }
  },

  // Get single task
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Create task
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Update task
  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Delete task
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true }
  }
}

