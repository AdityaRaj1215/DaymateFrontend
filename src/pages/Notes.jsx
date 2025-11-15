import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import NavMenu from '../components/NavMenu'

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
    // Load notes and reminders from localStorage
    const savedNotes = localStorage.getItem('notes')
    const savedReminders = localStorage.getItem('reminders')
    
    const notes = savedNotes ? JSON.parse(savedNotes) : []
    const reminders = savedReminders ? JSON.parse(savedReminders) : []
    
    // Combine and sort by creation date
    const allItems = [...notes, ...reminders].sort((a, b) => 
      new Date(b.createdAt || b.reminderDate) - new Date(a.createdAt || a.reminderDate)
    )
    
    setItems(allItems)
    setLoading(false)
  }, [])

  const saveItems = (updatedItems, type) => {
    const notes = updatedItems.filter(item => item.type === 'note' || !item.type)
    const reminders = updatedItems.filter(item => item.type === 'reminder')
    
    localStorage.setItem('notes', JSON.stringify(notes))
    localStorage.setItem('reminders', JSON.stringify(reminders))
    
    const allItems = [...notes, ...reminders].sort((a, b) => 
      new Date(b.createdAt || b.reminderDate) - new Date(a.createdAt || a.reminderDate)
    )
    setItems(allItems)
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

  const handleSaveItem = () => {
    if (!itemTitle.trim()) return

    let updatedItems
    const isReminder = isCreatingReminder || selectedItem?.type === 'reminder'
    
    if (selectedItem) {
      // Update existing item
      updatedItems = items.map(item => {
        if (item.id === selectedItem.id) {
          return {
            ...item,
            title: itemTitle,
            content: itemContent,
            type: isReminder ? 'reminder' : 'note',
            reminderDate: isReminder ? reminderDate : undefined,
            reminderTime: isReminder ? reminderTime : undefined,
            updatedAt: new Date().toISOString()
          }
        }
        return item
      })
    } else {
      // Create new item
      const newItem = {
        id: Date.now(),
        title: itemTitle,
        content: itemContent,
        type: isReminder ? 'reminder' : 'note',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      if (isReminder) {
        newItem.reminderDate = reminderDate
        newItem.reminderTime = reminderTime
      }
      
      updatedItems = [...items, newItem]
    }

    saveItems(updatedItems)
    setIsEditing(false)
    setSelectedItem(null)
    setItemTitle('')
    setItemContent('')
    setReminderDate('')
    setReminderTime('')
    setIsCreatingReminder(false)
  }

  const handleDeleteItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id)
    saveItems(updatedItems)
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null)
      setItemTitle('')
      setItemContent('')
      setReminderDate('')
      setReminderTime('')
      setIsEditing(false)
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
