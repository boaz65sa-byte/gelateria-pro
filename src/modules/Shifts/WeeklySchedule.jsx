import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { openWhatsApp, buildShiftMessage, cleanPhone } from '../../utils/whatsapp.js'

const DAYS = [
  { id: 'sun', label: 'ראשון', short: 'א׳' },
  { id: 'mon', label: 'שני',   short: 'ב׳' },
  { id: 'tue', label: 'שלישי',short: 'ג׳' },
  { id: 'wed', label: 'רביעי',short: 'ד׳' },
  { id: 'thu', label: 'חמישי',short: 'ה׳' },
  { id: 'fri', label: 'שישי', short: 'ו׳' },
  { id: 'sat', label: 'שבת',  short: 'ש׳' },
]

const SHIFT_SLOTS = [
  { id: 'morning', label: 'בוקר',   hours: '07:00–15:00', color: 'amber'  },
  { id: 'noon',    label: 'צהריים', hours: '12:00–20:00', color: 'terra'  },
  { id: 'evening', label: 'ערב',    label2: 'ערב', hours: '16:00–00:00', color: 'violet' },
  { id: 'closed',  label: 'סגור',   hours: '',             color: 'gray'   },
]

const SLOT_STYLES = {
  amber:  { bg: 'bg-amber-50 dark:bg-amber-900/20',   border: 'border-amber-200 dark:border-amber-700',   text: 'text-amber-700 dark:text-amber-300',   dot: 'bg-amber-400' },
  terra:  { bg: 'bg-terra-50 dark:bg-terra-900/20',   border: 'border-terra-200 dark:border-terra-700',   text: 'text-terra-700 dark:text-terra-300',   dot: 'bg-terra-400' },
  violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-700', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-400' },
  gray:   { bg: 'bg-canvas dark:bg-espresso-800',     border: 'border-silk dark:border-espresso-600',     text: 'text-espresso-400',                    dot: 'bg-espresso-300' },
}

const WA_ICON = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// get week string key e.g. "2026-W17"
function getWeekKey(offset = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offset * 7)
  const jan1 = new Date(d.getFullYear(), 0, 1)
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)
  return `${d.getFullYear()}-W${String(week).padStart(2,'0')}`
}

// get Sunday of current week + offset
function getWeekDates(offset = 0) {
  const today = new Date()
  const sun = new Date(today)
  sun.setDate(today.getDate() - today.getDay() + offset * 7)
  return DAYS.map((_, i) => {
    const d = new Date(sun)
    d.setDate(sun.getDate() + i)
    return d
  })
}

function formatShortDate(date) {
  return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' })
}

function formatFullDate(date) {
  return date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })
}

// Default empty schedule: { dayId: { shiftId: [workerId, ...] } }
function emptySchedule() {
  const s = {}
  DAYS.forEach(d => {
    s[d.id] = {}
    SHIFT_SLOTS.forEach(sh => { s[d.id][sh.id] = [] })
  })
  return s
}

export function WeeklySchedule({ workers, tasks }) {
  const [weekOffset, setWeekOffset] = useState(0)
  const weekKey = getWeekKey(weekOffset)
  const weekDates = useMemo(() => getWeekDates(weekOffset), [weekOffset])

  const [schedules, setSchedules] = useLocalStorage('gelateria-weekly-schedules', {})
  const schedule = schedules[weekKey] || emptySchedule()

  const assignModal = useModal()
  const [assignTarget, setAssignTarget] = useState(null) // { dayId, shiftId }
  const [printMode, setPrintMode] = useState(false)
  const [notesDraft, setNotesDraft] = useState('')

  const weekNotes = (schedules[weekKey + '_notes']) || ''

  const setSchedule = (updater) => {
    setSchedules(prev => ({
      ...prev,
      [weekKey]: updater(prev[weekKey] || emptySchedule())
    }))
  }

  const openAssign = (dayId, shiftId) => {
    setAssignTarget({ dayId, shiftId })
    assignModal.open()
  }

  const toggleWorker = (workerId) => {
    if (!assignTarget) return
    const { dayId, shiftId } = assignTarget
    setSchedule(prev => {
      const current = (prev[dayId]?.[shiftId] || [])
      const updated = current.includes(workerId)
        ? current.filter(id => id !== workerId)
        : [...current, workerId]
      return { ...prev, [dayId]: { ...(prev[dayId] || {}), [shiftId]: updated } }
    })
  }

  const setDayClosed = (dayId) => {
    setSchedule(prev => ({
      ...prev,
      [dayId]: Object.fromEntries(SHIFT_SLOTS.map(s => [s.id, []]))
    }))
    SHIFT_SLOTS.filter(s => s.id !== 'closed').forEach(s => {
      setSchedule(prev => ({ ...prev, [dayId]: { ...(prev[dayId] || {}), [s.id]: [] } }))
    })
  }

  const copyToNext = () => {
    if (!window.confirm('להעתיק את הסידור השבוע לשבוע הבא?')) return
    const nextKey = getWeekKey(weekOffset + 1)
    setSchedules(prev => ({ ...prev, [nextKey]: { ...(prev[weekKey] || emptySchedule()) } }))
  }

  const clearWeek = () => {
    if (!window.confirm('לנקות את הסידור של השבוע?')) return
    setSchedules(prev => ({ ...prev, [weekKey]: emptySchedule() }))
  }

  const exportCSV = () => {
    const rows = [['יום', 'תאריך', 'בוקר 07-15', 'צהריים 12-20', 'ערב 16-00']]
    DAYS.forEach((day, di) => {
      const daySchedule = schedule[day.id] || {}
      const cols = SHIFT_SLOTS.filter(s => s.id !== 'closed').map(slot => {
        const assigned = (daySchedule[slot.id] || [])
          .map(id => workers.find(w => w.id === id)?.name)
          .filter(Boolean)
          .join(' + ')
        return assigned || '—'
      })
      rows.push([day.label, formatShortDate(weekDates[di]), ...cols])
    })
    const csv = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n')
    const bom  = '\uFEFF' // UTF-8 BOM for Excel Hebrew support
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    a.download = `סידור-${weekKey}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const saveNotes = () => {
    setSchedules(prev => ({ ...prev, [weekKey + '_notes']: notesDraft }))
  }

  // send full week schedule to a worker via WhatsApp
  const sendWorkerWeek = (worker) => {
    if (!cleanPhone(worker.phone)) {
      alert(`לעובד ${worker.name} אין מספר WhatsApp. ערוך את פרטיו תחת "עובד".`)
      return
    }
    const lines = [
      `🗓 *The Sweet Station — סידור שבועי*`,
      ``,
      `שלום ${worker.name}!`,
      ``,
      `*שבוע ${weekKey.split('W')[1]}:*`,
      `${formatShortDate(weekDates[0])} – ${formatShortDate(weekDates[6])}`,
      ``,
    ]
    let hasShift = false
    DAYS.forEach((day, di) => {
      const daySchedule = schedule[day.id] || {}
      SHIFT_SLOTS.filter(s => s.id !== 'closed').forEach(slot => {
        const assigned = daySchedule[slot.id] || []
        if (assigned.includes(worker.id)) {
          hasShift = true
          lines.push(`📍 *${day.label}* ${formatShortDate(weekDates[di])} — ${slot.label} (${slot.hours})`)
        }
      })
    })
    if (!hasShift) {
      lines.push(`אין לך משמרות השבוע.`)
    }
    if (weekNotes) {
      lines.push(``, `📝 *הערות:* ${weekNotes}`)
    }
    lines.push(``, `בהצלחה! 💪`, `*bs-simple.com | The Sweet Station*`)
    openWhatsApp(worker.phone, lines.join('\n'))
  }

  const sendAll = () => {
    const assigned = workers.filter(w => {
      return DAYS.some(d =>
        SHIFT_SLOTS.some(s => (schedule[d.id]?.[s.id] || []).includes(w.id))
      )
    })
    if (assigned.length === 0) { alert('אין עובדים משובצים השבוע.'); return }
    const withPhone = assigned.filter(w => cleanPhone(w.phone))
    if (withPhone.length === 0) { alert('לאף עובד משובץ אין מספר WhatsApp.'); return }
    withPhone.forEach((w, i) => setTimeout(() => sendWorkerWeek(w), i * 700))
  }

  // stats
  const totalSlots = useMemo(() => {
    let count = 0
    DAYS.forEach(d => SHIFT_SLOTS.filter(s=>s.id!=='closed').forEach(s => {
      if ((schedule[d.id]?.[s.id]||[]).length > 0) count++
    }))
    return count
  }, [schedule])

  const assignedWorkerIds = useMemo(() => {
    const ids = new Set()
    DAYS.forEach(d => SHIFT_SLOTS.forEach(s => (schedule[d.id]?.[s.id]||[]).forEach(id => ids.add(id))))
    return ids
  }, [schedule])

  if (printMode) {
    return (
      <div>
        <div className="no-print flex gap-2 mb-6">
          <Button variant="primary" onClick={() => window.print()}>
            <Icons.Print className="w-4 h-4" /> הדפס
          </Button>
          <Button variant="secondary" onClick={() => setPrintMode(false)}>
            <Icons.Close className="w-4 h-4" /> חזור
          </Button>
        </div>

        <div className="mb-6 pb-4 border-b-2 border-espresso-800">
          <h1 className="text-2xl font-serif font-bold">Sweet Station — סידור עבודה שבועי</h1>
          <p className="text-sm text-espresso-400 font-sans mt-1">
            שבוע {weekKey.split('W')[1]} · {formatShortDate(weekDates[0])} – {formatShortDate(weekDates[6])}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm font-sans border-collapse">
            <thead>
              <tr>
                <th className="text-right px-3 py-2 border border-silk bg-linen font-medium w-20">משמרת</th>
                {DAYS.map((d, i) => (
                  <th key={d.id} className="text-center px-2 py-2 border border-silk bg-linen font-medium">
                    <div>{d.label}</div>
                    <div className="text-xs font-normal text-espresso-400">{formatShortDate(weekDates[i])}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SHIFT_SLOTS.filter(s => s.id !== 'closed').map(slot => (
                <tr key={slot.id}>
                  <td className="px-3 py-3 border border-silk bg-linen font-medium">
                    <div>{slot.label}</div>
                    <div className="text-xs text-espresso-400">{slot.hours}</div>
                  </td>
                  {DAYS.map(d => {
                    const assigned = (schedule[d.id]?.[slot.id] || [])
                      .map(id => workers.find(w => w.id === id)?.name)
                      .filter(Boolean)
                    return (
                      <td key={d.id} className="px-2 py-3 border border-silk text-center align-top min-w-[90px]">
                        {assigned.length > 0
                          ? assigned.map((n,i) => <div key={i} className="font-medium">{n}</div>)
                          : <span className="text-espresso-300">—</span>
                        }
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {weekNotes && (
          <div className="mt-6 p-3 bg-linen rounded-xl border border-silk">
            <p className="text-xs text-espresso-400 font-sans mb-1">הערות</p>
            <p className="text-sm font-sans">{weekNotes}</p>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-silk text-center">
          <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">

      {/* Week navigation */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={() => setWeekOffset(w => w - 1)}
            className="w-9 h-9 rounded-xl border border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 flex items-center justify-center hover:border-terra-300 transition">
            <Icons.ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
          <div className="text-center px-3">
            <p className="font-serif font-semibold text-sm">
              {weekOffset === 0 ? 'השבוע' : weekOffset === 1 ? 'שבוע הבא' : weekOffset === -1 ? 'שבוע שעבר' : `שבוע ${weekOffset > 0 ? '+' : ''}${weekOffset}`}
            </p>
            <p className="text-xs text-espresso-400 font-sans">
              {formatShortDate(weekDates[0])} – {formatShortDate(weekDates[6])}
            </p>
          </div>
          <button onClick={() => setWeekOffset(w => w + 1)}
            className="w-9 h-9 rounded-xl border border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 flex items-center justify-center hover:border-terra-300 transition">
            <Icons.ChevronLeft className="w-4 h-4" />
          </button>
          {weekOffset !== 0 && (
            <button onClick={() => setWeekOffset(0)}
              className="text-xs text-terra-400 hover:text-terra-600 font-sans transition">
              חזור להיום
            </button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={sendAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 transition">
            <WA_ICON /> שלח הכל
          </button>
          <Button variant="secondary" onClick={copyToNext} className="text-xs">העתק לשבוע הבא</Button>
          <Button variant="secondary" onClick={exportCSV} className="text-xs">📊 CSV</Button>
          <Button variant="secondary" onClick={() => setPrintMode(true)} className="text-xs">
            <Icons.Print className="w-3.5 h-3.5" /> הדפס
          </Button>
          <Button variant="ghost" onClick={clearWeek} className="text-xs p-2" title="נקה שבוע">
            <Icons.Reset className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
          <p className="text-xs text-espresso-400 font-sans mb-1">משמרות מאוישות</p>
          <p className="text-xl font-serif font-bold">{totalSlots}</p>
        </div>
        <div className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
          <p className="text-xs text-espresso-400 font-sans mb-1">עובדים משובצים</p>
          <p className="text-xl font-serif font-bold">{assignedWorkerIds.size}</p>
        </div>
        <div className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
          <p className="text-xs text-espresso-400 font-sans mb-1">שבוע</p>
          <p className="text-xl font-serif font-bold">{weekKey.split('W')[1]}</p>
        </div>
      </div>

      {/* Weekly grid */}
      <div className="card p-0 overflow-hidden">
        {/* Day headers */}
        <div className="grid border-b border-silk dark:border-espresso-700"
             style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>
          <div className="px-3 py-2.5 bg-linen dark:bg-espresso-800 border-l border-silk dark:border-espresso-700" />
          {DAYS.map((day, i) => {
            const isToday = weekDates[i].toDateString() === new Date().toDateString()
            return (
              <div key={day.id}
                className={`px-2 py-2.5 text-center border-l border-silk dark:border-espresso-700 ${
                  isToday ? 'bg-terra-50 dark:bg-terra-900/20' : 'bg-linen dark:bg-espresso-800'
                }`}>
                <p className={`text-xs font-sans font-semibold ${isToday ? 'text-terra-600 dark:text-terra-300' : 'text-espresso-600 dark:text-espresso-200'}`}>
                  {day.short}
                </p>
                <p className={`text-xs font-mono mt-0.5 ${isToday ? 'text-terra-400' : 'text-espresso-400'}`}>
                  {formatShortDate(weekDates[i])}
                </p>
                {isToday && <div className="w-1 h-1 rounded-full bg-terra-400 mx-auto mt-1" />}
              </div>
            )
          })}
        </div>

        {/* Shift rows */}
        {SHIFT_SLOTS.filter(s => s.id !== 'closed').map(slot => {
          const style = SLOT_STYLES[slot.color]
          return (
            <div key={slot.id}
              className="grid border-b border-silk dark:border-espresso-700 last:border-0"
              style={{ gridTemplateColumns: '80px repeat(7, 1fr)' }}>

              {/* Shift label */}
              <div className="px-2 py-3 border-l border-silk dark:border-espresso-700 bg-linen/50 dark:bg-espresso-800/50 flex flex-col justify-center">
                <p className="text-xs font-sans font-semibold text-espresso-600 dark:text-espresso-200">{slot.label}</p>
                <p className="text-xs font-mono text-espresso-400 mt-0.5" style={{fontSize:'0.6rem'}}>{slot.hours}</p>
              </div>

              {/* Day cells */}
              {DAYS.map(day => {
                const assigned = (schedule[day.id]?.[slot.id] || [])
                const assignedWorkers = assigned.map(id => workers.find(w => w.id === id)).filter(Boolean)
                return (
                  <div key={day.id}
                    onClick={() => openAssign(day.id, slot.id)}
                    className={`border-l border-silk dark:border-espresso-700 p-1.5 min-h-[56px] cursor-pointer hover:opacity-90 transition relative ${
                      assignedWorkers.length > 0 ? `${style.bg} ${style.border}` : 'hover:bg-linen/60 dark:hover:bg-espresso-800/40'
                    }`}>
                    {assignedWorkers.length === 0 ? (
                      <div className="flex items-center justify-center h-full opacity-30">
                        <Icons.Plus className="w-3.5 h-3.5 text-espresso-400" />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {assignedWorkers.map(w => (
                          <div key={w.id} className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-sans font-medium ${style.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${style.dot}`} />
                            <span className="truncate leading-tight">{w.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Worker summary + WhatsApp */}
      {workers.length > 0 && (
        <div>
          <p className="section-eyebrow">שליחה אישית לעובדים</p>
          <div className="flex flex-wrap gap-2">
            {workers.map(w => {
              const shiftCount = DAYS.reduce((cnt, d) =>
                cnt + SHIFT_SLOTS.filter(s => s.id !== 'closed' && (schedule[d.id]?.[s.id]||[]).includes(w.id)).length
              , 0)
              const hasPhone = !!(w.phone && cleanPhone(w.phone))
              return (
                <div key={w.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-espresso-700 border border-silk dark:border-espresso-600">
                  <span className="text-sm font-sans font-medium text-espresso-700 dark:text-espresso-100">{w.name}</span>
                  <span className="text-xs font-mono text-espresso-400">{shiftCount} משמרות</span>
                  <button onClick={() => sendWorkerWeek(w)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs border transition ${
                      hasPhone && shiftCount > 0
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100'
                        : 'bg-canvas text-espresso-400 border-silk cursor-default opacity-50'
                    }`}
                    title={!hasPhone ? 'הוסף מספר WhatsApp לעובד' : !shiftCount ? 'אין משמרות לעובד זה' : `שלח סידור ל-${w.name}`}>
                    <WA_ICON />
                    שלח
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="card">
        <p className="section-eyebrow">הערות שבועיות</p>
        <div className="flex gap-2">
          <input
            value={notesDraft || weekNotes}
            onChange={e => setNotesDraft(e.target.value)}
            onBlur={() => { if (notesDraft !== weekNotes) saveNotes() }}
            className="input-field flex-1 text-sm"
            placeholder="הערות כלליות לשבוע — חגים, אירועים, שינויים..."
          />
          <Button variant="secondary" onClick={saveNotes} className="text-xs flex-shrink-0">שמור</Button>
        </div>
        {weekNotes && notesDraft === '' && (
          <p className="text-xs text-espresso-400 font-sans mt-2">{weekNotes}</p>
        )}
      </div>

      {/* Assign modal */}
      <Modal isOpen={assignModal.isOpen} onClose={assignModal.close}
        title={`שיבוץ — ${DAYS.find(d=>d.id===assignTarget?.dayId)?.label || ''} · ${SHIFT_SLOTS.find(s=>s.id===assignTarget?.shiftId)?.label || ''}`}
        size="sm"
        footer={<Button variant="primary" onClick={assignModal.close}>סגור</Button>}>
        {assignTarget && (
          <div className="space-y-2">
            <p className="text-xs text-espresso-400 font-sans mb-3">
              {SHIFT_SLOTS.find(s=>s.id===assignTarget.shiftId)?.hours} · לחץ על עובד לשיבוץ / הסרה
            </p>
            {workers.length === 0 ? (
              <p className="text-sm text-espresso-400 text-center py-4 font-sans">אין עובדים — הוסף עובדים תחת "עובד"</p>
            ) : workers.map(w => {
              const isAssigned = (schedule[assignTarget.dayId]?.[assignTarget.shiftId] || []).includes(w.id)
              return (
                <button key={w.id} onClick={() => toggleWorker(w.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition text-right ${
                    isAssigned
                      ? 'bg-terra-50 dark:bg-terra-900/20 border-terra-300 dark:border-terra-600'
                      : 'bg-linen dark:bg-espresso-700 border-silk dark:border-espresso-600 hover:border-bisque'
                  }`}>
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition ${
                    isAssigned ? 'bg-terra-400 border-terra-400 text-white' : 'border-silk dark:border-espresso-500'
                  }`}>
                    {isAssigned && <Icons.Check className="w-3.5 h-3.5" />}
                  </div>
                  <span className="font-sans font-medium text-sm text-espresso-700 dark:text-espresso-100">{w.name}</span>
                  {isAssigned && <span className="mr-auto text-xs text-terra-500 dark:text-terra-300">משובץ ✓</span>}
                </button>
              )
            })}
          </div>
        )}
      </Modal>
    </div>
  )
}
