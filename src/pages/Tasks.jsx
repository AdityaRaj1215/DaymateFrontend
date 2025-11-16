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
  const [newTask, setNewTask] = useState('')
  const [newDeadlineDate, setNewDeadlineDate] = useState('')
  const [newDeadlineTime, setNewDeadlineTime] = useState('')

  const [editingTask, setEditingTask] = useState(null)
  const [editText, setEditText] = useState('')
  const [editDeadlineDate, setEditDeadlineDate] = useState('')
  const [editDeadlineTime, setEditDeadlineTime] = useState('')

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
        // Fallback to empty array
        setTasks([])
      }
    } catch (error) {
      console.error('Error loading tasks:', error)
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const taskData = {
      text: newTask.trim(),
      completed: false,
      deadlineDate: newDeadlineDate || null,
      deadlineTime: newDeadlineTime || null,
    }

    try {
      const result = await tasksService.create(taskData)
      if (result.success) {
        setTasks([...tasks, result.data])
        setNewTask('')
        setNewDeadlineDate('')
        setNewDeadlineTime('')
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
      const result = await tasksService.update(id, { completed: !task.completed })
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
    setEditText(task.text || '')
    setEditDeadlineDate(task.deadlineDate || '')
    setEditDeadlineTime(task.deadlineTime || '')
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
    setEditText('')
    setEditDeadlineDate('')
    setEditDeadlineTime('')
  }

  const handleSaveEdit = async () => {
    if (!editingTask) return

    const updateData = {
      text: editText,
      completed: editingTask.completed,
      deadlineDate: editDeadlineDate || null,
      deadlineTime: editDeadlineTime || null,
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
          <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="flex flex-col sm:flex-row gap-3 md:w-auto">
              <input
                type="date"
                value={newDeadlineDate}
                onChange={(e) => setNewDeadlineDate(e.target.value)}
                className="px-3 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="time"
                value={newDeadlineTime}
                onChange={(e) => setNewDeadlineTime(e.target.value)}
                className="px-3 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button type="submit" variant="primary">
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
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-5 h-5 rounded border-cursor-border text-blue-600 focus:ring-blue-500"
                    />
                    <span
                      className={`flex-1 text-cursor-text ${
                        task.completed ? 'line-through text-cursor-text-muted' : ''
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  {(task.deadlineDate || task.deadlineTime) && (
                    <div className="text-sm text-cursor-text-muted">
                      Deadline:{' '}
                      <span className="text-cursor-text">
                        {task.deadlineDate || ''}{' '}
                        {task.deadlineTime || ''}
                      </span>
                    </div>
                  )}
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
              Task
            </label>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Update task text..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Deadline Date
              </label>
              <input
                type="date"
                value={editDeadlineDate}
                onChange={(e) => setEditDeadlineDate(e.target.value)}
                className="w-full px-3 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Deadline Time
              </label>
              <input
                type="time"
                value={editDeadlineTime}
                onChange={(e) => setEditDeadlineTime(e.target.value)}
                className="w-full px-3 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
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

