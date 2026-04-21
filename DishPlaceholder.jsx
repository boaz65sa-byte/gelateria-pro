import { useEffect } from 'react'
import { Icons } from './Icons.jsx'

/**
 * Modal — centered popup overlay used throughout the app.
 *
 * Props:
 *   isOpen    — boolean
 *   onClose   — called on backdrop click or × button
 *   title     — string header
 *   size      — 'sm' | 'md' | 'lg' (default 'md')
 *   children  — modal body
 *   footer    — optional footer slot (buttons etc.)
 */
export function Modal({ isOpen, onClose, title, size = 'md', children, footer }) {
  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-espresso-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${widths[size]} bg-white dark:bg-espresso-800
                    rounded-2xl border border-silk dark:border-espresso-600
                    shadow-2xl flex flex-col max-h-[90vh]`}
        style={{ boxShadow: '0 24px 64px rgba(90,60,30,0.18), 0 4px 16px rgba(90,60,30,0.10)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-silk dark:border-espresso-700 flex-shrink-0">
          <h2 className="font-serif font-bold text-xl text-espresso-800 dark:text-espresso-50">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-linen dark:hover:bg-espresso-700 text-espresso-400 transition"
            aria-label="סגור"
          >
            <Icons.Close className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 pb-5 pt-4 border-t border-silk dark:border-espresso-700 flex justify-end gap-2 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
