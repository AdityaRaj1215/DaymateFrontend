import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Button from './Button'

const NavMenu = ({ onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleNavigate = (path) => {
    navigate(path)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md border border-cursor-border bg-cursor-surface hover:bg-cursor-border text-cursor-text transition-colors"
        aria-label="Navigation menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-cursor-surface border border-cursor-border rounded-lg shadow-lg z-50">
          <div className="py-2">
            <button
              onClick={() => handleNavigate('/tasks')}
              className={`w-full text-left px-4 py-2 text-cursor-text hover:bg-cursor-bg transition-colors ${
                location.pathname === '/tasks' ? 'bg-cursor-bg text-accent-orange' : ''
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => handleNavigate('/notes')}
              className={`w-full text-left px-4 py-2 text-cursor-text hover:bg-cursor-bg transition-colors ${
                location.pathname === '/notes' ? 'bg-cursor-bg text-accent-orange' : ''
              }`}
            >
              Notes
            </button>
            <div className="border-t border-cursor-border my-2"></div>
            <button
              onClick={() => {
                localStorage.removeItem('user')
                onLogout()
                navigate('/')
              }}
              className="w-full text-left px-4 py-2 text-cursor-text hover:bg-cursor-bg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavMenu

