import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { recipes as defaultRecipes, calcBatchCost, calcCostPerServing, calculateRecipe } from '../../data/recipes.js'

const fmt2 = n => Number(n).toFixed(2)
const fmtP = n => `₪${fmt2(n)}`

const CATEGORY_META = {
  'soft-serve': { label:'סופט-סרב',  emoji:'🍦', color:'amber'  },
  'batter':     { label:'בצקים',     emoji:'🥞', color:'terra'  },
  'signature':  { label:'חתימה',     emoji:'⭐', color:'violet' },
}

const genIngId = () => `ing-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

export function RecipeCalculator() {
  const [recipes, setRecipes] = useLocalStorage('gelateria-recipes', defaultRecipes)
  const [selectedId, setSelectedId]   = useState(recipes[0]?.id || '')
  const [batches, setBatches]         = useState(1)
  const [printMode, setPrintMode]     = useState(false)

  const editModal = useModal()
  const [draft, setDraft] = useState(null)

  const recipe = useMemo(() => recipes.find(r => r.id === selectedId), [recipes, selectedId])
  const ingredients = useMemo(() => recipe ? calculateRecipe(recipe, batches) : [], [recipe, batches])

  const batchCost   = useMemo(() => recipe ? calcBatchCost(recipe) * batches : 0, [recipe, batches])
  const costPerServ = useMemo(() => recipe ? calcCostPerServing(recipe) : 0, [recipe])
  const totalYield  = useMemo(() => recipe ? recipe.yieldUnits * batches : 0, [recipe, batches])

  const fmt = (amount, unit) => {
    if (unit === 'ml' && amount >= 1000) return `${fmt2(amount/1000)} L`
    if (unit === 'g'  && amount >= 1000) return `${fmt2(amount/1000)} ק"ג`
    return `${amount} ${unit}`
  }

  // ── edit recipe ──────────────────────────────────────────────
  const openEdit = () => {
    setDraft(JSON.parse(JSON.stringify(recipe)))
    editModal.open()
  }
  const saveEdit = () => {
    setRecipes(prev => prev.map(r => r.id === draft.id ? draft : r))
    editModal.close()
  }
  const draftSetIng  = (id, k, v) => setDraft(d => ({ ...d, ingredients: d.ingredients.map(i => i.id===id ? {...i,[k]:v} : i) }))
  const draftDelIng  = id        => setDraft(d => ({ ...d, ingredients: d.ingredients.filter(i => i.id!==id) }))
  const draftAddIng  = ()        => setDraft(d => ({ ...d, ingredients: [...d.ingredients, {id:genIngId(),name:'',amount:0,unit:'g',costPerUnit:0}] }))

  const reset = () => { if(window.confirm('לאפס לברירת מחדל?')) setRecipes(defaultRecipes) }

  // ── grouped for sidebar ──────────────────────────────────────
  const grouped = useMemo(() => {
    const g = {}
    recipes.forEach(r => {
      const cat = r.category || 'batter'
      if (!g[cat]) g[cat] = []
      g[cat].push(r)
    })
    return g
  }, [recipes])

  if (printMode && recipe) {
    return (
      <div>
        <div className="no-print flex gap-2 mb-6">
          <Button variant="primary" onClick={() => window.print()}><Icons.Print className="w-4 h-4"/> הדפס</Button>
          <Button variant="secondary" onClick={() => setPrintMode(false)}><Icons.Close className="w-4 h-4"/> חזור</Button>
        </div>
        <div className="mb-4 pb-3 border-b-2 border-espresso-800">
          <h1 className="text-2xl font-serif font-bold">{recipe.name}</h1>
          <p className="text-sm text-espresso-400">{recipe.subtitle} · {batches} batch · {totalYield} מנות</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="font-serif font-semibold text-lg mb-3">מרכיבים</h2>
            <table className="w-full text-sm border-collapse">
              <thead><tr className="border-b border-silk bg-linen"><th className="text-right px-3 py-2">מרכיב</th><th className="text-center px-3 py-2">כמות</th><th className="text-left px-3 py-2">עלות</th></tr></thead>
              <tbody>
                {ingredients.map((ing,i)=>(
                  <tr key={ing.id||i} className={`border-b border-silk/50 ${i%2===0?'':'bg-linen/20'}`}>
                    <td className="px-3 py-2 font-medium">{ing.name}</td>
                    <td className="px-3 py-2 text-center font-mono">{fmt(ing.computed, ing.unit)}</td>
                    <td className="px-3 py-2 font-mono text-left">{fmtP(ing.amount*ing.costPerUnit*batches)}</td>
                  </tr>
                ))}
                <tr className="border-t-2 border-espresso-800 font-bold">
                  <td className="px-3 py-2">סה"כ batch</td><td/><td className="px-3 py-2 font-mono text-left">{fmtP(batchCost)}</td>
                </tr>
                <tr><td className="px-3 py-2 text-espresso-500">עלות למנה</td><td/><td className="px-3 py-2 font-mono text-left text-terra-500">{fmtP(costPerServ)}</td></tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="font-serif font-semibold text-lg mb-3">אופן הכנה</h2>
            <ol className="space-y-2 text-sm">
              {recipe.instructions.map((step,i)=>(
                <li key={i} className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-terra-400 text-white text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            {recipe.notes && <div className="mt-4 p-3 bg-amber-50 rounded-xl text-xs text-espresso-600">{recipe.notes}</div>}
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-silk text-center text-xs text-espresso-400">bs-simple.com · בועז סעדה — פתרונות יצירתיים</div>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif italic text-terra-400 mb-0.5">Ricette di produzione</p>
            <h1 className="text-3xl font-serif font-bold mb-1">מתכונים ותמחור</h1>
            <p className="text-sm text-espresso-400 font-sans">{recipes.length} מתכוני ייצור · עלות food cost אוטומטי</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setPrintMode(true)}><Icons.Print className="w-4 h-4"/> הדפס מתכון</Button>
            <Button variant="ghost" onClick={reset}><Icons.Reset className="w-4 h-4"/></Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">

          {/* Sidebar — recipe list */}
          <div className="space-y-3">
            {Object.entries(grouped).map(([catKey, catRecipes]) => {
              const meta = CATEGORY_META[catKey] || CATEGORY_META.batter
              return (
                <div key={catKey} className="card p-0 overflow-hidden">
                  <div className="px-4 py-2.5 bg-linen/60 dark:bg-espresso-800/60 border-b border-silk dark:border-espresso-700 flex items-center gap-2">
                    <span>{meta.emoji}</span>
                    <span className="text-xs font-sans font-semibold text-espresso-500 dark:text-espresso-300 uppercase tracking-wide">{meta.label}</span>
                  </div>
                  {catRecipes.map(r => (
                    <button key={r.id} onClick={() => setSelectedId(r.id)}
                      className={`w-full text-right px-4 py-3 border-b border-silk/50 dark:border-espresso-700/50 last:border-0 transition ${
                        selectedId===r.id ? 'bg-terra-50 dark:bg-terra-900/20 border-r-2 border-terra-400' : 'hover:bg-linen/50 dark:hover:bg-espresso-800/30'
                      }`}>
                      <p className={`text-sm font-medium font-sans ${selectedId===r.id?'text-terra-700 dark:text-terra-200':'text-espresso-700 dark:text-espresso-100'}`}>{r.name}</p>
                      <p className="text-xs text-espresso-400 font-sans mt-0.5">{r.yieldUnits} מנות · {fmtP(calcCostPerServing(r))}/מנה</p>
                    </button>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Main — recipe detail */}
          {recipe && (
            <div className="space-y-4">

              {/* Recipe header */}
              <div className="card">
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p className="font-serif italic text-terra-400 text-sm mb-0.5">{recipe.subtitle}</p>
                    <h2 className="text-2xl font-serif font-bold mb-1">{recipe.name}</h2>
                    <p className="text-sm text-espresso-400 font-sans">{recipe.description}</p>
                  </div>
                  <Button variant="secondary" onClick={openEdit} className="text-xs gap-1.5 flex-shrink-0 no-print">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                      <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
                    </svg>
                    [EDIT]
                  </Button>
                </div>

                {/* Batch selector */}
                <div className="bg-linen dark:bg-espresso-800 rounded-xl p-4 mb-4">
                  <p className="section-eyebrow mb-3">כמה batches לייצר?</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    {[0.5,1,1.5,2,3,5].map(n=>(
                      <button key={n} onClick={()=>setBatches(n)}
                        className={`px-4 py-2 rounded-xl text-sm font-mono font-medium transition border ${
                          batches===n?'bg-terra-400 text-white border-terra-400':'bg-white dark:bg-espresso-700 border-silk hover:border-terra-200'
                        }`}>×{n}</button>
                    ))}
                    <div className="flex items-center gap-2 mr-2">
                      <span className="text-xs text-espresso-400 font-sans">או הכנס:</span>
                      <input type="number" min="0.1" step="0.5" value={batches}
                        onChange={e=>setBatches(Math.max(0.1,parseFloat(e.target.value)||1))}
                        className="input-field w-20 text-center font-mono py-1.5"/>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { l:'מנות מ-batch זה', v:`${totalYield} מנות`,  c:'' },
                    { l:'עלות חומרים',      v:fmtP(batchCost),       c:'' },
                    { l:'עלות למנה',        v:fmtP(costPerServ),     c:'text-terra-500 dark:text-terra-300' },
                    { l:'זמן מנוחה',        v:recipe.restTime > 0 ? `${recipe.restTime} דק׳` : 'אין', c:'' },
                  ].map((s,i)=>(
                    <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
                      <p className="text-xs text-espresso-400 font-sans mb-1">{s.l}</p>
                      <p className={`text-xl font-serif font-bold ${s.c}`}>{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients table */}
              <div className="card p-0 overflow-hidden">
                <div className="px-5 py-3 bg-linen/60 dark:bg-espresso-800/60 border-b border-silk dark:border-espresso-700">
                  <p className="font-serif font-semibold">מרכיבים — ×{batches} batch</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="border-b border-silk dark:border-espresso-700 bg-linen/30">
                        <th className="text-right px-5 py-2.5 font-medium text-xs text-espresso-400">מרכיב</th>
                        <th className="text-center px-3 py-2.5 font-medium text-xs text-espresso-400">מקור (1 batch)</th>
                        <th className="text-center px-3 py-2.5 font-medium text-xs text-espresso-400">לייצור</th>
                        <th className="text-right px-4 py-2.5 font-medium text-xs text-espresso-400">עלות</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map((ing, idx) => (
                        <tr key={ing.id||idx} className={`border-b border-silk/40 dark:border-espresso-700/40 ${idx%2===0?'':'bg-linen/20 dark:bg-espresso-800/10'}`}>
                          <td className="px-5 py-3 font-medium text-espresso-800 dark:text-espresso-50">{ing.name}</td>
                          <td className="px-3 py-3 text-center text-xs font-mono text-espresso-400">{ing.amount} {ing.unit}</td>
                          <td className="px-3 py-3 text-center font-mono font-semibold text-terra-600 dark:text-terra-300">{fmt(ing.computed,ing.unit)}</td>
                          <td className="px-4 py-3 text-right font-mono text-xs text-espresso-500">{fmtP(ing.amount*ing.costPerUnit*batches)}</td>
                        </tr>
                      ))}
                      <tr className="border-t-2 border-silk dark:border-espresso-600 bg-linen/50 dark:bg-espresso-800/50">
                        <td colSpan={3} className="px-5 py-2.5 font-medium text-sm">סה"כ עלות חומרים</td>
                        <td className="px-4 py-2.5 text-right font-mono font-bold text-terra-600 dark:text-terra-300">{fmtP(batchCost)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-5 py-2 text-xs text-espresso-400">עלות למנת הגשה בודדת</td>
                        <td className="px-4 py-2 text-right font-mono text-xs font-bold text-terra-500">{fmtP(costPerServ)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Instructions */}
              <div className="card">
                <p className="section-eyebrow mb-4">אופן הכנה</p>
                <ol className="space-y-3">
                  {recipe.instructions.map((step, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="w-7 h-7 rounded-full bg-terra-400 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx+1}</span>
                      <span className="text-sm font-sans text-espresso-700 dark:text-espresso-100 leading-relaxed pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
                {recipe.notes && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                    <p className="text-xs font-sans text-amber-700 dark:text-amber-300 leading-relaxed">💡 {recipe.notes}</p>
                  </div>
                )}
                {recipe.shelfLife > 0 && (
                  <p className="mt-3 text-xs text-espresso-400 font-sans flex items-center gap-1">
                    <Icons.Clock className="w-3.5 h-3.5"/>
                    {recipe.restTime > 0 && <span>מנוחה: {recipe.restTime} דקות ·</span>}
                    חיי מדף: {recipe.shelfLife} שעות
                  </p>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ── Edit Modal ── */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close}
        title={`[EDIT] ${draft?.name || ''}`} size="lg"
        footer={<><Button variant="ghost" onClick={editModal.close}>ביטול</Button><Button variant="primary" onClick={saveEdit}>שמור שינויים</Button></>}>
        {draft && (
          <div className="space-y-5">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-espresso-400 font-sans mb-1">שם המתכון</label>
                <input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} className="input-field font-serif text-lg"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">כמות מנות מ-batch</label>
                <input type="number" min="1" value={draft.yieldUnits} onChange={e=>setDraft(d=>({...d,yieldUnits:parseInt(e.target.value)||1}))} className="input-field text-center font-mono"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">גודל מנה (g/ml)</label>
                <input type="number" min="1" value={draft.servingSize} onChange={e=>setDraft(d=>({...d,servingSize:parseInt(e.target.value)||1}))} className="input-field text-center font-mono"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">זמן מנוחה (דקות)</label>
                <input type="number" min="0" value={draft.restTime} onChange={e=>setDraft(d=>({...d,restTime:parseInt(e.target.value)||0}))} className="input-field text-center font-mono"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">חיי מדף (שעות)</label>
                <input type="number" min="0" value={draft.shelfLife} onChange={e=>setDraft(d=>({...d,shelfLife:parseInt(e.target.value)||0}))} className="input-field text-center font-mono"/>
              </div>
            </div>

            {/* Cost preview */}
            <div className="bg-linen dark:bg-espresso-800 rounded-xl p-3 text-sm font-sans">
              <div className="flex justify-between">
                <span className="text-espresso-500">עלות batch:</span>
                <span className="font-mono font-bold text-terra-500">{fmtP(calcBatchCost(draft))}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-espresso-500">עלות למנה:</span>
                <span className="font-mono font-bold text-terra-500">{fmtP(calcCostPerServing(draft))}</span>
              </div>
            </div>

            {/* Ingredients editor */}
            <div>
              <p className="section-eyebrow mb-2">מרכיבים</p>
              <div className="grid text-xs text-espresso-400 font-sans gap-2 mb-2 px-1" style={{gridTemplateColumns:'1fr 70px 50px 80px 28px'}}>
                <span>שם</span><span className="text-center">כמות</span><span className="text-center">יח׳</span><span className="text-center">₪/יח׳</span><span/>
              </div>
              <div className="space-y-1.5">
                {draft.ingredients.map((ing, idx) => (
                  <div key={ing.id||idx} className="grid items-center gap-2" style={{gridTemplateColumns:'1fr 70px 50px 80px 28px'}}>
                    <input value={ing.name} onChange={e=>draftSetIng(ing.id,  'name',e.target.value)} className="input-field py-1.5 text-sm" placeholder="שם מרכיב"/>
                    <input type="number" min="0" step="any" value={ing.amount} onChange={e=>draftSetIng(ing.id,'amount',parseFloat(e.target.value)||0)} className="input-field py-1.5 text-sm text-center font-mono"/>
                    <input value={ing.unit} onChange={e=>draftSetIng(ing.id,'unit',e.target.value)} className="input-field py-1.5 text-sm text-center" placeholder="g"/>
                    <input type="number" min="0" step="0.001" value={ing.costPerUnit} onChange={e=>draftSetIng(ing.id,'costPerUnit',parseFloat(e.target.value)||0)} className="input-field py-1.5 text-sm text-center font-mono"/>
                    <button onClick={()=>draftDelIng(ing.id)} className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition">
                      <Icons.Trash className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={draftAddIng} className="mt-2 flex items-center gap-1.5 text-sm text-terra-500 hover:text-terra-700 font-sans transition">
                <Icons.Plus className="w-4 h-4"/> הוסף מרכיב
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
