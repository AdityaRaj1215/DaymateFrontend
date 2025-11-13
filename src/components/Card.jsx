const Card = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-cursor-surface border border-cursor-border rounded-lg p-6 ${className}`}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-cursor-text">{title}</h3>
          {subtitle && (
            <p className="text-sm text-cursor-text-muted mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card


