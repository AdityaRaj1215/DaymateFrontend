import api from './api'

export const notesService = {
  // Get all notes
  getAll: async () => {
    const response = await api.get('/api/notes')
    if (response.error) {
      return { success: false, error: response.error, data: [] }
    }
    return { success: true, data: response.data }
  },

  // Get single note
  getById: async (id) => {
    const response = await api.get(`/api/notes/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Create note
  create: async (noteData) => {
    const response = await api.post('/api/notes', noteData)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Update note
  update: async (id, noteData) => {
    const response = await api.put(`/api/notes/${id}`, noteData)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true, data: response.data }
  },

  // Delete note
  delete: async (id) => {
    const response = await api.delete(`/api/notes/${id}`)
    if (response.error) {
      return { success: false, error: response.error }
    }
    return { success: true }
  }
}

