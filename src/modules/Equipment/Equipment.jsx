import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { defaultEquipment, equipmentCategories } from '../../data/equipmentData.js'
import { formatDate } from '../../utils/dateFormat.js'

const genId = () => `eq-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

const OWNER_OPTIONS = [
  { value: '',        label: 'לא הוגדר', color: 'bg-canvas text-espresso-500 border-silk' },
  { value: 'me',      label: 'אני',       color: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-700' },
  { value: 'partner', label: 'שותף',     color: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-700' },
]

function ownerStyle(v) {
  return OWNER_OPTIONS.find(o => o.value === v)?.color || OWNER_OPTIONS[0].color
}
function ownerLabel(v) {
  return OWNER_OPTIONS.find(o => o.value === v)?.label || ''
}

// ── print styles injected once ────────────────────────────────────────────────
const PRINT_CSS = `
@media print {
  .eq-no-print { display: none !important; }
  .eq-print-header { display: block !important; }
  body { background: white !important; }
  .eq-print-page { padding: 0 !important; }
}
.eq-print-header { display: none; }
`

export function Equipment() {
  const [equipment, setEquipment] = useLocalStorage('gelateria-equipment', defaultEquipment)
  const [filter, setFilter] = useState('all')   // 'all' | 'pending' | 'purchased' | 'me' | 'partner' | cat id
  const [printMode, setPrintMode] = useState(false)
  const editModal = useModal()
  const addModal  = useModal()
  const [draft, setDraft] = useState(null)

  // ── stats ────────────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total     = equipment.length
    const purchased = equipment.filter(e => e.purchased).length
    const pending   = total - purchased
    const byMe      = equipment.filter(e => e.owner === 'me').length
    const byPartner = equipment.filter(e => e.owner === 'partner').length
    const totalCost = equipment.reduce((s,e) => s + (e.unitPrice || 0) * (e.quantity || 0), 0)
    const paidCost  = equipment.filter(e => e.purchased).reduce((s,e) => s + (e.unitPrice || 0) * (e.quantity || 0), 0)
    return { total, purchased, pending, byMe, byPartner, totalCost, paidCost }
  }, [equipment])

  // ── filtered items ───────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (filter === 'all')       return equipment
    if (filter === 'pending')   return equipment.filter(e => !e.purchased)
    if (filter === 'purchased') return equipment.filter(e => e.purchased)
    if (filter === 'me')        return equipment.filter(e => e.owner === 'me')
    if (filter === 'partner')   return equipment.filter(e => e.owner === 'partner')
    return equipment.filter(e => e.category === filter)
  }, [equipment, filter])

  // ── group by category ────────────────────────────────────────────────────────
  const grouped = useMemo(() => {
    const g = {}
    filtered.forEach(item => {
      if (!g[item.category]) g[item.category] = []
      g[item.category].push(item)
    })
    return g
  }, [filtered])

  // ── mutations ────────────────────────────────────────────────────────────────
  const togglePurchased = id =>
    setEquipment(prev => prev.map(e => e.id === id ? { ...e, purchased: !e.purchased } : e))

  const cycleOwner = id =>
    setEquipment(prev => prev.map(e => {
      if (e.id !== id) return e
      const opts = ['', 'me', 'partner']
      const next = opts[(opts.indexOf(e.owner) + 1) % opts.length]
      return { ...e, owner: next }
    }))

  const openEdit = item => { setDraft({ ...item }); editModal.open() }
  const saveEdit = () => {
    setEquipment(prev => prev.map(e => e.id === draft.id ? { ...draft, unitPrice: parseFloat(draft.unitPrice)||0, quantity: parseFloat(draft.quantity)||0 } : e))
    editModal.close()
  }
  const deleteItem = id => {
    if (window.confirm('למחוק פריט זה?')) setEquipment(prev => prev.filter(e => e.id !== id))
  }

  const openAdd = () => {
    setDraft({ id: null, category: 'heavy', name: '', quantity: 1, unitPrice: 0, notes: '', purchased: false, owner: '' })
    addModal.open()
  }
  const saveAdd = () => {
    if (!draft?.name?.trim()) return
    setEquipment(prev => [...prev, { ...draft, id: genId(), unitPrice: parseFloat(draft.unitPrice)||0, quantity: parseFloat(draft.quantity)||0 }])
    addModal.close()
  }

  const reset = () => { if (window.confirm('לאפס לרשימה המקורית?')) setEquipment(defaultEquipment) }

  const fmt = n => n ? `₪${Number(n).toLocaleString('he-IL')}` : '—'

  // ── print view ───────────────────────────────────────────────────────────────
  if (printMode) {
    const printItems = filter === 'all' ? equipment : filtered
    const printGrouped = {}
    printItems.forEach(item => {
      if (!printGrouped[item.category]) printGrouped[item.category] = []
      printGrouped[item.category].push(item)
    })
    return (
      <div className="eq-print-page">
        <style>{PRINT_CSS}</style>
        <div className="eq-no-print flex gap-2 mb-6 flex-wrap">
          <Button variant="primary" onClick={() => window.print()}>
            <Icons.Print className="w-4 h-4" /> הדפס / שמור PDF
          </Button>
          <Button variant="secondary" onClick={() => setPrintMode(false)}>
            <Icons.Close className="w-4 h-4" /> חזור
          </Button>
        </div>

        {/* Print header */}
        <div className="mb-8 pb-6 border-b-2 border-espresso-800 dark:border-espresso-200">
          <h1 className="text-3xl font-serif font-bold mb-1">Sweet Station — רשימת ציוד לפתיחה</h1>
          <p className="text-sm text-espresso-400 font-sans">הודפס: {formatDate(new Date())} · סה"כ {printItems.length} פריטים</p>
          <div className="grid grid-cols-4 gap-4 mt-4">
            {[
              { l:'סה"כ פריטים', v: printItems.length },
              { l:'נרכשו',       v: printItems.filter(e=>e.purchased).length },
              { l:'נותר לרכישה', v: printItems.filter(e=>!e.purchased).length },
              { l:'עלות משוערת', v: fmt(printItems.reduce((s,e)=>s+(e.unitPrice||0)*(e.quantity||0),0)) },
            ].map((s,i) => (
              <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
                <p className="text-xs text-espresso-400 font-sans mb-1">{s.l}</p>
                <p className="text-xl font-serif font-bold">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        {Object.entries(printGrouped).map(([catKey, items]) => {
          const cat = equipmentCategories.find(c => c.id === catKey)
          return (
            <div key={catKey} className="mb-8 avoid-break">
              <h2 className="text-lg font-serif font-semibold mb-3 flex items-center gap-2">
                <span>{cat?.emoji}</span> {cat?.label}
              </h2>
              <table className="w-full text-sm font-sans border-collapse">
                <thead>
                  <tr className="bg-linen dark:bg-espresso-800 border-b border-silk">
                    <th className="text-right px-3 py-2 font-medium text-xs w-8">#</th>
                    <th className="text-right px-3 py-2 font-medium text-xs">פריט</th>
                    <th className="text-center px-3 py-2 font-medium text-xs w-16">כמות</th>
                    <th className="text-center px-3 py-2 font-medium text-xs w-24">מחיר יחידה</th>
                    <th className="text-center px-3 py-2 font-medium text-xs w-24">סה"כ</th>
                    <th className="text-center px-3 py-2 font-medium text-xs w-20">אחראי</th>
                    <th className="text-center px-3 py-2 font-medium text-xs w-20">נרכש?</th>
                    <th className="text-right px-3 py-2 font-medium text-xs">הערות</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} className={`border-b border-silk/50 ${item.purchased ? 'opacity-50' : ''} ${idx%2===0?'':'bg-linen/20'}`}>
                      <td className="px-3 py-2.5 text-espresso-400 text-xs">{idx+1}</td>
                      <td className="px-3 py-2.5 font-medium">
                        {item.purchased && <span className="mr-1 text-sage-600">✓</span>}
                        {item.name}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono">{item.quantity}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{fmt(item.unitPrice)}</td>
                      <td className="px-3 py-2.5 text-center font-mono font-medium">
                        {item.unitPrice ? fmt(item.unitPrice * item.quantity) : '—'}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${ownerStyle(item.owner)}`}>
                          {ownerLabel(item.owner) || '—'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${item.purchased ? 'bg-sage-50 text-sage-600' : 'bg-canvas text-espresso-400'}`}>
                          {item.purchased ? 'כן ✓' : 'לא'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-espresso-400">{item.notes}</td>
                    </tr>
                  ))}
                  {/* Category total row */}
                  {items.some(e => e.unitPrice) && (
                    <tr className="bg-linen dark:bg-espresso-800 font-medium">
                      <td colSpan={4} className="px-3 py-2 text-xs text-espresso-400 text-right">סה"כ {cat?.label}:</td>
                      <td className="px-3 py-2 text-center font-mono font-bold">
                        {fmt(items.reduce((s,e) => s+(e.unitPrice||0)*(e.quantity||0),0))}
                      </td>
                      <td colSpan={3}/>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )
        })}

        {/* Grand total */}
        <div className="mt-6 pt-4 border-t-2 border-espresso-800 dark:border-espresso-200 flex justify-between items-center">
          <p className="font-serif font-bold text-xl">סה"כ כללי</p>
          <p className="font-serif font-bold text-2xl text-terra-400">
            {fmt(printItems.reduce((s,e) => s+(e.unitPrice||0)*(e.quantity||0),0))}
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-silk text-center">
          <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
        </div>
      </div>
    )
  }

  // ── main view ─────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{PRINT_CSS}</style>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif italic text-terra-400 mb-0.5">Attrezzatura</p>
            <h1 className="text-3xl font-serif font-bold mb-1">ציוד לפתיחה</h1>
            <p className="text-sm text-espresso-400 font-sans">עקוב אחר מה נרכש, מה נשאר ומי אחראי על כל פריט</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={openAdd}><Icons.Plus className="w-4 h-4"/> הוסף פריט</Button>
            <Button variant="secondary" onClick={() => setPrintMode(true)}><Icons.Print className="w-4 h-4"/> הדפס דוח</Button>
            <Button variant="ghost" onClick={reset}><Icons.Reset className="w-4 h-4"/></Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'סה"כ פריטים',  value: stats.total,                       color: '' },
            { label: 'נרכשו ✓',       value: stats.purchased,                   color: 'text-sage-600 dark:text-sage-400' },
            { label: 'נותר לרכישה',   value: stats.pending,                     color: stats.pending > 0 ? 'text-terra-400' : '' },
            { label: 'עלות משוערת',   value: fmt(stats.totalCost),              color: '' },
          ].map((s,i) => (
            <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
              <p className="text-xs text-espresso-400 font-sans uppercase tracking-wide mb-1">{s.label}</p>
              <p className={`text-2xl font-serif font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Overall progress */}
        <div className="card py-4">
          <div className="flex items-center justify-between text-sm font-sans mb-2">
            <span className="font-medium">
              {stats.purchased === stats.total && stats.total > 0
                ? '✓ כל הציוד נרכש!'
                : `${stats.purchased} מתוך ${stats.total} פריטים נרכשו`}
            </span>
            <span className="font-mono text-espresso-400">
              {stats.total > 0 ? Math.round((stats.purchased/stats.total)*100) : 0}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-canvas dark:bg-espresso-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${stats.purchased === stats.total && stats.total > 0 ? 'bg-sage-400' : 'bg-terra-400'}`}
              style={{width:`${stats.total>0?Math.round((stats.purchased/stats.total)*100):0}%`}}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-300 flex items-center justify-center text-lg font-serif font-bold">א</div>
            <div>
              <p className="text-xs text-espresso-400 font-sans mb-0.5">אני אחראי על</p>
              <p className="font-serif font-bold text-xl">{stats.byMe} פריטים</p>
            </div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-300 flex items-center justify-center text-lg font-serif font-bold">ש</div>
            <div>
              <p className="text-xs text-espresso-400 font-sans mb-0.5">השותף אחראי על</p>
              <p className="font-serif font-bold text-xl">{stats.byPartner} פריטים</p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="card py-4">
          <div className="flex justify-between text-sm font-sans mb-2">
            <span className="font-medium">{stats.purchased} מתוך {stats.total} פריטים נרכשו</span>
            <span className="text-espresso-400 font-mono">{stats.total > 0 ? Math.round((stats.purchased/stats.total)*100) : 0}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${stats.total > 0 ? Math.round((stats.purchased/stats.total)*100) : 0}%` }}/>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { key:'all',       label:'הכל' },
            { key:'pending',   label:'לרכישה', danger: stats.pending > 0 },
            { key:'purchased', label:'נרכש ✓' },
            { key:'me',        label:'אני' },
            { key:'partner',   label:'שותף' },
            ...equipmentCategories.map(c => ({ key: c.id, label: `${c.emoji} ${c.label}` })),
          ].map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-sans font-medium transition border ${
                filter === f.key
                  ? f.danger ? 'bg-terra-400 text-white border-transparent' : 'bg-espresso-800 dark:bg-espresso-600 text-white border-transparent'
                  : 'bg-white dark:bg-espresso-700 border-silk dark:border-espresso-600 text-espresso-500 hover:border-terra-200'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Equipment list */}
        <div className="space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <div className="card text-center py-12 text-espresso-400 font-sans">אין פריטים להצגה</div>
          ) : Object.entries(grouped).map(([catKey, items]) => {
            const cat = equipmentCategories.find(c => c.id === catKey)
            const catDone = items.filter(e => e.purchased).length
            return (
              <div key={catKey} className="card p-0 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 bg-linen/60 dark:bg-espresso-800/60 border-b border-silk dark:border-espresso-700">
                  <div className="flex items-center gap-2">
                    <span>{cat?.emoji}</span>
                    <span className="font-serif font-semibold text-base">{cat?.label}</span>
                    <span className="text-xs text-espresso-400 font-sans">({catDone}/{items.length})</span>
                  </div>
                  <div className="progress-track w-24">
                    <div className="progress-fill" style={{ width: `${items.length > 0 ? Math.round((catDone/items.length)*100) : 0}%` }}/>
                  </div>
                </div>

                <div className="divide-y divide-silk/50 dark:divide-espresso-700/50">
                  {items.map(item => (
                    <div key={item.id}
                      className={`flex items-center gap-3 px-4 py-3 group transition ${
                        item.purchased
                          ? 'bg-sage-50/30 dark:bg-sage-900/10'
                          : 'hover:bg-linen/40 dark:hover:bg-espresso-800/40'
                      }`}>

                      {/* Checkbox */}
                      <button onClick={() => togglePurchased(item.id)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          item.purchased
                            ? 'bg-sage-400 border-sage-400 text-white'
                            : 'border-silk dark:border-espresso-500 hover:border-terra-300'
                        }`}>
                        {item.purchased && <Icons.Check className="w-3.5 h-3.5"/>}
                      </button>

                      {/* Name + notes */}
                      <div className="flex-1 min-w-0">
                        <span className={`font-sans font-medium text-sm ${item.purchased ? 'line-through text-espresso-400' : 'text-espresso-800 dark:text-espresso-50'}`}>
                          {item.name}
                        </span>
                        {item.notes && (
                          <span className="text-xs text-espresso-400 mr-2 font-sans">· {item.notes}</span>
                        )}
                      </div>

                      {/* Qty + price */}
                      <div className="text-xs font-mono text-espresso-400 flex-shrink-0 hidden md:flex items-center gap-3">
                        <span>×{item.quantity}</span>
                        {item.unitPrice > 0 && <span>{fmt(item.unitPrice)}</span>}
                      </div>

                      {/* Owner badge */}
                      <button onClick={() => cycleOwner(item.id)}
                        title="לחץ לשינוי אחראי"
                        className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs border font-sans font-medium transition ${ownerStyle(item.owner)}`}>
                        {ownerLabel(item.owner) || '+אחראי'}
                      </button>

                      {/* Edit/delete */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <button onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-canvas dark:hover:bg-espresso-600 text-espresso-400 hover:text-terra-500 transition">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                            <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
                          </svg>
                        </button>
                        <button onClick={() => deleteItem(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-400 hover:text-rose-500 transition">
                          <Icons.Trash className="w-3.5 h-3.5"/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-4 border-t border-silk dark:border-espresso-700 text-center">
          <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="ערוך פריט" size="sm"
        footer={<><Button variant="ghost" onClick={editModal.close}>ביטול</Button><Button variant="primary" onClick={saveEdit}>שמור</Button></>}>
        {draft && <EquipmentForm draft={draft} onChange={setDraft} />}
      </Modal>

      {/* ── Add Modal ── */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="פריט חדש" size="sm"
        footer={<><Button variant="ghost" onClick={addModal.close}>ביטול</Button><Button variant="primary" onClick={saveAdd}>הוסף</Button></>}>
        {draft && <EquipmentForm draft={draft} onChange={setDraft} />}
      </Modal>
    </>
  )
}

function EquipmentForm({ draft, onChange }) {
  const set = (k, v) => onChange({ ...draft, [k]: v })
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">שם הפריט</label>
        <input value={draft.name} onChange={e => set('name', e.target.value)} className="input-field" placeholder="לדוגמה: מכונת גלידה"/>
      </div>
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">קטגוריה</label>
        <select value={draft.category} onChange={e => set('category', e.target.value)} className="input-field">
          {equipmentCategories.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">כמות</label>
          <input type="number" min="0" value={draft.quantity} onChange={e => set('quantity', e.target.value)} className="input-field text-center font-mono"/>
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">מחיר ליחידה (₪)</label>
          <input type="number" min="0" value={draft.unitPrice} onChange={e => set('unitPrice', e.target.value)} className="input-field text-center font-mono" placeholder="0"/>
        </div>
      </div>
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">אחראי לרכישה</label>
        <div className="flex gap-2">
          {[{ v:'', l:'לא הוגדר'}, {v:'me', l:'אני'}, {v:'partner', l:'שותף'}].map(o => (
            <button key={o.v} type="button" onClick={() => set('owner', o.v)}
              className={`flex-1 py-2 rounded-xl text-xs font-sans font-medium border transition ${
                draft.owner === o.v ? 'bg-terra-400 text-white border-terra-400' : 'bg-linen dark:bg-espresso-700 text-espresso-500 border-silk hover:border-bisque'
              }`}>{o.l}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">הערות</label>
        <input value={draft.notes} onChange={e => set('notes', e.target.value)} className="input-field" placeholder="הערה / מידע נוסף"/>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" id="eq-purchased" checked={draft.purchased} onChange={e => set('purchased', e.target.checked)} className="rounded"/>
        <label htmlFor="eq-purchased" className="text-sm font-sans text-espresso-700 dark:text-espresso-100">פריט זה נרכש</label>
      </div>
    </div>
  )
}
