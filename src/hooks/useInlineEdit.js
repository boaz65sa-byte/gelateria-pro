import { useState, useRef, useEffect } from 'react'

/**
 * useInlineEdit — generic hook for click-to-edit text fields.
 *
 * Usage:
 *   const { editing, value, startEdit, handleChange, handleCommit, handleKeyDown, inputRef } = useInlineEdit(initialValue, onSave)
 */
export function useInlineEdit(initialValue, onSave) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef(null)

  useEffect(() => { setValue(initialValue) }, [initialValue])
  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  const startEdit = () => { setValue(initialValue); setEditing(true) }

  const handleCommit = () => {
    setEditing(false)
    const trimmed = String(value).trim()
    if (trimmed !== String(initialValue).trim() && trimmed !== '') {
      onSave(trimmed)
    }
  }

  const handleKeyDown = e => {
    if (e.key === 'Enter')  handleCommit()
    if (e.key === 'Escape') { setEditing(false); setValue(initialValue) }
  }

  return { editing, value, startEdit, handleChange: e => setValue(e.target.value), handleCommit, handleKeyDown, inputRef }
}
