const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-cursor-surface border border-cursor-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-2xl font-bold text-cursor-text mb-4">{title}</h2>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal


