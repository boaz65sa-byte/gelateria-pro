import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { formatTime, todayKey } from '../../utils/dateFormat.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'

const genId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

export function Checklist({ template, storageKey, onTemplateChange }) {
  const fullKey = `gelateria-${storageKey}-${todayKey()}`
  const [state, setState] = useLocalStorage(fullKey, {})
  const editModal = useModal()
  const [draft, setDraft] = useState(null)

  const toggle = id => setState(prev => { const n={...prev}; if(n[id]) delete n[id]; else n[id]=new Date().toISOString(); return n })
  const resetAll = () => { if(window.confirm('למחוק את כל הסימונים?')) setState({}) }

  const { completed, total, critical, criticalDone } = useMemo(() => {
    const done = template.items.filter(i=>state[i.id]).length
    const crit = template.items.filter(i=>i.critical)
    return { completed:done, total:template.items.length, critical:crit.length, criticalDone:crit.filter(i=>state[i.id]).length }
  }, [state, template.items])

  const progress = total>0 ? Math.round((completed/total)*100) : 0
  const allDone  = completed===total && total>0

  const openEdit = () => { setDraft(JSON.parse(JSON.stringify(template))); editModal.open() }

  const saveDraft = () => { onTemplateChange(draft); editModal.close() }

  const draftUpdateItem = (id, changes) =>
    setDraft(d => ({ ...d, items: d.items.map(i => i.id===id ? {...i,...changes} : i) }))
  const draftDeleteItem = id =>
    setDraft(d => ({ ...d, items: d.items.filter(i => i.id!==id) }))
  const draftAddItem = () =>
    setDraft(d => ({ ...d, items: [...d.items, { id:genId(), text:'משימה חדשה', critical:false }] }))
  const draftMove = (id, dir) => {
    const items = [...draft.items]
    const idx = items.findIndex(i=>i.id===id)
    if ((dir===-1&&idx===0)||(dir===1&&idx===items.length-1)) return
    ;[items[idx], items[idx+dir]] = [items[idx+dir], items[idx]]
    setDraft(d => ({ ...d, items }))
  }

  return (
    <>
      <div className="card">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl font-serif font-semibold mb-0.5">{template.title}</h2>
            <p className="text-sm font-sans text-espresso-400 dark:text-espresso-300">{template.subtitle}</p>
          </div>
          <div className="flex items-center gap-1.5">
            {completed > 0 && (
              <Button variant="ghost" onClick={resetAll} className="text-xs p-2"><Icons.Reset className="w-4 h-4"/></Button>
            )}
            <Button variant="secondary" onClick={openEdit} className="text-xs gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
              </svg>
              ערוך רשימה
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between text-sm font-sans mb-2">
            <span className={`font-medium ${allDone?'text-sage-600 dark:text-sage-400':''}`}>
              {allDone ? '✓ הכל הושלם!' : `${completed} מתוך ${total}`}
            </span>
            <span className="text-espresso-400 font-mono text-xs">{progress}%</span>
          </div>
          <div className="progress-track">
            <div className={`h-full rounded-full transition-all duration-700 ${allDone?'bg-sage-400':'bg-terra-400'}`} style={{width:`${progress}%`}}/>
          </div>
          {critical > 0 && <p className="text-xs text-espresso-400 mt-1.5 font-sans">★ קריטיות: {criticalDone}/{critical}</p>}
        </div>

        {/* Task list */}
        <ul className="space-y-1">
          {template.items.map(item => {
            const checkedAt = state[item.id]
            const isChecked = !!checkedAt
            return (
              <li key={item.id}>
                <button onClick={() => toggle(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all ${isChecked?'bg-sage-50 dark:bg-sage-800/10':'hover:bg-linen dark:hover:bg-espresso-700/60'}`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${isChecked?'bg-sage-400 border-sage-400 text-white':'border-silk dark:border-espresso-500'}`}>
                    {isChecked && <Icons.Check className="w-3 h-3"/>}
                  </div>
                  <span className={`flex-1 text-sm font-sans ${isChecked?'line-through text-espresso-400':'text-espresso-700 dark:text-espresso-100'}`}>
                    {item.text}
                    {item.critical && !isChecked && <span className="mr-1.5 text-rose-500 text-xs">★</span>}
                  </span>
                  {checkedAt && (
                    <span className="text-xs text-espresso-400 font-mono flex items-center gap-1 flex-shrink-0">
                      <Icons.Clock className="w-3 h-3"/>{formatTime(checkedAt)}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title={`ערוך: ${template.title}`}
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={editModal.close}>ביטול</Button>
            <Button variant="primary" onClick={saveDraft}>שמור שינויים</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-3">
            <p className="text-xs text-espresso-400 font-sans mb-4">לחץ על טקסט לעריכה · גרור ↑↓ לשינוי סדר · ★ = קריטי</p>
            <ul className="space-y-2">
              {draft.items.map((item, idx) => (
                <li key={item.id} className="flex items-center gap-2 p-2.5 rounded-xl bg-linen dark:bg-espresso-700 border border-silk dark:border-espresso-600">
                  {/* order arrows */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0">
                    <button onClick={() => draftMove(item.id,-1)} className="p-0.5 text-espresso-300 hover:text-terra-600 transition">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 10 10"><path d="M2 7l3-4 3 4"/></svg>
                    </button>
                    <button onClick={() => draftMove(item.id,1)} className="p-0.5 text-espresso-300 hover:text-terra-600 transition">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 10 10"><path d="M2 3l3 4 3-4"/></svg>
                    </button>
                  </div>
                  {/* text */}
                  <input
                    value={item.text}
                    onChange={e => draftUpdateItem(item.id, {text:e.target.value})}
                    className="flex-1 bg-transparent text-sm font-sans text-espresso-700 dark:text-espresso-100 focus:outline-none focus:ring-2 focus:ring-terra-400 rounded px-1"
                  />
                  {/* critical toggle */}
                  <button
                    onClick={() => draftUpdateItem(item.id, {critical:!item.critical})}
                    title="קריטי / רגיל"
                    className={`flex-shrink-0 w-7 h-7 rounded-lg text-sm transition border ${item.critical?'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800/30 dark:text-rose-400':'bg-canvas border-silk text-espresso-400 hover:border-bisque'}`}
                  >
                    {item.critical ? '★' : '☆'}
                  </button>
                  {/* delete */}
                  <button onClick={() => draftDeleteItem(item.id)} className="flex-shrink-0 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition">
                    <Icons.Trash className="w-3.5 h-3.5"/>
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={draftAddItem} className="flex items-center gap-1.5 text-sm text-terra-600 dark:text-terra-300 font-sans font-medium hover:text-terra-700 transition">
              <Icons.Plus className="w-4 h-4"/> הוסף משימה
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}
