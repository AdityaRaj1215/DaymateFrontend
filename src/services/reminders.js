import api from './api'

export const remindersService = {
  // Get all reminders
  getAll: async () => {
    const response = await api.get('/reminders')
    if (response.error) {
      return { success: false, error: response.error, data: [] }
    }
    return { success: true, data: response.data }
  },

  // Get single reminder
  getById: async (id) => {
    const response = await api.get(`/reminders/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Create reminder
  create: async (reminderData) => {
    const response = await api.post('/reminders', reminderData)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Update reminder
  update: async (id, reminderData) => {
    const response = await api.put(`/reminders/${id}`, reminderData)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Delete reminder
  delete: async (id) => {
    const response = await api.delete(`/reminders/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true }
  }
}

