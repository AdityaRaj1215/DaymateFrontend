import { useState, useEffect } from 'react'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'
import Modal from '../components/Modal'
import NavMenu from '../components/NavMenu'
import { notesService } from '../services/notes'
import { tasksService } from '../services/tasks'

const Notes = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [noteTags, setNoteTags] = useState('')
  const [linkedTaskId, setLinkedTaskId] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [notesResult, tasksResult] = await Promise.all([
        notesService.getAll(),
        tasksService.getAll()
      ])
      
      if (notesResult.success) {
        setNotes(notesResult.data || [])
      }
      
      if (tasksResult.success) {
        setTasks(tasksResult.data || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setNotes([])
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNote = () => {
    setShowCreateModal(false)
    setSelectedNote(null)
    setNoteTitle('')
    setNoteContent('')
    setNoteTags('')
    setLinkedTaskId('')
    setIsEditing(true)
  }

  const handleSelectNote = (note) => {
    setSelectedNote(note)
    setNoteTitle(note.title)
    setNoteContent(note.content || '')
    setNoteTags(note.tags || '')
    setLinkedTaskId(note.linkedTaskId || '')
    setIsEditing(false)
  }

  const handleSaveNote = async () => {
    if (!noteTitle.trim()) return

    const noteData = {
      title: noteTitle.trim(),
      content: noteContent.trim() || null,
      tags: noteTags.trim() || null,
      linkedTaskId: linkedTaskId ? parseInt(linkedTaskId) : null
    }

    try {
      if (selectedNote) {
        // Update existing note
        const result = await notesService.update(selectedNote.id, noteData)
        if (result.success) {
          setNotes(notes.map(n => n.id === selectedNote.id ? result.data : n))
          setIsEditing(false)
          setSelectedNote(null)
          setNoteTitle('')
          setNoteContent('')
          setNoteTags('')
          setLinkedTaskId('')
        } else {
          alert('Failed to update note. Please try again.')
        }
      } else {
        // Create new note
        const result = await notesService.create(noteData)
        if (result.success) {
          setNotes([result.data, ...notes])
          setIsEditing(false)
          setSelectedNote(null)
          setNoteTitle('')
          setNoteContent('')
          setNoteTags('')
          setLinkedTaskId('')
        } else {
          alert('Failed to create note. Please try again.')
        }
      }
    } catch (error) {
      console.error('Error saving note:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleDeleteNote = async (id) => {
    try {
      const result = await notesService.delete(id)
      if (result.success) {
        setNotes(notes.filter(n => n.id !== id))
        if (selectedNote && selectedNote.id === id) {
          setSelectedNote(null)
          setNoteTitle('')
          setNoteContent('')
          setNoteTags('')
          setLinkedTaskId('')
          setIsEditing(false)
        }
      } else {
        alert('Failed to delete note. Please try again.')
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const handleEditNote = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (selectedNote) {
      setNoteTitle(selectedNote.title)
      setNoteContent(selectedNote.content || '')
      setNoteTags(selectedNote.tags || '')
      setLinkedTaskId(selectedNote.linkedTaskId || '')
    } else {
      setNoteTitle('')
      setNoteContent('')
      setNoteTags('')
      setLinkedTaskId('')
      setSelectedNote(null)
    }
  }

  const getLinkedTaskTitle = (taskId) => {
    if (!taskId) return null
    const task = tasks.find(t => t.id === taskId)
    return task ? task.title : null
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
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cursor-text">Notes</h1>
            <p className="text-cursor-text-muted">Your personal notes</p>
          </div>
          <NavMenu onLogout={onLogout} />
        </div>

        {/* Square Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => handleSelectNote(note)}
              className={`aspect-square bg-cursor-surface border border-cursor-border rounded-lg p-4 cursor-pointer transition-all hover:border-accent-orange hover:shadow-lg flex flex-col ${
                selectedNote?.id === note.id ? 'border-accent-orange ring-2 ring-accent-orange' : ''
              }`}
            >
              {/* Title at top in bigger font */}
              <h3 className="text-xl font-bold text-cursor-text mb-2 line-clamp-2 flex-shrink-0">
                {note.title}
              </h3>
              
              {/* Content preview */}
              <p className="text-sm text-cursor-text-muted line-clamp-4 flex-grow overflow-hidden">
                {note.content || 'No content'}
              </p>
              
              {/* Tags and linked task */}
              <div className="mt-2 flex-shrink-0 space-y-1">
                {note.tags && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.split(',').slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                {note.linkedTask && (
                  <div className="text-xs text-accent-orange">
                    📎 {note.linkedTask.title}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-cursor-text-muted text-lg">
              No notes yet. Click the + icon to create one!
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
          title="Create New Note"
        >
          <div className="space-y-4">
            <Button
              variant="primary"
              onClick={handleCreateNote}
              className="w-full py-3 text-lg"
            >
              New Note
            </Button>
          </div>
        </Modal>

        {/* Editor Modal */}
        <Modal
          isOpen={isEditing || selectedNote !== null}
          onClose={handleCancel}
          title={isEditing ? (selectedNote ? 'Edit Note' : 'Create New Note') : 'View Note'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Title *
              </label>
              <input
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                placeholder="Enter title..."
                className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!isEditing}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Content
              </label>
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Enter content..."
                rows={6}
                className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={noteTags}
                onChange={(e) => setNoteTags(e.target.value)}
                placeholder="e.g., meeting, planning, important"
                className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cursor-text mb-2">
                Link to Task (optional)
              </label>
              <select
                value={linkedTaskId}
                onChange={(e) => setLinkedTaskId(e.target.value)}
                className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!isEditing}
              >
                <option value="">No task linked</option>
                {tasks.map(task => (
                  <option key={task.id} value={task.id}>
                    {task.title}
                  </option>
                ))}
              </select>
            </div>

            {selectedNote && !isEditing && selectedNote.linkedTask && (
              <div className="p-3 bg-cursor-bg border border-cursor-border rounded-md">
                <p className="text-sm text-cursor-text-muted mb-1">Linked Task:</p>
                <p className="text-cursor-text font-medium">{selectedNote.linkedTask.title}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              {isEditing ? (
                <>
                  <Button variant="primary" onClick={handleSaveNote} className="flex-1">
                    Save
                  </Button>
                  <Button variant="secondary" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={handleEditNote} className="flex-1">
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteNote(selectedNote.id)}
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
