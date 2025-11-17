import api from './api'

export const tasksService = {
  // Get all tasks
  getAll: async () => {
    const response = await api.get('/api/tasks')
    if (response.error) {
      return { success: false, error: response.error, data: [] }
    }
    return { success: true, data: response.data }
  },

  // Get single task
  getById: async (id) => {
    const response = await api.get(`/api/tasks/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Create task
  create: async (taskData) => {
    const response = await api.post('/api/tasks', taskData)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Update task
  update: async (id, taskData) => {
    const response = await api.put(`/api/tasks/${id}`, taskData)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Mark task as complete
  complete: async (id) => {
    const response = await api.patch(`/api/tasks/${id}/complete`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Delete task
  delete: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true }
  }
}

