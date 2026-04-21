/**
 * Minimal SVG icon set (avoids external icon libraries).
 * All icons are 20x20 viewBox, currentColor fill/stroke.
 */

const base = 'w-5 h-5'

export const Icons = {
  Dashboard: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  ),
  Recipe: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 3h8a1 1 0 011 1v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
      <path d="M8 7h4M8 10h4M8 13h3" strokeLinecap="round" />
    </svg>
  ),
  Inventory: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 7l7-4 7 4v6l-7 4-7-4V7z" strokeLinejoin="round" />
      <path d="M3 7l7 4 7-4M10 11v7" />
    </svg>
  ),
  Plating: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="7" />
      <circle cx="10" cy="10" r="3.5" />
    </svg>
  ),
  Print: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 4h8v4H6V4zM4 8h12v6h-2v3H6v-3H4V8z" strokeLinejoin="round" />
      <circle cx="14" cy="11" r="0.5" fill="currentColor" />
    </svg>
  ),
  Sun: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="10" cy="10" r="3" />
      <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.5 1.5M14 14l1.5 1.5M4.5 15.5L6 14M14 6l1.5-1.5" strokeLinecap="round" />
    </svg>
  ),
  Moon: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M16 11.5A6.5 6.5 0 018.5 4a6.5 6.5 0 100 13 6.5 6.5 0 007.5-5.5z" />
    </svg>
  ),
  Menu: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M3 6h14M3 10h14M3 14h14" />
    </svg>
  ),
  Close: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  ),
  Check: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10l4 4 8-8" />
    </svg>
  ),
  Plus: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M10 4v12M4 10h12" />
    </svg>
  ),
  Minus: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M4 10h12" />
    </svg>
  ),
  Trash: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h12M8 6V4h4v2M6 6l1 10h6l1-10" />
    </svg>
  ),
  Alert: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3l8 14H2L10 3z" />
      <path d="M10 8v4M10 14.5v.5" strokeWidth="2" />
    </svg>
  ),
  Reset: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 10a6 6 0 1010-4" />
      <path d="M4 4v4h4" />
    </svg>
  ),
  Clock: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 6v4l3 2" />
    </svg>
  ),
  ChevronLeft: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 4l-6 6 6 6" />
    </svg>
  ),
  IceCream: ({ className = '' }) => (
    <svg className={`${base} ${className}`} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M6 8a4 4 0 118 0" />
      <path d="M5 9h10l-5 8-5-8z" />
    </svg>
  ),
}
