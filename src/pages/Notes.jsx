import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Button from '../components/Button'
import LoadingSpinner from '../components/LoadingSpinner'

const Notes = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedNote, setSelectedNote] = useState(null)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
    setLoading(false)
  }, [])

  const saveNotes = (updatedNotes) => {
    setNotes(updatedNotes)
    localStorage.setItem('notes', JSON.stringify(updatedNotes))
  }

  const handleCreateNote = () => {
    setSelectedNote(null)
    setNoteTitle('')
    setNoteContent('')
    setIsEditing(true)
  }

  const handleSelectNote = (note) => {
    setSelectedNote(note)
    setNoteTitle(note.title)
    setNoteContent(note.content)
    setIsEditing(false)
  }

  const handleSaveNote = () => {
    if (!noteTitle.trim()) return

    let updatedNotes
    if (selectedNote) {
      // Update existing note
      updatedNotes = notes.map(note =>
        note.id === selectedNote.id
          ? { ...note, title: noteTitle, content: noteContent, updatedAt: new Date().toISOString() }
          : note
      )
    } else {
      // Create new note
      const newNote = {
        id: Date.now(),
        title: noteTitle,
        content: noteContent,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      updatedNotes = [...notes, newNote]
    }

    saveNotes(updatedNotes)
    setIsEditing(false)
    setSelectedNote(null)
    setNoteTitle('')
    setNoteContent('')
  }

  const handleDeleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id)
    saveNotes(updatedNotes)
    if (selectedNote && selectedNote.id === id) {
      setSelectedNote(null)
      setNoteTitle('')
      setNoteContent('')
      setIsEditing(false)
    }
  }

  const handleEditNote = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (selectedNote) {
      setNoteTitle(selectedNote.title)
      setNoteContent(selectedNote.content)
    } else {
      setNoteTitle('')
      setNoteContent('')
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
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cursor-text">Notes</h1>
            <p className="text-cursor-text-muted">Your personal notes</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={() => navigate('/tasks')}
            >
              Tasks
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                localStorage.removeItem('user')
                onLogout()
                navigate('/')
              }}
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notes List */}
          <div className="lg:col-span-1">
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-cursor-text">All Notes</h2>
                <Button variant="primary" onClick={handleCreateNote} className="text-sm">
                  + New
                </Button>
              </div>

              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-cursor-text-muted">No notes yet. Create one to get started!</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => handleSelectNote(note)}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        selectedNote?.id === note.id
                          ? 'bg-blue-600 border-blue-500'
                          : 'bg-cursor-bg border-cursor-border hover:border-cursor-text-muted'
                      }`}
                    >
                      <h3 className={`font-semibold mb-1 ${
                        selectedNote?.id === note.id ? 'text-white' : 'text-cursor-text'
                      }`}>
                        {note.title}
                      </h3>
                      <p className={`text-sm ${
                        selectedNote?.id === note.id ? 'text-blue-100' : 'text-cursor-text-muted'
                      }`}>
                        {note.content.substring(0, 50)}
                        {note.content.length > 50 ? '...' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Note Editor/Viewer */}
          <div className="lg:col-span-2">
            <Card>
              {isEditing || selectedNote ? (
                <>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Note title..."
                      className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xl font-semibold mb-3"
                      disabled={!isEditing}
                    />
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write your note here..."
                      rows={15}
                      className="w-full px-4 py-2 bg-cursor-bg border border-cursor-border rounded-md text-cursor-text placeholder-cursor-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="flex gap-3">
                    {isEditing ? (
                      <>
                        <Button variant="primary" onClick={handleSaveNote}>
                          Save
                        </Button>
                        <Button variant="secondary" onClick={handleCancel}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="primary" onClick={handleEditNote}>
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteNote(selectedNote.id)}
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-cursor-text-muted text-lg">
                    Select a note from the list or create a new one
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notes

