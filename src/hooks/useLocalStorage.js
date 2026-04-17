import { useState, useEffect } from 'react'

/**
 * useLocalStorage — React state that persists to localStorage automatically.
 * Usage:  const [value, setValue] = useLocalStorage('myKey', defaultValue)
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch (err) {
      console.warn(`useLocalStorage read error for "${key}":`, err)
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (err) {
      console.warn(`useLocalStorage write error for "${key}":`, err)
    }
  }, [key, value])

  return [value, setValue]
}
