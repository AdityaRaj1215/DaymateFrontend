import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import NavMenu from '../components/NavMenu'
import { notesService } from '../services/notes'
import { remindersService } from '../services/reminders'

const Notes = ({ user, onLogout }) => {
  const [items, setItems] = useState([]) // Combined notes and reminders
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemTitle, setItemTitle] = useState('')
  const [itemContent, setItemContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [reminderDate, setReminderDate] = useState('')
  const [reminderTime, setReminderTime] = useState('')
  const [isCreatingReminder, setIsCreatingReminder] = useState(false)

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    try {
      const [notesResult, remindersResult] = await Promise.all([
        notesService.getAll(),
        remindersService.getAll()
      ])
      
      const notes = notesResult.success ? notesResult.data.map(n => ({ ...n, type: 'note' })) : []
      const reminders = remindersResult.success ? remindersResult.data.map(r => ({ ...r, type: 'reminder' })) : []
      
      // Combine and sort by creation date
      const allItems = [...notes, ...reminders].sort((a, b) => 
        new Date(b.createdAt || b.reminderDate) - new Date(a.createdAt || a.reminderDate)
      )
      
      setItems(allItems)
    } catch (error) {
      console.error('Error loading items:', error)
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = () => {
    setShowCreateModal(false)
    setSelectedItem(null)
    setItemTitle('')
    setItemContent('')
    setReminderDate('')
    setReminderTime('')
    setIsCreatingReminder(false)
    setIsEditing(true)
  }

  const handleCreateReminder = () => {
    setShowCreateModal(false)
    setSelectedItem(null)
    setItemTitle('')
    setItemContent('')
    setReminderDate('')
    setReminderTime('')
    setIsCreatingReminder(true)
    setIsEditing(true)
  }

  const handleSelectItem = (item) => {
    setSelectedItem(item)
    setItemTitle(item.title)
    setItemContent(item.content || '')
    setReminderDate(item.reminderDate || '')
    setReminderTime(item.reminderTime || '')
    setIsCreatingReminder(item.type === 'reminder')
    setIsEditing(false)
  }

  const handleSaveItem = async () => {
    if (!itemTitle.trim()) return

    const isReminder = isCreatingReminder || selectedItem?.type === 'reminder'
    
    try {
      if (selectedItem) {
        // Update existing item
        const updateData = {
          title: itemTitle,
          content: itemContent
        }
        
        if (isReminder) {
          updateData.reminderDate = reminderDate
          updateData.reminderTime = reminderTime
        }
        
        const result = isReminder 
          ? await remindersService.update(selectedItem.id, updateData)
          : await notesService.update(selectedItem.id, updateData)
        
        if (result.success) {
          const updatedItem = { ...result.data, type: isReminder ? 'reminder' : 'note' }
          setItems(items.map(item => item.id === selectedItem.id ? updatedItem : item))
          setIsEditing(false)
          setSelectedItem(null)
          setItemTitle('')
          setItemContent('')
          setReminderDate('')
          setReminderTime('')
          setIsCreatingReminder(false)
        } else {
          alert('Failed to update. Please try again.')
        }
      } else {
        // Create new item
        const createData = {
          title: itemTitle,
          content: itemContent
        }
        
        if (isReminder) {
          createData.reminderDate = reminderDate
          createData.reminderTime = reminderTime
        }
        
        const result = isReminder
          ? await remindersService.create(createData)
          : await notesService.create(createData)
        
        if (result.success) {
          const newItem = { ...result.data, type: isReminder ? 'reminder' : 'note' }
          setItems([newItem, ...items])
          setIsEditing(false)
          setSelectedItem(null)
          setItemTitle('')
          setItemContent('')
          setReminderDate('')
          setReminderTime('')
          setIsCreatingReminder(false)
        } else {
          alert('Failed to create. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error saving item:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleDeleteItem = async (id) => {
    const item = items.find(i => i.id === id)
    if (!item) return

    try {
      const result = item.type === 'reminder'
        ? await remindersService.delete(id)
        : await notesService.delete(id)
      
      if (result.success) {
        setItems(items.filter(i => i.id !== id))
        if (selectedItem && selectedItem.id === id) {
          setSelectedItem(null)
          setItemTitle('')
          setItemContent('')
          setReminderDate('')
          setReminderTime('')
          setIsEditing(false)
        }
      } else {
        alert('Failed to delete. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleEditItem = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (selectedItem) {
      setItemTitle(selectedItem.title)
      setItemContent(selectedItem.content || '')
      setReminderDate(selectedItem.reminderDate || '')
      setReminderTime(selectedItem.reminderTime || '')
      setIsCreatingReminder(selectedItem.type === 'reminder')
    } else {
      setItemTitle('')
      setItemContent('')
      setReminderDate('')
      setReminderTime('')
      setIsCreatingReminder(false)
      setSelectedItem(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const notes = items.filter(item => item.type !== 'reminder')
  const reminders = items.filter(item => item.type === 'reminder')
  const allItems = [...notes, ...reminders]

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cursor-text">Notes & Reminders</h1>
            <p className="text-cursor-text-muted">Your personal notes and reminders</p>
          </div>
          <NavMenu onLogout={onLogout} />
        </div>

        {/* Square Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {allItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectItem(item)}
              className={`aspect-square bg-cursor-surface border border-cursor-border rounded-lg p-4 cursor-pointer transition-all hover:border-accent-orange hover:shadow-lg flex flex-col ${
                selectedItem?.id === item.id ? 'border-accent-orange ring-2 ring-accent-orange' : ''
              }`}
            >
              {/* Title at top in bigger font */}
              <h3 className="text-xl font-bold text-cursor-text mb-2 line-clamp-2 flex-shrink-0">
                {item.title}
              </h3>
              
              {/* Content preview */}
              <p className="text-sm text-cursor-text-muted line-clamp-4 flex-grow overflow-hidden">
                {item.content || (item.type === 'reminder' ? `Reminder: ${item.reminderDate} ${item.reminderTime}` : '')}
              </p>
              
              {/* Type indicator */}
              {item.type === 'reminder' && (
                <div className="mt-2 flex-shrink-0">
                  <span className="text-xs bg-accent-orange/20 text-accent-orange px-2 py-1 rounded">
                    Reminder
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {allItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-cursor-text-muted text-lg">
              No notes or reminders yet. Click the + icon to create one!
            </p>
          </div>
        )}

        {/* Floating Action Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-accent-orange hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl font-bold transition-all hover:scale-110 z-40"
        >
          +
        </button>

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New"
        >
          <div className="space-y-4">
            <Button
              variant="primary"
              onClick={handleCreateNote}
              className="w-full py-3 text-lg"
            >
              New Note
            </Button>
            <Button
              variant="outline"
              onClick={handleCreateReminder}
              className="w-full py-3 text-lg"
            >
              New Reminder
            </Button>
          </div>
        </Modal>

        {/* Editor Modal */}
        <Modal
          isOpen={isEditing || selectedItem !== null}
          onClose={handleCancel}
          title={isEditing ? (selectedItem ? 'Edit' : 'Create New') : 'View'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Title
              </label>
              <input
                type="text"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Content
              </label>
              <textarea
                value={itemContent}
                onChange={(e) => setItemContent(e.target.value)}
                placeholder="Enter content..."
                rows={6}
                className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={!isEditing}
              />
            </div>

            {/* Reminder fields - show if creating reminder or editing a reminder */}
            {(isCreatingReminder || selectedItem?.type === 'reminder') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-cursor-text mb-2">
                    Reminder Date
                  </label>
                  <input
                    type="date"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-cursor-text mb-2">
                    Reminder Time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={!isEditing}
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button variant="primary" onClick={handleSaveItem} className="flex-1">
                    Save
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={handleEditItem} className="flex-1">
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteItem(selectedItem.id)}
                    className="flex-1"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default Notes
