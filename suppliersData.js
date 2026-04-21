import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { formatTime, todayKey, formatDate } from '../../utils/dateFormat.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { openWhatsApp, buildShiftMessage, cleanPhone } from '../../utils/whatsapp.js'

const WA_ICON = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

const SHIFT_TYPES = [
  { id:'morning', label:'בוקר',   emoji:'🌅', hours:'07:00–15:00', color:'amber'  },
  { id:'noon',    label:'צהריים', emoji:'🌤', hours:'12:00–20:00', color:'terra'  },
  { id:'evening', label:'ערב',    emoji:'🌙', hours:'16:00–00:00', color:'violet' },
]

const DEFAULT_TASKS = {
  morning: [
    {id:'m1',text:'בדיקת טמפרטורות מקפיאים',critical:true},
    {id:'m2',text:'הכנת בצק קרפ ראשוני'},
    {id:'m3',text:'חיטוי משטחי עבודה'},
    {id:'m4',text:'חימום מכונת וופל'},
    {id:'m5',text:'הכנת תחנת תוספות'},
    {id:'m6',text:'ניקוי ויטרינה'},
    {id:'m7',text:'הכנת קופה',critical:true},
  ],
  noon: [
    {id:'n1',text:'חידוש מלאי תחנת תוספות'},
    {id:'n2',text:'הכנת בצק נוסף לפי צורך'},
    {id:'n3',text:'ניקוי שוטף המטבח'},
    {id:'n4',text:'בדיקת מלאי אמצע יום',critical:true},
    {id:'n5',text:'ספירת קופה ביניים'},
  ],
  evening: [
    {id:'e1',text:'ניקוי מכונת וופל',critical:true},
    {id:'e2',text:'העברת בצקים עודפים למקרר'},
    {id:'e3',text:'ניקוי יסודי כל המשטחים'},
    {id:'e4',text:'ריקון פחי אשפה'},
    {id:'e5',text:'ספירת קופה וסגירה',critical:true},
    {id:'e6',text:'בדיקת נעילות ואזעקה',critical:true},
  ],
}
const genId = () => `id-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

const shiftColor = {
  amber:  'border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
  terra:  'border-terra-200 dark:border-terra-700 bg-terra-50 dark:bg-terra-900/20 text-terra-700 dark:text-terra-300',
  violet: 'border-violet-200 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300',
}

export function Shifts() {
  const [workers,setWorkers]       = useLocalStorage('gelateria-workers', [])
  const [tasks,setTasks]           = useLocalStorage('gelateria-shift-tasks', DEFAULT_TASKS)
  const [checks,setChecks]         = useLocalStorage(`gelateria-shift-checks-${todayKey()}`, {})
  const [activeShift,setActiveShift]   = useState('morning')
  const [activeWorker,setActiveWorker] = useState(null)
  const [view,setView]                 = useState('worker')

  const workerModal = useModal()
  const taskModal   = useModal()
  const [workerDraft,setWorkerDraft] = useState({name:'',id:null})
  const [tasksDraft,setTasksDraft]   = useState(null)

  // ── checks ──────────────────────────────────────────────────────────────
  const shiftChecksKey = `${activeShift}__${activeWorker}`
  const workerChecks = useMemo(() => checks[shiftChecksKey]||{}, [checks,shiftChecksKey])
  const currentTasks = tasks[activeShift]||[]
  const done  = currentTasks.filter(t=>!!workerChecks[t.id]).length
  const total = currentTasks.length
  const allDone = done===total && total>0

  const toggleCheck = id => setChecks(prev=>{
    const curr={...(prev[shiftChecksKey]||{})}
    if(curr[id]) delete curr[id]; else curr[id]=new Date().toISOString()
    return {...prev,[shiftChecksKey]:curr}
  })
  const resetWorkerChecks = () => { if(window.confirm('לאפס?')) setChecks(prev=>{const n={...prev};delete n[shiftChecksKey];return n}) }

  // ── workers ──────────────────────────────────────────────────────────────
  const openAddWorker  = () => { setWorkerDraft({name:'',phone:'',id:null}); workerModal.open() }
  const openEditWorker = w  => { setWorkerDraft({...w});            workerModal.open() }
  const saveWorker = () => {
    const name=workerDraft.name.trim(); if(!name) return
    if(workerDraft.id) setWorkers(prev=>prev.map(w=>w.id===workerDraft.id?{...w,name}:w))
    else setWorkers(prev=>[...prev,{id:genId(),name}])
    workerModal.close()
  }
  const deleteWorker = id => { if(window.confirm('למחוק עובד?')){setWorkers(prev=>prev.filter(w=>w.id!==id));if(activeWorker===id)setActiveWorker(null)} }

  // ── tasks ────────────────────────────────────────────────────────────────
  const openEditTasks = () => { setTasksDraft(JSON.parse(JSON.stringify(tasks[activeShift]||[]))); taskModal.open() }
  const saveTasks = () => { setTasks(prev=>({...prev,[activeShift]:tasksDraft})); taskModal.close() }
  const draftAddTask    = ()    => setTasksDraft(d=>[...d,{id:genId(),text:'משימה חדשה',critical:false}])
  const draftUpdateTask = (id,k,v) => setTasksDraft(d=>d.map(t=>t.id===id?{...t,[k]:v}:t))
  const draftDeleteTask = id    => setTasksDraft(d=>d.filter(t=>t.id!==id))
  const draftMove = (id,dir) => {
    const arr=[...tasksDraft]; const idx=arr.findIndex(t=>t.id===id)
    if((dir===-1&&idx===0)||(dir===1&&idx===arr.length-1)) return
    ;[arr[idx],arr[idx+dir]]=[arr[idx+dir],arr[idx]]; setTasksDraft(arr)
  }

  // ── overview progress ──────────────────────────────────────────────────
  const workerProgress = useMemo(()=>workers.map(w=>{
    const shifts=SHIFT_TYPES.map(s=>{
      const key=`${s.id}__${w.id}`; const st=tasks[s.id]||[]
      return {...s,done:st.filter(t=>!!(checks[key]||{})[t.id]).length,total:st.length}
    }); return {...w,shifts}
  }),[workers,tasks,checks])

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif italic text-terra-500 dark:text-terra-300 mb-0.5">Turni di lavoro</p>
            <h1 className="text-3xl font-serif font-bold mb-1">משמרות עובדים</h1>
            <p className="text-sm text-espresso-400 font-sans">
              {new Date().toLocaleDateString('he-IL',{weekday:'long',day:'numeric',month:'long'})}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant={view==='worker'?'primary':'secondary'} onClick={()=>setView('worker')}>
              <Icons.Check className="w-4 h-4"/> עובד
            </Button>
            <Button variant={view==='manage'?'primary':'secondary'} onClick={()=>setView('manage')}>
              <Icons.Dashboard className="w-4 h-4"/> ניהול
            </Button>
          </div>
        </div>

        {/* ── WORKER VIEW ── */}
        {view==='worker' && (
          <div className="space-y-5">
            {/* Shift selector */}
            <div>
              <p className="section-eyebrow">בחר משמרת</p>
              <div className="grid grid-cols-3 gap-3">
                {SHIFT_TYPES.map(s=>(
                  <button key={s.id} onClick={()=>setActiveShift(s.id)}
                    className={`p-4 rounded-2xl border-2 text-right transition-all ${activeShift===s.id?shiftColor[s.color]:'border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 hover:border-bisque'}`}>
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
                <Button variant="secondary" onClick={openAddWorker} className="text-xs gap-1">
                  <Icons.Plus className="w-3.5 h-3.5"/> עובד חדש
                </Button>
              </div>
              {workers.length===0
                ?<div className="card text-center py-8">
                  <p className="text-espresso-400 font-sans text-sm mb-3">אין עובדים עדיין</p>
                  <Button variant="primary" onClick={openAddWorker}><Icons.Plus className="w-4 h-4"/> הוסף עובד</Button>
                </div>
                :<div className="flex flex-wrap gap-2">
                  {workers.map(w=>{
                    const key=`${activeShift}__${w.id}`; const st=tasks[activeShift]||[]
                    const wDone=st.filter(t=>!!(checks[key]||{})[t.id]).length
                    const pct=st.length>0?Math.round((wDone/st.length)*100):0
                    const isSel=activeWorker===w.id
                    return(
                      <div key={w.id} className="relative group">
                        <button onClick={()=>setActiveWorker(w.id)}
                          className={`px-4 py-3 rounded-xl border-2 transition-all text-right ${isSel?'border-espresso-600 dark:border-espresso-400 bg-espresso-800 text-white dark:bg-espresso-600':'border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 hover:border-bisque'}`}>
                          <p className="font-sans font-semibold text-sm">{w.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-1 rounded-full bg-silk dark:bg-espresso-600 overflow-hidden">
                              <div className={`h-full rounded-full ${pct===100?'bg-sage-400':'bg-terra-400'}`} style={{width:`${pct}%`}}/>
                            </div>
                            <span className={`text-xs font-mono ${isSel?'text-white/70':'text-espresso-400'}`}>{wDone}/{st.length}</span>
                          </div>
                        </button>
                        <button onClick={()=>openEditWorker(w)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white dark:bg-espresso-700 border border-silk text-espresso-400 hover:text-terra-600 opacity-0 group-hover:opacity-100 transition flex items-center justify-center shadow-sm">
                          <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 12 12"><path d="M8 1.5l2.5 2.5-6 6H2v-2.5l6-6z" strokeLinejoin="round"/></svg>
                        </button>
                      </div>
                    )
                  })}
                </div>
              }
            </div>

            {/* Task list */}
            {activeWorker && (
              <div className="card">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-serif font-semibold">{workers.find(w=>w.id===activeWorker)?.name}</h2>
                    <p className="text-sm font-sans text-espresso-400">
                      משמרת {SHIFT_TYPES.find(s=>s.id===activeShift)?.label} ·{' '}
                      {allDone?<span className="text-sage-600 dark:text-sage-400 font-medium">✓ הכל הושלם!</span>:`${done} מתוך ${total}`}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {done>0&&<Button variant="ghost" onClick={resetWorkerChecks} className="text-xs p-2"><Icons.Reset className="w-4 h-4"/></Button>}
                    {(() => {
                      const w = workers.find(w=>w.id===activeWorker)
                      const shift = SHIFT_TYPES.find(s=>s.id===activeShift)
                      if (!w) return null
                      const hasPhone = w.phone && cleanPhone(w.phone)
                      return (
                        <button
                          onClick={() => {
                            const msg = buildShiftMessage({
                              worker: w,
                              shiftLabel: shift?.label || '',
                              shiftHours: shift?.hours || '',
                              tasks: currentTasks.map(t => t.text + (t.critical ? ' ★' : '')),
                              date: new Date().toLocaleDateString('he-IL', { weekday:'long', day:'numeric', month:'long' })
                            })
                            if (hasPhone) openWhatsApp(w.phone, msg)
                            else alert(`לעובד ${w.name} אין מספר WhatsApp.\nערוך את פרטי העובד והוסף מספר.`)
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition border ${
                            hasPhone
                              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100'
                              : 'bg-canvas dark:bg-espresso-700 text-espresso-400 border-silk'
                          }`}
                          title={hasPhone ? `שלח ל-WhatsApp של ${w.name}` : 'הוסף מספר לעובד בהגדרות'}>
                          <WA_ICON />
                          שלח משמרת
                        </button>
                      )
                    })()}
                    <Button variant="secondary" onClick={openEditTasks} className="text-xs gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16"><path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/></svg>
                      ערוך משימות
                    </Button>
                  </div>
                </div>
                <div className="mb-5 progress-track">
                  <div className={`h-full rounded-full transition-all duration-700 ${allDone?'bg-sage-400':'bg-terra-400'}`} style={{width:`${total>0?Math.round((done/total)*100):0}%`}}/>
                </div>
                <ul className="space-y-1">
                  {currentTasks.map(task=>{
                    const checkedAt=workerChecks[task.id]; const isChecked=!!checkedAt
                    return(
                      <li key={task.id}>
                        <button onClick={()=>toggleCheck(task.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all ${isChecked?'bg-sage-50 dark:bg-sage-800/10':'hover:bg-linen dark:hover:bg-espresso-700/60'}`}>
                          <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${isChecked?'bg-sage-400 border-sage-400 text-white':'border-silk dark:border-espresso-500'}`}>
                            {isChecked&&<Icons.Check className="w-3 h-3"/>}
                          </div>
                          <span className={`flex-1 text-sm font-sans ${isChecked?'line-through text-espresso-400':'text-espresso-700 dark:text-espresso-100'}`}>
                            {task.text}{task.critical&&!isChecked&&<span className="mr-1.5 text-rose-500 text-xs">★</span>}
                          </span>
                          {checkedAt&&<span className="text-xs text-espresso-400 font-mono flex items-center gap-1 flex-shrink-0"><Icons.Clock className="w-3 h-3"/>{formatTime(checkedAt)}</span>}
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
        {view==='manage' && (
          <div className="space-y-5">
            {/* Workers table */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif font-semibold text-lg">עובדים · {new Date().toLocaleDateString('he-IL',{day:'numeric',month:'short'})}</h2>
                <Button variant="primary" onClick={openAddWorker} className="text-xs gap-1"><Icons.Plus className="w-3.5 h-3.5"/> עובד חדש</Button>
              </div>
              {workers.length===0
                ?<p className="text-center py-8 text-espresso-400 font-sans text-sm">אין עובדים רשומים</p>
                :<div className="overflow-x-auto">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="border-b border-silk dark:border-espresso-600">
                        <th className="text-right py-2 font-medium text-espresso-400 text-xs">עובד</th>
                        {SHIFT_TYPES.map(s=><th key={s.id} className="text-center py-2 font-medium text-espresso-400 text-xs px-3">{s.emoji} {s.label}</th>)}
                        <th className="w-16"/>
                      </tr>
                    </thead>
                    <tbody>
                      {workerProgress.map(w=>(
                        <tr key={w.id} className="border-b border-silk/50 dark:border-espresso-700 last:border-0">
                          <td className="py-3 font-medium">{w.name}</td>
                          {w.shifts.map(s=>(
                            <td key={s.id} className="py-3 text-center px-3">
                              {s.total>0?<div className="inline-flex flex-col items-center gap-1">
                                <span className={`text-xs font-mono font-semibold ${s.done===s.total?'text-sage-600 dark:text-sage-400':'text-espresso-500'}`}>{s.done}/{s.total}</span>
                                <div className="w-12 h-1 rounded-full bg-silk dark:bg-espresso-600 overflow-hidden">
                                  <div className={`h-full rounded-full ${s.done===s.total?'bg-sage-400':'bg-terra-400'}`} style={{width:`${Math.round((s.done/s.total)*100)}%`}}/>
                                </div>
                              </div>:<span className="text-espresso-300 text-xs">—</span>}
                            </td>
                          ))}
                          <td className="py-3">
                            <div className="flex gap-1">
                              <button onClick={()=>openEditWorker(w)} className="p-1.5 rounded-lg hover:bg-linen dark:hover:bg-espresso-700 text-espresso-400 hover:text-terra-600 transition">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16"><path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/></svg>
                              </button>
                              <button onClick={()=>deleteWorker(w.id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-400 hover:text-rose-500 transition">
                                <Icons.Trash className="w-3.5 h-3.5"/>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              }
            </div>

            {/* Tasks per shift */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif font-semibold text-lg">משימות לפי משמרת</h2>
                <Button variant="secondary" onClick={openEditTasks} className="text-xs gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16"><path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/></svg>
                  ערוך משמרת {SHIFT_TYPES.find(s=>s.id===activeShift)?.label}
                </Button>
              </div>
              <div className="flex gap-2 mb-4">
                {SHIFT_TYPES.map(s=>(
                  <button key={s.id} onClick={()=>setActiveShift(s.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-sans font-medium transition ${activeShift===s.id?'bg-espresso-800 dark:bg-espresso-600 text-white':'bg-linen dark:bg-espresso-700 border border-silk hover:border-bisque text-espresso-500'}`}>
                    {s.emoji} {s.label}
                  </button>
                ))}
              </div>
              <ul className="space-y-1">
                {currentTasks.map(task=>(
                  <li key={task.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-linen dark:hover:bg-espresso-700/50">
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${task.critical?'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800/30 dark:text-rose-400':'bg-canvas border-silk text-espresso-400'}`}>
                      {task.critical?'★ קריטי':'☆ רגיל'}
                    </span>
                    <span className="flex-1 text-sm font-sans text-espresso-700 dark:text-espresso-100">{task.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* ── Worker Modal ── */}
      <Modal isOpen={workerModal.isOpen} onClose={workerModal.close}
        title={workerDraft?.id ? 'עריכת עובד' : 'עובד חדש'} size="sm"
        footer={<><Button variant="ghost" onClick={workerModal.close}>ביטול</Button><Button variant="primary" onClick={saveWorker}>שמור</Button></>}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-espresso-400 font-sans mb-1">שם העובד</label>
            <input autoFocus value={workerDraft?.name||''} onChange={e=>setWorkerDraft(d=>({...d,name:e.target.value}))}
              onKeyDown={e=>e.key==='Enter'&&saveWorker()} className="input-field text-lg font-serif" placeholder="שם העובד..."/>
          </div>
          <div>
            <label className="block text-xs text-espresso-400 font-sans mb-1">
              מספר WhatsApp
              <span className="text-espresso-300 mr-1 font-normal">(לשליחת סידור עבודה)</span>
            </label>
            <input value={workerDraft?.phone||''} onChange={e=>setWorkerDraft(d=>({...d,phone:e.target.value}))}
              className="input-field font-mono" placeholder="0501234567" dir="ltr"/>
            {workerDraft?.phone && (
              <p className="text-xs mt-1 text-espresso-400">
                פורמט: {cleanPhone(workerDraft.phone) || 'לא תקין'}
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* ── Tasks Modal ── */}
      <Modal isOpen={taskModal.isOpen} onClose={taskModal.close}
        title={`ערוך משימות — משמרת ${SHIFT_TYPES.find(s=>s.id===activeShift)?.label}`} size="md"
        footer={
          <><Button variant="ghost" onClick={()=>{setTasks(prev=>({...prev,[activeShift]:DEFAULT_TASKS[activeShift]}));taskModal.close()}}>אפס לברירת מחדל</Button>
          <Button variant="ghost" onClick={taskModal.close}>ביטול</Button>
          <Button variant="primary" onClick={saveTasks}>שמור</Button></>
        }>
        {tasksDraft && (
          <div className="space-y-2">
            {tasksDraft.map(task=>(
              <div key={task.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-linen dark:bg-espresso-700 border border-silk dark:border-espresso-600">
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button onClick={()=>draftMove(task.id,-1)} className="p-0.5 text-espresso-300 hover:text-terra-600 transition">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 10 10"><path d="M2 7l3-4 3 4"/></svg>
                  </button>
                  <button onClick={()=>draftMove(task.id,1)} className="p-0.5 text-espresso-300 hover:text-terra-600 transition">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 10 10"><path d="M2 3l3 4 3-4"/></svg>
                  </button>
                </div>
                <input value={task.text} onChange={e=>draftUpdateTask(task.id,'text',e.target.value)}
                  className="flex-1 bg-transparent text-sm font-sans text-espresso-700 dark:text-espresso-100 focus:outline-none focus:ring-2 focus:ring-terra-400 rounded px-1"/>
                <button onClick={()=>draftUpdateTask(task.id,'critical',!task.critical)}
                  className={`w-7 h-7 rounded-lg text-sm border transition flex-shrink-0 ${task.critical?'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800/30 dark:text-rose-400':'bg-canvas border-silk text-espresso-400 hover:border-bisque'}`}>
                  {task.critical?'★':'☆'}
                </button>
                <button onClick={()=>draftDeleteTask(task.id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition flex-shrink-0">
                  <Icons.Trash className="w-3.5 h-3.5"/>
                </button>
              </div>
            ))}
            <button onClick={draftAddTask} className="flex items-center gap-1.5 text-sm text-terra-600 dark:text-terra-300 font-sans font-medium hover:text-terra-700 transition">
              <Icons.Plus className="w-4 h-4"/> הוסף משימה
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}
