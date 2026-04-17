import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { formatTime, todayKey } from '../../utils/dateFormat.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

// ── constants ──────────────────────────────────────────────────────────────
const SHIFT_TYPES = [
  { id: 'morning', label: 'בוקר',  emoji: '🌅', hours: '07:00–15:00', color: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300' },
  { id: 'noon',    label: 'צהריים',emoji: '🌤', hours: '12:00–20:00', color: 'bg-terra-50 dark:bg-terra-900/20 border-terra-200 dark:border-terra-700 text-terra-700 dark:text-terra-300' },
  { id: 'evening', label: 'ערב',   emoji: '🌙', hours: '16:00–00:00', color: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700 text-violet-700 dark:text-violet-300' },
]

const DEFAULT_TASKS = {
  morning: [
    { id: 'm1', text: 'בדיקת טמפרטורות מקפיאים', critical: true },
    { id: 'm2', text: 'הכנת בצק קרפ ראשוני' },
    { id: 'm3', text: 'חיטוי משטחי עבודה' },
    { id: 'm4', text: 'חימום מכונת וופל' },
    { id: 'm5', text: 'הכנת תחנת תוספות' },
    { id: 'm6', text: 'ניקוי ויטרינה' },
    { id: 'm7', text: 'הכנת קופה' , critical: true },
  ],
  noon: [
    { id: 'n1', text: 'חידוש מלאי תחנת תוספות' },
    { id: 'n2', text: 'הכנת בצק נוסף לפי צורך' },
    { id: 'n3', text: 'ניקוי שוטף של המטבח' },
    { id: 'n4', text: 'בדיקת מלאי אמצע יום', critical: true },
    { id: 'n5', text: 'ספירת קופה ביניים' },
    { id: 'n6', text: 'עדכון לוג מכירות' },
  ],
  evening: [
    { id: 'e1', text: 'ניקוי מכונת וופל', critical: true },
    { id: 'e2', text: 'העברת בצקים עודפים למקרר' },
    { id: 'e3', text: 'ניקוי יסודי כל המשטחים' },
    { id: 'e4', text: 'ריקון פחי אשפה' },
    { id: 'e5', text: 'ספירת קופה וסגירה', critical: true },
    { id: 'e6', text: 'בדיקת נעילות ואזעקה', critical: true },
    { id: 'e7', text: 'כיבוי כל מכשירי חשמל (חוץ ממקפיאים)', critical: true },
  ],
}

const genId = () => `t-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

// ── main component ─────────────────────────────────────────────────────────
export function Shifts() {
  const [workers, setWorkers]       = useLocalStorage('gelateria-workers', [])
  const [tasks, setTasks]           = useLocalStorage('gelateria-shift-tasks', DEFAULT_TASKS)
  const [checks, setChecks]         = useLocalStorage(`gelateria-shift-checks-${todayKey()}`, {})

  const [activeShift, setActiveShift]   = useState('morning')
  const [activeWorker, setActiveWorker] = useState(null)
  const [view, setView]                 = useState('worker') // 'worker' | 'manage'
  const [addingWorker, setAddingWorker] = useState(false)
  const [newWorkerName, setNewWorkerName] = useState('')
  const [editingTask, setEditingTask]   = useState(null) // { shiftId, taskId } | null
  const [addingTask, setAddingTask]     = useState(false)
  const [newTaskText, setNewTaskText]   = useState('')

  // ── derived ────────────────────────────────────────────────────────────────
  const currentTasks   = tasks[activeShift] || []
  const shiftChecksKey = `${activeShift}__${activeWorker}`

  const workerChecks = useMemo(() => {
    return checks[shiftChecksKey] || {}
  }, [checks, shiftChecksKey])

  const { done, total } = useMemo(() => ({
    done:  currentTasks.filter(t => !!workerChecks[t.id]).length,
    total: currentTasks.length,
  }), [currentTasks, workerChecks])

  const allDone = done === total && total > 0

  // ── check toggle ───────────────────────────────────────────────────────────
  const toggleCheck = taskId => {
    setChecks(prev => {
      const curr = { ...(prev[shiftChecksKey] || {}) }
      if (curr[taskId]) delete curr[taskId]
      else curr[taskId] = new Date().toISOString()
      return { ...prev, [shiftChecksKey]: curr }
    })
  }

  const resetWorkerChecks = () => {
    if (!window.confirm('לאפס את הסימונים של העובד הזה?')) return
    setChecks(prev => { const n = {...prev}; delete n[shiftChecksKey]; return n })
  }

  // ── workers ────────────────────────────────────────────────────────────────
  const addWorker = () => {
    const name = newWorkerName.trim()
    if (!name) return
    setWorkers(prev => [...prev, { id: genId(), name }])
    setNewWorkerName('')
    setAddingWorker(false)
  }

  const removeWorker = id => {
    if (!window.confirm('למחוק עובד?')) return
    setWorkers(prev => prev.filter(w => w.id !== id))
    if (activeWorker === id) setActiveWorker(null)
  }

  // ── tasks management ───────────────────────────────────────────────────────
  const addTask = () => {
    const text = newTaskText.trim()
    if (!text) return
    setTasks(prev => ({
      ...prev,
      [activeShift]: [...(prev[activeShift] || []), { id: genId(), text, critical: false }]
    }))
    setNewTaskText('')
    setAddingTask(false)
  }

  const toggleCritical = (shiftId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [shiftId]: (prev[shiftId] || []).map(t => t.id === taskId ? { ...t, critical: !t.critical } : t)
    }))
  }

  const deleteTask = (shiftId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [shiftId]: (prev[shiftId] || []).filter(t => t.id !== taskId)
    }))
  }

  const resetTasksToDefault = () => {
    if (!window.confirm('לאפס את כל המשימות לברירת המחדל?')) return
    setTasks(DEFAULT_TASKS)
  }

  // ── overview: progress per worker per shift ────────────────────────────────
  const workerProgress = useMemo(() => {
    return workers.map(w => {
      const shiftData = SHIFT_TYPES.map(s => {
        const key = `${s.id}__${w.id}`
        const shiftTasks = tasks[s.id] || []
        const done = shiftTasks.filter(t => !!(checks[key]||{})[t.id]).length
        return { ...s, done, total: shiftTasks.length }
      })
      return { ...w, shifts: shiftData }
    })
  }, [workers, tasks, checks])

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-serif italic text-terra-500 dark:text-terra-300 mb-0.5">Turni di lavoro</p>
          <h1 className="text-3xl font-serif font-bold mb-1">משמרות עובדים</h1>
          <p className="text-sm font-sans text-espresso-400 dark:text-espresso-300">
            {new Date().toLocaleDateString('he-IL', { weekday:'long', day:'numeric', month:'long' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant={view==='worker' ? 'primary' : 'secondary'} onClick={() => setView('worker')}>
            <Icons.Check className="w-4 h-4" /> מצב עובד
          </Button>
          <Button variant={view==='manage' ? 'primary' : 'secondary'} onClick={() => setView('manage')}>
            <Icons.Dashboard className="w-4 h-4" /> ניהול
          </Button>
        </div>
      </div>

      {/* ── WORKER VIEW ── */}
      {view === 'worker' && (
        <div className="space-y-5">

          {/* Shift selector */}
          <div>
            <p className="section-eyebrow">בחר משמרת</p>
            <div className="grid grid-cols-3 gap-3">
              {SHIFT_TYPES.map(s => (
                <button key={s.id} onClick={() => setActiveShift(s.id)}
                  className={`p-4 rounded-2xl border-2 text-right transition-all ${
                    activeShift === s.id
                      ? s.color
                      : 'border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 hover:border-bisque'
                  }`}>
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <p className="font-sans font-semibold text-sm">{s.label}</p>
                  <p className="font-sans text-xs opacity-70 mt-0.5">{s.hours}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Worker selector */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="section-eyebrow mb-0">מי עובד עכשיו?</p>
              <button onClick={() => setAddingWorker(true)}
                className="text-xs text-terra-600 dark:text-terra-300 hover:underline font-sans flex items-center gap-1">
                <Icons.Plus className="w-3 h-3" /> הוסף עובד
              </button>
            </div>

            {addingWorker && (
              <div className="flex gap-2 mb-3">
                <input autoFocus value={newWorkerName}
                  onChange={e => setNewWorkerName(e.target.value)}
                  onKeyDown={e => { if (e.key==='Enter') addWorker(); if (e.key==='Escape') setAddingWorker(false) }}
                  className="input-field flex-1" placeholder="שם העובד..." />
                <Button variant="primary" onClick={addWorker}>הוסף</Button>
                <Button variant="ghost" onClick={() => setAddingWorker(false)}>ביטול</Button>
              </div>
            )}

            {workers.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-espresso-400 font-sans text-sm mb-3">אין עובדים עדיין</p>
                <Button variant="secondary" onClick={() => setAddingWorker(true)}>
                  <Icons.Plus className="w-4 h-4" /> הוסף עובד ראשון
                </Button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {workers.map(w => {
                  const key = `${activeShift}__${w.id}`
                  const shiftTasks = tasks[activeShift] || []
                  const wDone = shiftTasks.filter(t => !!(checks[key]||{})[t.id]).length
                  const pct = shiftTasks.length > 0 ? Math.round((wDone / shiftTasks.length) * 100) : 0
                  const isSelected = activeWorker === w.id
                  return (
                    <button key={w.id} onClick={() => setActiveWorker(w.id)}
                      className={`px-4 py-3 rounded-xl border-2 transition-all text-right ${
                        isSelected
                          ? 'border-espresso-600 dark:border-espresso-400 bg-espresso-800 text-white dark:bg-espresso-600'
                          : 'border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 hover:border-bisque'
                      }`}>
                      <p className="font-sans font-semibold text-sm">{w.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 rounded-full bg-silk dark:bg-espresso-600 overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${pct===100 ? 'bg-sage-400' : 'bg-terra-400'}`}
                               style={{width:`${pct}%`}} />
                        </div>
                        <span className={`text-xs font-mono ${isSelected ? 'text-white/70' : 'text-espresso-400'}`}>
                          {wDone}/{shiftTasks.length}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Task list for selected worker */}
          {activeWorker && (
            <div className="card">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-xl font-serif font-semibold">
                    {workers.find(w=>w.id===activeWorker)?.name}
                  </h2>
                  <p className="text-sm font-sans text-espresso-400 dark:text-espresso-300">
                    משמרת {SHIFT_TYPES.find(s=>s.id===activeShift)?.label} ·{' '}
                    {allDone
                      ? <span className="text-sage-600 dark:text-sage-400 font-medium">✓ הכל הושלם!</span>
                      : `${done} מתוך ${total} הושלמו`
                    }
                  </p>
                </div>
                {done > 0 && (
                  <Button variant="ghost" onClick={resetWorkerChecks} className="text-xs">
                    <Icons.Reset className="w-4 h-4" /> אפס
                  </Button>
                )}
              </div>

              {/* Progress */}
              <div className="mb-5 progress-track">
                <div className={`h-full rounded-full transition-all duration-700 ${allDone ? 'bg-sage-400' : 'bg-terra-400'}`}
                     style={{width:`${total>0 ? Math.round((done/total)*100) : 0}%`}} />
              </div>

              <ul className="space-y-1">
                {currentTasks.map(task => {
                  const checkedAt = workerChecks[task.id]
                  const isChecked = !!checkedAt
                  return (
                    <li key={task.id}>
                      <button onClick={() => toggleCheck(task.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all ${
                          isChecked
                            ? 'bg-sage-50 dark:bg-sage-800/10'
                            : 'hover:bg-linen dark:hover:bg-espresso-700/60'
                        }`}>
                        <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                          isChecked
                            ? 'bg-sage-400 border-sage-400 text-white'
                            : 'border-silk dark:border-espresso-500'
                        }`}>
                          {isChecked && <Icons.Check className="w-3 h-3" />}
                        </div>
                        <span className={`flex-1 text-sm font-sans ${
                          isChecked
                            ? 'line-through text-espresso-400 dark:text-espresso-400'
                            : 'text-espresso-700 dark:text-espresso-100'
                        }`}>
                          {task.text}
                          {task.critical && !isChecked && (
                            <span className="mr-1.5 text-rose-500 text-xs">★</span>
                          )}
                        </span>
                        {checkedAt && (
                          <span className="text-xs text-espresso-400 font-mono flex items-center gap-1 flex-shrink-0">
                            <Icons.Clock className="w-3 h-3" />{formatTime(checkedAt)}
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── MANAGE VIEW ── */}
      {view === 'manage' && (
        <div className="space-y-6">

          {/* Workers overview table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-semibold text-lg">סקירת עובדים — {new Date().toLocaleDateString('he-IL',{day:'numeric',month:'short'})}</h2>
              <button onClick={() => setAddingWorker(true)}
                className="text-sm text-terra-600 dark:text-terra-300 hover:underline font-sans flex items-center gap-1">
                <Icons.Plus className="w-3.5 h-3.5" /> עובד חדש
              </button>
            </div>

            {addingWorker && (
              <div className="flex gap-2 mb-4">
                <input autoFocus value={newWorkerName}
                  onChange={e => setNewWorkerName(e.target.value)}
                  onKeyDown={e => { if(e.key==='Enter') addWorker(); if(e.key==='Escape') setAddingWorker(false) }}
                  className="input-field flex-1" placeholder="שם העובד..." />
                <Button variant="primary" onClick={addWorker}>הוסף</Button>
                <Button variant="ghost" onClick={() => setAddingWorker(false)}>ביטול</Button>
              </div>
            )}

            {workers.length === 0 ? (
              <p className="text-center py-8 text-espresso-400 font-sans text-sm">אין עובדים רשומים</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="border-b border-silk dark:border-espresso-600">
                      <th className="text-right py-2 font-medium text-espresso-400 text-xs">עובד</th>
                      {SHIFT_TYPES.map(s => (
                        <th key={s.id} className="text-center py-2 font-medium text-espresso-400 text-xs px-3">
                          {s.emoji} {s.label}
                        </th>
                      ))}
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {workerProgress.map(w => (
                      <tr key={w.id} className="border-b border-silk/50 dark:border-espresso-700 last:border-0">
                        <td className="py-3 font-medium text-espresso-800 dark:text-espresso-100">{w.name}</td>
                        {w.shifts.map(s => (
                          <td key={s.id} className="py-3 text-center px-3">
                            {s.total > 0 ? (
                              <div className="inline-flex flex-col items-center gap-1">
                                <span className={`text-xs font-mono font-semibold ${
                                  s.done === s.total ? 'text-sage-600 dark:text-sage-400' : 'text-espresso-500 dark:text-espresso-300'
                                }`}>
                                  {s.done}/{s.total}
                                </span>
                                <div className="w-12 h-1 rounded-full bg-silk dark:bg-espresso-600 overflow-hidden">
                                  <div className={`h-full rounded-full ${s.done===s.total ? 'bg-sage-400' : 'bg-terra-400'}`}
                                       style={{width:`${Math.round((s.done/s.total)*100)}%`}} />
                                </div>
                              </div>
                            ) : <span className="text-espresso-300 text-xs">—</span>}
                          </td>
                        ))}
                        <td className="py-3">
                          <button onClick={() => removeWorker(w.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition">
                            <Icons.Trash className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Tasks management per shift */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif font-semibold text-lg">עריכת משימות</h2>
              <Button variant="ghost" onClick={resetTasksToDefault} className="text-xs">
                <Icons.Reset className="w-4 h-4" /> אפס לברירת מחדל
              </Button>
            </div>

            <div className="flex gap-2 mb-5">
              {SHIFT_TYPES.map(s => (
                <button key={s.id} onClick={() => setActiveShift(s.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-sans font-medium transition ${
                    activeShift === s.id
                      ? 'bg-espresso-800 dark:bg-espresso-600 text-white'
                      : 'bg-linen dark:bg-espresso-700 border border-silk dark:border-espresso-600 text-espresso-500 hover:border-bisque'
                  }`}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>

            <ul className="space-y-1 mb-4">
              {currentTasks.map(task => (
                <li key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-linen dark:hover:bg-espresso-700/50 group">
                  <span className={`text-xs flex-shrink-0 cursor-pointer px-2 py-0.5 rounded-full border transition ${
                    task.critical
                      ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800/30 dark:text-rose-400'
                      : 'bg-canvas border-silk text-espresso-400 dark:bg-espresso-700 dark:border-espresso-600'
                  }`}
                    onClick={() => toggleCritical(activeShift, task.id)}
                    title="לחץ לסימון כקריטי">
                    {task.critical ? '★ קריטי' : '☆ רגיל'}
                  </span>
                  <span className="flex-1 text-sm font-sans text-espresso-700 dark:text-espresso-100">{task.text}</span>
                  <button onClick={() => deleteTask(activeShift, task.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition">
                    <Icons.Trash className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>

            {addingTask ? (
              <div className="flex gap-2">
                <input autoFocus value={newTaskText}
                  onChange={e => setNewTaskText(e.target.value)}
                  onKeyDown={e => { if(e.key==='Enter') addTask(); if(e.key==='Escape') setAddingTask(false) }}
                  className="input-field flex-1" placeholder="תיאור המשימה..." />
                <Button variant="primary" onClick={addTask}>הוסף</Button>
                <Button variant="ghost" onClick={() => { setAddingTask(false); setNewTaskText('') }}>ביטול</Button>
              </div>
            ) : (
              <button onClick={() => setAddingTask(true)}
                className="flex items-center gap-2 text-sm text-terra-600 dark:text-terra-300 hover:text-terra-700 font-sans font-medium transition">
                <Icons.Plus className="w-4 h-4" /> הוסף משימה למשמרת {SHIFT_TYPES.find(s=>s.id===activeShift)?.label}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
