import { useMemo, useState } from 'react'
import { calculateRecipe } from '../../data/recipes.js'
import { useModal } from '../../hooks/useModal.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Modal } from '../../components/ui/Modal.jsx'

const UNITS = ['g','kg','ml','l','כף','כפית','יחידות']
const genId = () => `ing-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

export function RecipeCard({ recipe, targetKg, onRecipeChange }) {
  const editModal = useModal()
  const [draft, setDraft] = useState(null)

  const ingredients = useMemo(() => calculateRecipe(recipe, targetKg), [recipe, targetKg])
  const totalGrams   = useMemo(() => ingredients.reduce((s,i) => s+i.computed, 0), [ingredients])
  const fmt = g => g >= 1000 ? `${(g/1000).toFixed(2)} ק"ג` : `${g} g`

  const openEdit = () => { setDraft(JSON.parse(JSON.stringify(recipe))); editModal.open() }
  const saveDraft = () => { onRecipeChange(draft); editModal.close() }

  const draftUpdateIng = (id,k,v) =>
    setDraft(d => ({ ...d, ingredients: d.ingredients.map(i => i.id===id ? {...i,[k]:v} : i) }))
  const draftDeleteIng = id =>
    setDraft(d => ({ ...d, ingredients: d.ingredients.filter(i => i.id!==id) }))
  const draftAddIng = () =>
    setDraft(d => ({ ...d, ingredients: [...d.ingredients, {id:genId(),name:'מרכיב חדש',amount:0,unit:'g'}] }))
  const draftUpdateStep = (idx,val) =>
    setDraft(d => ({ ...d, instructions: d.instructions.map((s,i) => i===idx ? val : s) }))
  const draftDeleteStep = idx =>
    setDraft(d => ({ ...d, instructions: d.instructions.filter((_,i) => i!==idx) }))
  const draftAddStep = () =>
    setDraft(d => ({ ...d, instructions: [...d.instructions, 'שלב חדש'] }))

  return (
    <>
      <div className="card avoid-break">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="font-serif italic text-terra-500 dark:text-terra-300 text-sm mb-0.5">Ricetta</p>
            <h2 className="text-2xl font-serif font-bold">{recipe.name}</h2>
            <p className="text-sm text-espresso-400 font-sans">{recipe.subtitle}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0 no-print">
            <Button variant="secondary" onClick={openEdit} className="text-xs gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
              </svg>
              ערוך
            </Button>
            <Button variant="secondary" onClick={() => window.print()} className="text-xs">
              <Icons.Print className="w-4 h-4"/>
            </Button>
          </div>
        </div>

        {/* Meta strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
          {[
            {label:'כמות סופית', value:`${targetKg} ק"ג`},
            {label:'סך חומרים',  value:fmt(totalGrams)},
            ...(recipe.restTime>0 ? [{label:'זמן מנוחה',value:`${recipe.restTime} דק׳`}] : []),
            {label:'חיי מדף',    value:`${recipe.shelfLife} שע'`},
          ].map((m,i) => (
            <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3 text-right">
              <p className="section-eyebrow mb-1">{m.label}</p>
              <p className="font-serif font-bold text-xl">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Ingredients table */}
          <section>
            <p className="section-eyebrow">מרכיבים</p>
            <div className="rounded-xl border border-silk dark:border-espresso-600 overflow-hidden">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="bg-linen dark:bg-espresso-800">
                    <th className="text-right px-4 py-2.5 text-xs text-espresso-400 font-medium">מרכיב</th>
                    <th className="text-center px-2 py-2.5 text-xs text-espresso-400 font-medium">מקור</th>
                    <th className="text-left px-4 py-2.5 text-xs text-espresso-400 font-medium">מחושב</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ing,idx) => (
                    <tr key={ing.id} className={`border-t border-silk dark:border-espresso-700 ${idx%2===0?'':'bg-linen/30 dark:bg-espresso-800/30'}`}>
                      <td className="px-4 py-2.5 font-medium text-espresso-700 dark:text-espresso-100">{ing.name}</td>
                      <td className="px-2 py-2.5 text-center text-xs font-mono text-espresso-400">{ing.amount} {ing.unit}</td>
                      <td className="px-4 py-2.5 font-mono font-semibold text-left text-terra-600 dark:text-terra-300">{fmt(ing.computed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Instructions */}
          <section>
            <p className="section-eyebrow">אופן הכנה</p>
            <ol className="space-y-2.5">
              {recipe.instructions.map((step,idx) => (
                <li key={idx} className="flex gap-3 text-sm font-sans">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-terra-100 dark:bg-terra-900/40 text-terra-700 dark:text-terra-300 text-xs font-bold flex items-center justify-center mt-0.5">{idx+1}</span>
                  <span className="text-espresso-700 dark:text-espresso-100 leading-relaxed pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <Modal
        isOpen={editModal.isOpen}
        onClose={editModal.close}
        title={`ערוך: ${recipe.name}`}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={editModal.close}>ביטול</Button>
            <Button variant="primary" onClick={saveDraft}>שמור שינויים</Button>
          </>
        }
      >
        {draft && (
          <div className="space-y-6">
            {/* Name & meta */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-espresso-400 font-sans mb-1">שם המתכון</label>
                <input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} className="input-field font-serif text-lg"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">זמן מנוחה (דקות)</label>
                <input type="number" min="0" value={draft.restTime} onChange={e=>setDraft(d=>({...d,restTime:parseInt(e.target.value)||0}))} className="input-field"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">חיי מדף (שעות)</label>
                <input type="number" min="1" value={draft.shelfLife} onChange={e=>setDraft(d=>({...d,shelfLife:parseInt(e.target.value)||1}))} className="input-field"/>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <p className="section-eyebrow mb-3">מרכיבים (ל-1 ק"ג בצק)</p>
              <div className="space-y-2">
                {draft.ingredients.map(ing => (
                  <div key={ing.id} className="flex items-center gap-2">
                    <input value={ing.name} onChange={e=>draftUpdateIng(ing.id,'name',e.target.value)} className="input-field flex-1 text-sm" placeholder="שם מרכיב"/>
                    <input type="number" min="0" step="any" value={ing.amount} onChange={e=>draftUpdateIng(ing.id,'amount',parseFloat(e.target.value)||0)} className="input-field w-20 text-center font-mono text-sm"/>
                    <select value={ing.unit} onChange={e=>draftUpdateIng(ing.id,'unit',e.target.value)} className="input-field w-16 text-sm">
                      {UNITS.map(u=><option key={u} value={u}>{u}</option>)}
                    </select>
                    <button onClick={()=>draftDeleteIng(ing.id)} className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition flex-shrink-0">
                      <Icons.Trash className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={draftAddIng} className="mt-2 flex items-center gap-1.5 text-sm text-terra-600 dark:text-terra-300 font-sans font-medium hover:text-terra-700 transition">
                <Icons.Plus className="w-4 h-4"/> הוסף מרכיב
              </button>
            </div>

            {/* Steps */}
            <div>
              <p className="section-eyebrow mb-3">שלבי הכנה</p>
              <div className="space-y-2">
                {draft.instructions.map((step,idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-terra-100 dark:bg-terra-900/30 text-terra-700 dark:text-terra-300 text-xs font-bold flex items-center justify-center flex-shrink-0">{idx+1}</span>
                    <input value={step} onChange={e=>draftUpdateStep(idx,e.target.value)} className="input-field flex-1 text-sm"/>
                    <button onClick={()=>draftDeleteStep(idx)} className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition flex-shrink-0">
                      <Icons.Trash className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={draftAddStep} className="mt-2 flex items-center gap-1.5 text-sm text-terra-600 dark:text-terra-300 font-sans font-medium hover:text-terra-700 transition">
                <Icons.Plus className="w-4 h-4"/> הוסף שלב
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
