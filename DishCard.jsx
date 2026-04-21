/**
 * Format helpers in Hebrew locale
 */
export const formatTime = (dateOrIso) => {
  const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso
  return d.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

export const formatDate = (dateOrIso) => {
  const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export const formatDateTime = (dateOrIso) => {
  const d = typeof dateOrIso === 'string' ? new Date(dateOrIso) : dateOrIso
  return `${formatDate(d)} · ${formatTime(d)}`
}

export const todayKey = () => new Date().toISOString().slice(0, 10)
