import { useState } from 'react'
import { DishImage } from '../../components/ui/DishPlaceholder.jsx'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

const genId = () => `l-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

export function DishDetail({ dish, onBack, onDishChange }) {
  const editModal = useModal()
  const [draft, setDraft] = useState(null)

  const openEdit  = () => { setDraft(JSON.parse(JSON.stringify(dish))); editModal.open() }
  const saveDraft = () => { onDishChange(draft); editModal.close() }

  const draftUpdateLayer = (id,changes) =>
    setDraft(d => ({ ...d, layers: d.layers.map(l => (l.id||String(l.order))===String(id) ? {...l,...changes} : l) }))
  const draftDeleteLayer = id =>
    setDraft(d => ({ ...d, layers: d.layers.filter(l => (l.id||String(l.order))!==String(id)) }))
  const draftAddLayer = () =>
    setDraft(d => ({ ...d, layers: [...d.layers, { id:genId(), order:d.layers.length+1, title:'שלב חדש', detail:'פרטים' }] }))
  const draftUpdateTip = (idx,val) =>
    setDraft(d => ({ ...d, tips: d.tips.map((t,i) => i===idx ? val : t) }))
  const draftDeleteTip = idx =>
    setDraft(d => ({ ...d, tips: d.tips.filter((_,i) => i!==idx) }))
  const draftAddTip = () =>
    setDraft(d => ({ ...d, tips: [...(d.tips||[]), 'טיפ חדש'] }))

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between no-print">
          <button onClick={onBack} className="inline-flex items-center gap-1 text-sm text-espresso-400 hover:text-terra-600 transition font-sans">
            <Icons.ChevronLeft className="w-4 h-4 rotate-180"/> חזור לגלריה
          </button>
          <Button variant="secondary" onClick={openEdit} className="text-xs gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
              <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
            </svg>
            ערוך מנה
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <DishImage dish={dish} className="aspect-[4/3] w-full rounded-xl"/>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[{label:'מחיר',value:`₪${dish.price}`},{label:'זמן הכנה',value:`${dish.prepTime} דק׳`},{label:'שלבים',value:dish.layers.length}].map((m,i)=>(
                <div key={i} className="bg-linen dark:bg-espresso-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-espresso-400 font-sans mb-1">{m.label}</p>
                  <p className="font-serif font-semibold">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-serif font-bold">{dish.name}</h1>
                <p className="text-sm text-espresso-400 font-sans">{dish.subtitle}</p>
              </div>
              <Button variant="secondary" onClick={()=>window.print()} className="no-print text-xs flex-shrink-0">
                <Icons.Print className="w-4 h-4"/>
              </Button>
            </div>

            <p className="text-sm font-sans text-espresso-700 dark:text-espresso-100 mb-6 leading-relaxed">{dish.description}</p>

            <section className="mb-6">
              <p className="section-eyebrow">סדר הגשה</p>
              <ol className="space-y-3">
                {dish.layers.map((layer,li) => (
                  <li key={layer.id||li} className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-terra-400 text-white text-sm font-bold flex items-center justify-center">{layer.order||li+1}</div>
                    <div className="flex-1 pt-0.5">
                      <p className="font-medium text-sm font-sans">{layer.title}</p>
                      <p className="text-xs text-espresso-400 font-sans mt-0.5">{layer.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {dish.tips?.length>0 && (
              <section>
                <p className="section-eyebrow">טיפים</p>
                <ul className="space-y-2">
                  {dish.tips.map((tip,idx) => (
                    <li key={idx} className="flex gap-2 p-3 bg-terra-50 dark:bg-terra-900/20 rounded-lg text-sm">
                      <span className="text-terra-500 font-bold flex-shrink-0">✓</span>
                      <span className="text-espresso-700 dark:text-espresso-100 font-sans">{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title={`ערוך: ${dish.name}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={editModal.close}>ביטול</Button>
            <Button variant="primary" onClick={saveDraft}>שמור שינויים</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-5">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-espresso-400 font-sans mb-1">שם המנה</label>
                <input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} className="input-field font-serif text-lg"/>
              </div>
              <div className="col-span-2">
                <label className="block text-xs text-espresso-400 font-sans mb-1">תיאור</label>
                <textarea rows="2" value={draft.description} onChange={e=>setDraft(d=>({...d,description:e.target.value}))} className="input-field resize-none"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">מחיר (₪)</label>
                <input type="number" min="0" value={draft.price} onChange={e=>setDraft(d=>({...d,price:parseFloat(e.target.value)||0}))} className="input-field"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">זמן הכנה (דק׳)</label>
                <input type="number" min="1" value={draft.prepTime} onChange={e=>setDraft(d=>({...d,prepTime:parseInt(e.target.value)||1}))} className="input-field"/>
              </div>
            </div>

            {/* Layers */}
            <div>
              <p className="section-eyebrow mb-3">שלבי הגשה</p>
              <div className="space-y-2">
                {draft.layers.map((layer,li) => {
                  const lid = layer.id || String(layer.order)
                  return (
                    <div key={lid} className="flex items-start gap-2 p-2.5 rounded-xl bg-linen dark:bg-espresso-700 border border-silk dark:border-espresso-600">
                      <span className="w-6 h-6 rounded-full bg-terra-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{layer.order||li+1}</span>
                      <div className="flex-1 space-y-1.5">
                        <input value={layer.title} onChange={e=>draftUpdateLayer(lid,{title:e.target.value})} className="input-field text-sm py-1.5" placeholder="כותרת שלב"/>
                        <input value={layer.detail} onChange={e=>draftUpdateLayer(lid,{detail:e.target.value})} className="input-field text-xs py-1.5 text-espresso-500" placeholder="פרטים"/>
                      </div>
                      <button onClick={()=>draftDeleteLayer(lid)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition mt-0.5 flex-shrink-0">
                        <Icons.Trash className="w-3.5 h-3.5"/>
                      </button>
                    </div>
                  )
                })}
              </div>
              <button onClick={draftAddLayer} className="mt-2 flex items-center gap-1.5 text-sm text-terra-600 dark:text-terra-300 font-sans font-medium hover:text-terra-700 transition">
                <Icons.Plus className="w-4 h-4"/> הוסף שלב
              </button>
            </div>

            {/* Tips */}
            <div>
              <p className="section-eyebrow mb-3">טיפים</p>
              <div className="space-y-2">
                {(draft.tips||[]).map((tip,idx) => (
                  <div key={idx} className="flex gap-2">
                    <input value={tip} onChange={e=>draftUpdateTip(idx,e.target.value)} className="input-field flex-1 text-sm"/>
                    <button onClick={()=>draftDeleteTip(idx)} className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition flex-shrink-0">
                      <Icons.Trash className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={draftAddTip} className="mt-2 flex items-center gap-1.5 text-sm text-terra-600 dark:text-terra-300 font-sans font-medium hover:text-terra-700 transition">
                <Icons.Plus className="w-4 h-4"/> הוסף טיפ
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
