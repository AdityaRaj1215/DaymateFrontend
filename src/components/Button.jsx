const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-cursor-bg disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 active:bg-blue-800',
    secondary: 'bg-cursor-surface hover:bg-cursor-border text-cursor-text border border-cursor-border focus:ring-gray-500 active:bg-gray-700',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 active:bg-green-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 active:bg-red-800',
    outline: 'bg-transparent border border-cursor-border text-cursor-text hover:bg-cursor-surface hover:border-gray-500 focus:ring-gray-500 active:bg-gray-800',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button


