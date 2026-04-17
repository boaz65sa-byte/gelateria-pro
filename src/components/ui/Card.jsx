export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div className={`${hover ? 'card-hover' : 'card'} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 pb-4 border-b border-charcoal-50 dark:border-charcoal-700 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return <h2 className={`text-xl font-serif font-semibold ${className}`}>{children}</h2>
}

export function CardSubtitle({ children, className = '' }) {
  return <p className={`text-sm text-charcoal-500 dark:text-charcoal-200 mt-1 ${className}`}>{children}</p>
}
