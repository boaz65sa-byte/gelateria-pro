import { useState, useCallback } from 'react'

/**
 * useModal — manages open/close state and optional payload.
 *
 * Returns:
 *   isOpen    — boolean
 *   data      — whatever was passed to open()
 *   open(d)   — open with optional payload
 *   close()   — close and clear payload
 */
export function useModal(initial = false) {
  const [state, setState] = useState({ isOpen: initial, data: null })
  const open  = useCallback(data => setState({ isOpen: true,  data: data ?? null }), [])
  const close = useCallback(()   => setState({ isOpen: false, data: null }), [])
  return { isOpen: state.isOpen, data: state.data, open, close }
}
