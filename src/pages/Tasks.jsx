import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import NavMenu from '../components/NavMenu'
import { tasksService } from '../services/tasks'

const Tasks = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')

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
      completed: false
    }

    try {
      const result = await tasksService.create(taskData)
      if (result.success) {
        setTasks([...tasks, result.data])
        setNewTask('')
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
          <form onSubmit={handleAddTask} className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
                  className="flex items-center gap-3 p-4 bg-cursor-bg border border-cursor-border rounded-md hover:border-cursor-text-muted transition-colors"
                >
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
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteTask(task.id)}
                    className="px-3 py-1 text-sm"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Tasks

