import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import NavMenu from '../components/NavMenu'
import Modal from '../components/Modal'
import { tasksService } from '../services/tasks'

const Tasks = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newUrgency, setNewUrgency] = useState('MEDIUM')

  const [editingTask, setEditingTask] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [editUrgency, setEditUrgency] = useState('MEDIUM')

  useEffect(() => {
    loadTasks()
  }, [])

  const loadTasks = async () => {
    setLoading(true)
    try {
      const result = await tasksService.getAll()
      if (result.success) {
        setTasks(result.data || [])
      } else {
        console.error('Failed to load tasks:', result.error)
        setTasks([])
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  // Convert ISO date to local date-time inputs
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return ''
    const date = new Date(isoDate)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  // Convert date-time input to ISO format
  const formatDateToISO = (dateTimeString) => {
    if (!dateTimeString) return null
    return new Date(dateTimeString).toISOString()
  }

  // Format date for display
  const formatDateForDisplay = (isoDate) => {
    if (!isoDate) return 'No deadline'
    const date = new Date(isoDate)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    const taskData = {
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      dueDate: formatDateToISO(newDueDate),
      urgency: newUrgency || 'MEDIUM'
    }

    try {
      const result = await tasksService.create(taskData)
      if (result.success) {
        setTasks([...tasks, result.data])
        setNewTitle('')
        setNewDescription('')
        setNewDueDate('')
        setNewUrgency('MEDIUM')
      } else {
        console.error('Failed to create task:', result.error)
        alert('Failed to create task. Please try again.')
      }
    } catch (error) {
      console.error('Error creating task:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleToggleTask = async (id) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return

    try {
      const result = await tasksService.complete(id)
      if (result.success) {
        setTasks(tasks.map(t => t.id === id ? result.data : t))
      } else {
        console.error('Failed to update task:', result.error)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      const result = await tasksService.delete(id)
      if (result.success) {
        setTasks(tasks.filter(t => t.id !== id))
      } else {
        console.error('Failed to delete task:', result.error)
        alert('Failed to delete task. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting task:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleOpenEdit = (task) => {
    setEditingTask(task)
    setEditTitle(task.title || '')
    setEditDescription(task.description || '')
    setEditDueDate(formatDateForInput(task.dueDate))
    setEditUrgency(task.urgency || 'MEDIUM')
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setEditTitle('')
    setEditDescription('')
    setEditDueDate('')
    setEditUrgency('MEDIUM')
  }

  const handleSaveEdit = async () => {
    if (!editingTask || !editTitle.trim()) return

    const updateData = {
      title: editTitle.trim(),
      description: editDescription.trim() || null,
      dueDate: formatDateToISO(editDueDate),
      urgency: editUrgency || 'MEDIUM'
    }

    try {
      const result = await tasksService.update(editingTask.id, updateData)
      if (result.success) {
        setTasks(tasks.map(t => (t.id === editingTask.id ? result.data : t)))
        handleCancelEdit()
      } else {
        alert('Failed to update task. Please try again.')
      }
    } catch (error) {
      console.error('Error updating task:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'HIGH':
        return 'text-red-400'
      case 'MEDIUM':
        return 'text-yellow-400'
      case 'LOW':
        return 'text-green-400'
      default:
        return 'text-cursor-text-muted'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cursor-text">Tasks</h1>
            <p className="text-cursor-text-muted">Welcome back, {user?.name || 'User'}</p>
          </div>
          <NavMenu onLogout={onLogout} />
        </div>

        {/* Add Task Form */}
        <Card className="mb-6">
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Task title (required)"
                className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="datetime-local"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <select
                  value={newUrgency}
                  onChange={(e) => setNewUrgency(e.target.value)}
                  className="w-full px-3 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="LOW">Low Urgency</option>
                  <option value="MEDIUM">Medium Urgency</option>
                  <option value="HIGH">High Urgency</option>
                </select>
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full">
              Add Task
            </Button>
          </form>
        </Card>

        {/* Tasks List */}
        <Card>
          <h2 className="text-xl font-semibold text-cursor-text mb-4">Your Tasks</h2>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-cursor-text-muted text-lg">No tasks yet. Add one above to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col gap-2 p-4 bg-cursor-bg border border-cursor-border rounded-md hover:border-cursor-text-muted transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed || false}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-5 h-5 rounded border-cursor-border text-blue-600 focus:ring-blue-500 mt-1"
                    />
                    <div className="flex-1">
                      <h3
                        className={`text-lg font-semibold text-cursor-text ${
                          task.completed ? 'line-through text-cursor-text-muted' : ''
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className={`text-sm text-cursor-text-muted mt-1 ${
                          task.completed ? 'line-through' : ''
                        }`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                        {task.dueDate && (
                          <span className="text-cursor-text-muted">
                            Due: <span className="text-cursor-text">{formatDateForDisplay(task.dueDate)}</span>
                          </span>
                        )}
                        {task.urgency && (
                          <span className={`font-medium ${getUrgencyColor(task.urgency)}`}>
                            {task.urgency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleOpenEdit(task)}
                      className="px-3 py-1 text-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDeleteTask(task.id)}
                      className="px-3 py-1 text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editingTask}
        onClose={handleCancelEdit}
        title="Edit Task"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-cursor-text mb-2">
              Title *
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Task title"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-cursor-text mb-2">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Task description"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Due Date & Time
              </label>
              <input
                type="datetime-local"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Urgency
              </label>
              <select
                value={editUrgency}
                onChange={(e) => setEditUrgency(e.target.value)}
                className="w-full px-3 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" onClick={handleSaveEdit} className="flex-1">
              Save
            </Button>
            <Button variant="secondary" onClick={handleCancelEdit} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Tasks
