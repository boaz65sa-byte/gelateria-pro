import { useState } from 'react'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { inventoryCategories } from '../../data/inventoryData.js'

export function InventoryItem({ item, onUpdate, onDelete }) {
  const editModal = useModal()
  const [draft, setDraft] = useState(null)

  const isLow      = item.quantity <= item.threshold
  const isCritical = item.quantity < item.threshold * 0.5

  const increment = () => onUpdate(item.id, { quantity: +(item.quantity + 1).toFixed(2) })
  const decrement = () => onUpdate(item.id, { quantity: Math.max(0, +(item.quantity - 1).toFixed(2)) })
  const setQty    = v  => onUpdate(item.id, { quantity: Math.max(0, parseFloat(v) || 0) })

  const openEdit = () => { setDraft({ ...item }); editModal.open() }
  const saveDraft = () => {
    onUpdate(item.id, {
      name:      draft.name,
      category:  draft.category,
      unit:      draft.unit,
      threshold: parseFloat(draft.threshold) || 0,
      supplier:  draft.supplier,
    })
    editModal.close()
  }

  return (
    <>
      <div className={`flex items-center gap-3 p-3 rounded-xl transition group ${
        isCritical ? 'bg-rose-50 dark:bg-rose-900/20'
        : isLow    ? 'bg-amber-50/60 dark:bg-amber-900/10'
        :            'hover:bg-linen dark:hover:bg-espresso-700/60'
      }`}>
        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm font-sans text-espresso-700 dark:text-espresso-100">{item.name}</span>
            {isCritical && <span className="badge-danger"><Icons.Alert className="w-3 h-3"/>קריטי</span>}
            {isLow && !isCritical && <span className="badge-terra">נמוך</span>}
          </div>
          <p className="text-xs text-espresso-400 dark:text-espresso-400 font-sans mt-0.5">
            {item.supplier} · סף {item.threshold} {item.unit}
          </p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-1">
          <button onClick={decrement} className="w-7 h-7 rounded-lg flex items-center justify-center text-espresso-400 hover:bg-white dark:hover:bg-espresso-600 transition">
            <Icons.Minus className="w-3.5 h-3.5"/>
          </button>
          <div className="flex items-baseline gap-1">
            <input type="number" min="0" step="0.1" value={item.quantity}
              onChange={e=>setQty(e.target.value)}
              className="w-14 text-center bg-transparent font-mono font-semibold text-sm border-none focus:outline-none focus:ring-2 focus:ring-terra-400 rounded py-1"/>
            <span className="text-xs text-espresso-400 w-10 font-sans">{item.unit}</span>
          </div>
          <button onClick={increment} className="w-7 h-7 rounded-lg flex items-center justify-center text-espresso-400 hover:bg-white dark:hover:bg-espresso-600 transition">
            <Icons.Plus className="w-3.5 h-3.5"/>
          </button>
        </div>

        {/* Edit + Delete */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={openEdit} className="w-7 h-7 rounded-lg flex items-center justify-center text-espresso-400 hover:bg-white dark:hover:bg-espresso-600 hover:text-terra-600 transition" title="ערוך פרטים">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
              <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
            </svg>
          </button>
          <button onClick={() => { if(window.confirm(`למחוק "${item.name}"?`)) onDelete(item.id) }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-espresso-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition">
            <Icons.Trash className="w-3.5 h-3.5"/>
          </button>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title={`ערוך פריט: ${item.name}`}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={editModal.close}>ביטול</Button>
            <Button variant="primary" onClick={saveDraft}>שמור</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-espresso-400 font-sans mb-1">שם הפריט</label>
              <input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} className="input-field"/>
            </div>
            <div>
              <label className="block text-xs text-espresso-400 font-sans mb-1">ספק</label>
              <input value={draft.supplier} onChange={e=>setDraft(d=>({...d,supplier:e.target.value}))} className="input-field"/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">קטגוריה</label>
                <select value={draft.category} onChange={e=>setDraft(d=>({...d,category:e.target.value}))} className="input-field">
                  {Object.entries(inventoryCategories).map(([k,c])=><option key={k} value={k}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">יחידות</label>
                <input value={draft.unit} onChange={e=>setDraft(d=>({...d,unit:e.target.value}))} className="input-field"/>
              </div>
            </div>
            <div>
              <label className="block text-xs text-espresso-400 font-sans mb-1">סף מלאי נמוך</label>
              <input type="number" min="0" step="0.1" value={draft.threshold} onChange={e=>setDraft(d=>({...d,threshold:e.target.value}))} className="input-field"/>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
