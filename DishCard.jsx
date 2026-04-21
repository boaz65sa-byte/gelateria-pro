export function Button({ children, variant = 'secondary', className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost',
  }
  return (
    <button className={`${variants[variant] || variants.secondary} ${className}`} {...props}>
      {children}
    </button>
  )
}
