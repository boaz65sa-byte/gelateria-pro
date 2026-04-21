import { useInlineEdit } from '../../hooks/useInlineEdit.js'

/**
 * InlineEdit — renders text normally; on click shows an input.
 *
 * Props:
 *   value       — current string value
 *   onSave      — called with new string when committed
 *   className   — extra classes on the text span
 *   inputClass  — extra classes on the input
 *   as          — tag for the text wrapper ('span' | 'p' | 'h2' etc.)
 *   placeholder — placeholder for the input
 *   type        — input type ('text' | 'number')
 *   showPencil  — show pencil icon on hover (default true)
 */
export function InlineEdit({
  value,
  onSave,
  className = '',
  inputClass = '',
  as: Tag = 'span',
  placeholder = 'ערוך...',
  type = 'text',
  showPencil = true,
}) {
  const { editing, value: val, startEdit, handleChange, handleCommit, handleKeyDown, inputRef } =
    useInlineEdit(value, onSave)

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        value={val}
        onChange={handleChange}
        onBlur={handleCommit}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`bg-terra-50 dark:bg-terra-900/20 border border-terra-300 dark:border-terra-600
                    rounded-lg px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-terra-400
                    w-full font-sans ${inputClass}`}
      />
    )
  }

  return (
    <Tag
      onClick={startEdit}
      title="לחץ לעריכה"
      className={`group cursor-pointer inline-flex items-center gap-1.5 hover:text-terra-600 dark:hover:text-terra-300 transition-colors ${className}`}
    >
      {value || <span className="text-espresso-300 italic">ריק</span>}
      {showPencil && (
        <svg className="w-3 h-3 opacity-0 group-hover:opacity-50 flex-shrink-0 transition-opacity"
             fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 14 14">
          <path d="M9.5 1.5l3 3-7 7H2.5v-3l7-7z" strokeLinejoin="round"/>
        </svg>
      )}
    </Tag>
  )
}
