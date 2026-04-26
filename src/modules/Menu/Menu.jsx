import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import {
  defaultMenuItems, menuCategories,
  calcIngredientsCost, calcTotalCost, calcMargin, calcRecommendedPrice,
  TAGS_META,
} from '../../data/menuData.js'
import { formatDate } from '../../utils/dateFormat.js'

const genId = () => `m-${Date.now()}-${Math.random().toString(36).slice(2,6)}`
const fmt2  = n => isNaN(n) ? '0.00' : Number(n).toFixed(2)
const fmtP  = n => `₪${fmt2(n)}`

const MARGIN_GRADE = pct => {
  if (pct >= 65) return { label:'מעולה',   color:'text-sage-600 dark:text-sage-400',   bg:'bg-sage-50 dark:bg-sage-900/20'   }
  if (pct >= 50) return { label:'טוב',     color:'text-emerald-600 dark:text-emerald-400', bg:'bg-emerald-50 dark:bg-emerald-900/20' }
  if (pct >= 35) return { label:'מקובל',  color:'text-amber-600 dark:text-amber-400',  bg:'bg-amber-50 dark:bg-amber-900/20'  }
  return              { label:'לבדיקה',  color:'text-rose-600 dark:text-rose-400',    bg:'bg-rose-50 dark:bg-rose-900/20'    }
}

// ── Ingredient row ────────────────────────────────────────────────────────────
function IngRow({ ing, onChange, onDelete }) {
  const cost = ing.qty * ing.costPerUnit
  return (
    <div className="grid gap-2 items-center py-2 border-b border-silk dark:border-espresso-700 last:border-0"
         style={{gridTemplateColumns:'1fr 60px 54px 70px 70px 28px'}}>
      <input value={ing.name} onChange={e=>onChange({...ing,name:e.target.value})}
        className="input-field py-1.5 text-sm" placeholder="שם מרכיב"/>
      <input type="number" min="0" step="any" value={ing.qty}
        onChange={e=>onChange({...ing,qty:parseFloat(e.target.value)||0})}
        className="input-field py-1.5 text-sm text-center font-mono"/>
      <input value={ing.unit} onChange={e=>onChange({...ing,unit:e.target.value})}
        className="input-field py-1.5 text-sm text-center" placeholder="g"/>
      <input type="number" min="0" step="0.001" value={ing.costPerUnit}
        onChange={e=>onChange({...ing,costPerUnit:parseFloat(e.target.value)||0})}
        className="input-field py-1.5 text-sm text-center font-mono" placeholder="₪/יח׳"/>
      <div className="text-right text-xs font-mono text-espresso-500 dark:text-espresso-300 px-1">
        {fmtP(cost)}
      </div>
      <button onClick={onDelete} className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition">
        <Icons.Trash className="w-3.5 h-3.5"/>
      </button>
    </div>
  )
}

// ── Cost panel (inside edit modal) ────────────────────────────────────────────
function CostPanel({ draft }) {
  const [dailyServings, setDailyServings] = useState(20)
  const ingCost  = calcIngredientsCost(draft)
  const totalCost = calcTotalCost(draft)
  const margin   = calcMargin(draft)
  const rec60    = calcRecommendedPrice(draft, 60)
  const rec65    = calcRecommendedPrice(draft, 65)
  const grade    = MARGIN_GRADE(margin)
  const monthlyRevenue = Math.round(dailyServings * draft.price * 30)
  const monthlyCost    = Math.round(dailyServings * totalCost * 30)
  const monthlyProfit  = monthlyRevenue - monthlyCost

  return (
    <div className={`rounded-xl p-4 ${grade.bg} space-y-2`}>
      <p className="section-eyebrow mb-2">תמחור אוטומטי</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm font-sans">
        <span className="text-espresso-500 dark:text-espresso-300">עלות חומרים</span>
        <span className="font-mono font-medium text-left">{fmtP(ingCost)}</span>
        <span className="text-espresso-500 dark:text-espresso-300">תקורה ({draft.overheadPct}%)</span>
        <span className="font-mono font-medium text-left">{fmtP(totalCost - ingCost)}</span>
        <span className="text-espresso-500 dark:text-espresso-300">עלות כוללת</span>
        <span className="font-mono font-medium text-left">{fmtP(totalCost)}</span>
        <span className="text-espresso-500 dark:text-espresso-300">מחיר מכירה</span>
        <span className="font-mono font-bold text-left">₪{draft.price}</span>
        <span className="text-espresso-500 dark:text-espresso-300">רווח גולמי</span>
        <span className={`font-mono font-bold text-left ${grade.color}`}>{fmtP(draft.price - totalCost)}</span>
        <span className="text-espresso-500 dark:text-espresso-300">% מרווח</span>
        <span className={`font-mono font-bold text-left ${grade.color}`}>{margin}% — {grade.label}</span>
      </div>
      <div className="border-t border-white/40 pt-2 mt-2">
        <p className="text-xs text-espresso-400 font-sans mb-1.5">מחיר מומלץ לפי יעד:</p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={()=>{}} className="text-xs px-3 py-1.5 rounded-lg bg-white/60 dark:bg-espresso-700/60 font-mono hover:bg-white transition">
            60% מרווח → ₪{Math.ceil(rec60)}
          </button>
          <button onClick={()=>{}} className="text-xs px-3 py-1.5 rounded-lg bg-white/60 dark:bg-espresso-700/60 font-mono hover:bg-white transition">
            65% מרווח → ₪{Math.ceil(rec65)}
          </button>
        </div>
      </div>
      <div className="border-t border-white/40 pt-3 mt-2">
        <p className="text-xs text-espresso-400 font-sans mb-2">מחשבון Break-Even — כמה מנות ביום?</p>
        <div className="flex items-center gap-3 mb-2">
          <input type="range" min="1" max="100" step="1" value={dailyServings}
            onChange={e=>setDailyServings(parseInt(e.target.value))}
            className="flex-1"/>
          <span className="text-sm font-mono font-medium w-16 text-right">{dailyServings} מנות</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            {l:'הכנסה/חודש', v:`₪${monthlyRevenue.toLocaleString('he-IL')}`, c:''},
            {l:'עלות/חודש',  v:`₪${monthlyCost.toLocaleString('he-IL')}`,    c:'text-rose-600'},
            {l:'רווח/חודש',  v:`₪${monthlyProfit.toLocaleString('he-IL')}`,  c:monthlyProfit>0?'text-sage-600':'text-rose-600'},
          ].map((s,i)=>(
            <div key={i} className="bg-white/50 dark:bg-espresso-700/50 rounded-lg p-2">
              <p className="text-xs text-espresso-400 mb-0.5">{s.l}</p>
              <p className={`text-sm font-mono font-bold ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Edit / Add Modal Form ─────────────────────────────────────────────────────
function ItemForm({ draft, onChange }) {
  const set = (k,v) => onChange({...draft,[k]:v})
  const updateIng = (idx, updated) => onChange({...draft, ingredients: draft.ingredients.map((ing,i)=>i===idx?updated:ing)})
  const deleteIng = idx => onChange({...draft, ingredients: draft.ingredients.filter((_,i)=>i!==idx)})
  const addIng = () => onChange({...draft, ingredients:[...draft.ingredients,{name:'',qty:0,unit:'g',costPerUnit:0}]})

  return (
    <div className="space-y-5">
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">שם בעברית</label>
          <input value={draft.name} onChange={e=>set('name',e.target.value)} className="input-field font-serif text-base"/>
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">Name in English</label>
          <input value={draft.nameEn||''} onChange={e=>set('nameEn',e.target.value)} className="input-field" dir="ltr"/>
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">קטגוריה</label>
          <select value={draft.category} onChange={e=>set('category',e.target.value)} className="input-field">
            {menuCategories.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">מחיר מכירה (₪)</label>
          <input type="number" min="0" value={draft.price} onChange={e=>set('price',parseFloat(e.target.value)||0)} className="input-field font-mono text-lg text-center"/>
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs text-espresso-400 font-sans mb-1">תיאור</label>
          <textarea rows={2} value={draft.description} onChange={e=>set('description',e.target.value)} className="input-field resize-none text-sm"/>
        </div>
      </div>

      {/* Tags + active */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-espresso-400 font-sans">תגיות:</span>
        {Object.entries(TAGS_META).map(([t,meta])=>(
          <button key={t} type="button" onClick={()=>{
            const tags = (draft.tags||[]).includes(t) ? draft.tags.filter(x=>x!==t) : [...(draft.tags||[]),t]
            set('tags',tags)
          }}
            className={`px-2.5 py-1 rounded-full text-xs border transition ${(draft.tags||[]).includes(t)?meta.color:'bg-canvas text-espresso-400 border-silk hover:border-bisque'}`}>
            {meta.label}
          </button>
        ))}
        <div className="mr-auto flex items-center gap-2">
          <input type="checkbox" id="active-cb" checked={draft.active!==false} onChange={e=>set('active',e.target.checked)}/>
          <label htmlFor="active-cb" className="text-sm font-sans">מוצג בתפריט</label>
        </div>
      </div>

      {/* Overhead */}
      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">
          % תקורה (שכ"ד + עובדים + חשמל): {draft.overheadPct}%
        </label>
        <input type="range" min="0" max="60" step="1" value={draft.overheadPct}
          onChange={e=>set('overheadPct',parseInt(e.target.value))}
          className="w-full"/>
      </div>

      {/* Cost analysis */}
      <CostPanel draft={draft}/>

      {/* Ingredients */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="section-eyebrow mb-0">מרכיבים</p>
          <div className="grid text-xs text-espresso-400 font-sans gap-2" style={{gridTemplateColumns:'1fr 60px 54px 70px 70px 28px'}}>
            <span>שם</span><span className="text-center">כמות</span><span className="text-center">יח׳</span>
            <span className="text-center">₪/יח׳</span><span className="text-left px-1">עלות</span><span/>
          </div>
        </div>
        <div>
          {draft.ingredients.map((ing,idx)=>(
            <IngRow key={idx} ing={ing}
              onChange={updated=>updateIng(idx,updated)}
              onDelete={()=>deleteIng(idx)}/>
          ))}
        </div>
        <button onClick={addIng} className="mt-2 flex items-center gap-1.5 text-sm text-terra-500 hover:text-terra-700 transition font-sans">
          <Icons.Plus className="w-4 h-4"/> הוסף מרכיב
        </button>
      </div>
    </div>
  )
}

// ── Print view ────────────────────────────────────────────────────────────────
function PrintView({ items, categories, lang, showCost, onClose }) {
  const byCat = useMemo(()=>{
    const g={}
    items.filter(i=>i.active!==false).forEach(i=>{
      if(!g[i.category])g[i.category]=[]
      g[i.category].push(i)
    })
    return g
  },[items])

  return (
    <div>
      <div className="no-print flex flex-wrap gap-2 mb-6">
        <Button variant="primary" onClick={()=>window.print()}><Icons.Print className="w-4 h-4"/> הדפס</Button>
        <Button variant="secondary" onClick={onClose}><Icons.Close className="w-4 h-4"/> חזור</Button>
      </div>
      <div className="mb-6 pb-4 border-b-2 border-espresso-800 text-center">
        <h1 className="text-3xl font-serif font-bold mb-1">The Sweet Station</h1>
        <p className="text-sm text-espresso-400 font-sans">{formatDate(new Date())}</p>
      </div>
      {Object.entries(byCat).map(([catId,catItems])=>{
        const cat = categories.find(c=>c.id===catId)
        return (
          <div key={catId} className="mb-8 avoid-break">
            <h2 className="text-xl font-serif font-bold mb-3 flex items-center gap-2">
              <span>{cat?.emoji}</span>
              <span>{lang==='en'?cat?.labelEn:cat?.label}</span>
            </h2>
            <table className="w-full text-sm font-sans border-collapse">
              <tbody>
                {catItems.map(item=>{
                  const margin = calcMargin(item)
                  const grade  = MARGIN_GRADE(margin)
                  return (
                    <tr key={item.id} className="border-b border-silk">
                      <td className="py-3 pr-2 w-8">
                        {(item.tags||[]).map(t=>(
                          <span key={t} className={`inline-flex px-1.5 py-0.5 rounded text-xs border mr-1 ${TAGS_META[t]?.color}`}>
                            {TAGS_META[t]?.label}
                          </span>
                        ))}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-medium">{lang==='en'?(item.nameEn||item.name):item.name}</div>
                        {lang==='both'&&item.nameEn&&<div className="text-xs text-espresso-400 mt-0.5">{item.nameEn}</div>}
                        <div className="text-xs text-espresso-400 mt-0.5 leading-relaxed">{item.description}</div>
                      </td>
                      <td className="py-3 px-2 text-right font-serif font-bold text-lg whitespace-nowrap">
                        ₪{item.price}
                      </td>
                      {showCost && (
                        <td className="py-3 px-2 text-right text-xs">
                          <div className={`font-medium ${grade.color}`}>{margin}%</div>
                          <div className="text-espresso-400">{fmtP(calcTotalCost(item))}</div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )
      })}
      <div className="mt-8 pt-4 border-t border-silk text-center">
        <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function Menu() {
  const [items, setItems]   = useLocalStorage('gelateria-menu-items', defaultMenuItems)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [lang, setLang]     = useState('he')
  const [printMode, setPrintMode]   = useState(false)
  const [showCostPrint, setShowCostPrint] = useState(false)

  const editModal = useModal()
  const addModal  = useModal()
  const costModal = useModal()
  const [draft, setDraft] = useState(null)

  // filtered
  const visible = useMemo(()=>{
    let list = items
    if (filter==='active')   list = list.filter(i=>i.active!==false)
    else if (filter==='inactive') list = list.filter(i=>i.active===false)
    else if (filter!=='all') list = list.filter(i=>i.category===filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(i=>i.name.toLowerCase().includes(q)||(i.nameEn||'').toLowerCase().includes(q)||(i.description||'').toLowerCase().includes(q))
    }
    return list
  },[items,filter,search])

  const grouped = useMemo(()=>{
    const g={}
    visible.forEach(i=>{ if(!g[i.category])g[i.category]=[]; g[i.category].push(i) })
    return g
  },[visible])

  // stats
  const stats = useMemo(()=>{
    const active = items.filter(i=>i.active!==false)
    const margins = active.map(calcMargin)
    const avgMargin = margins.length ? Math.round(margins.reduce((s,m)=>s+m,0)/margins.length) : 0
    const alerts = active.filter(i=>calcMargin(i)<35).length
    return { total:items.length, active:active.length, avgMargin, alerts }
  },[items])

  const openEdit = item => { setDraft(JSON.parse(JSON.stringify(item))); editModal.open() }
  const saveEdit = () => { setItems(prev=>prev.map(i=>i.id===draft.id?draft:i)); editModal.close() }
  const openAdd  = () => {
    setDraft({id:null,name:'',nameEn:'',category:'waffle',price:0,overheadPct:35,description:'',ingredients:[],tags:[],active:true})
    addModal.open()
  }
  const saveAdd  = () => {
    if(!draft?.name) return
    setItems(prev=>[...prev,{...draft,id:genId()}])
    addModal.close()
  }
  const deleteItem = id => { if(window.confirm('למחוק מנה זו?')) setItems(prev=>prev.filter(i=>i.id!==id)) }
  const toggleActive = id => setItems(prev=>prev.map(i=>i.id===id?{...i,active:i.active===false?true:false}:i))
  const reset = () => { if(window.confirm('לאפס לתפריט המקורי?')) setItems(defaultMenuItems) }

  if (printMode) return (
    <PrintView items={items} categories={menuCategories} lang={lang}
      showCost={showCostPrint} onClose={()=>setPrintMode(false)}/>
  )

  return (
    <>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif italic text-terra-400 mb-0.5">Menu · תפריט</p>
            <h1 className="text-3xl font-serif font-bold mb-1">The Sweet Station</h1>
            <p className="text-sm text-espresso-400 font-sans">
              {stats.active} מנות פעילות · מרווח ממוצע {stats.avgMargin}%
              {stats.alerts>0&&<span className="text-rose-500 font-medium"> · {stats.alerts} מנות לבדיקת תמחור</span>}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={openAdd}><Icons.Plus className="w-4 h-4"/> מנה חדשה</Button>
            <div className="flex gap-1">
              <Button variant="secondary" onClick={()=>{setPrintMode(true);setShowCostPrint(false)}} className="text-xs">
                <Icons.Print className="w-4 h-4"/> תפריט
              </Button>
              <Button variant="secondary" onClick={()=>{setPrintMode(true);setShowCostPrint(true)}} className="text-xs">
                <Icons.Print className="w-4 h-4"/> + עלויות
              </Button>
            </div>
            <Button variant="ghost" onClick={reset}><Icons.Reset className="w-4 h-4"/></Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {l:'סה"כ מנות',     v:stats.total,      c:''},
            {l:'פעילות',         v:stats.active,     c:'text-sage-600 dark:text-sage-400'},
            {l:'מרווח ממוצע',   v:`${stats.avgMargin}%`, c: stats.avgMargin>=50?'text-sage-600 dark:text-sage-400':stats.avgMargin>=35?'text-amber-600 dark:text-amber-400':'text-rose-600'},
            {l:'לבדיקת תמחור', v:stats.alerts,     c:stats.alerts>0?'text-rose-600 dark:text-rose-400':''},
          ].map((s,i)=>(
            <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
              <p className="text-xs text-espresso-400 font-sans uppercase tracking-wide mb-1">{s.l}</p>
              <p className={`text-2xl font-serif font-bold ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>

        {/* Lang + search + filters */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1 bg-linen dark:bg-espresso-800 rounded-xl p-1">
              {[{k:'he',l:'עברית'},{k:'en',l:'EN'},{k:'both',l:'שניהם'}].map(o=>(
                <button key={o.k} onClick={()=>setLang(o.k)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-sans font-medium transition ${lang===o.k?'bg-white dark:bg-espresso-700 text-espresso-800 dark:text-espresso-50':'text-espresso-400 hover:text-espresso-700'}`}>
                  {o.l}
                </button>
              ))}
            </div>
            <input value={search} onChange={e=>setSearch(e.target.value)} className="input-field flex-1" placeholder="חפש מנה..."/>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              {key:'all',     label:'הכל'},
              {key:'active',  label:'פעיל'},
              ...menuCategories.map(c=>({key:c.id, label:`${c.emoji} ${lang==='en'?c.labelEn:c.label}`}))
            ].map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium transition border ${
                  filter===f.key?'bg-espresso-800 dark:bg-espresso-600 text-white border-transparent':'bg-white dark:bg-espresso-700 border-silk text-espresso-500 hover:border-terra-200'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu items */}
        <div className="space-y-4">
          {Object.keys(grouped).length===0&&(
            <div className="card text-center py-12 text-espresso-400 font-sans">אין מנות להצגה</div>
          )}
          {Object.entries(grouped).map(([catId,catItems])=>{
            const cat = menuCategories.find(c=>c.id===catId)
            const catName = lang==='en' ? cat?.labelEn : cat?.label
            return (
              <div key={catId} className="card p-0 overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 bg-linen/60 dark:bg-espresso-800/60 border-b border-silk dark:border-espresso-700">
                  <span>{cat?.emoji}</span>
                  <span className="font-serif font-semibold text-sm">{catName}</span>
                  <span className="text-xs text-espresso-400 font-sans">({catItems.length})</span>
                  {(() => {
                    const avg = Math.round(catItems.reduce((s,i) => s + calcMargin(i), 0) / catItems.length)
                    const color = avg >= 55 ? 'text-sage-600 dark:text-sage-400' : avg >= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-rose-500'
                    return <span className={`mr-auto text-xs font-mono font-medium ${color}`}>מרווח ממוצע {avg}%</span>
                  })()}
                </div>
                <div className="divide-y divide-silk/40 dark:divide-espresso-700/40">
                  {catItems.map(item=>{
                    const margin = calcMargin(item)
                    const grade  = MARGIN_GRADE(margin)
                    const ingCost = calcIngredientsCost(item)
                    const isOff  = item.active===false
                    return (
                      <div key={item.id}
                        className={`flex items-start gap-3 px-4 py-3 group transition ${isOff?'opacity-40':''} hover:bg-linen/30 dark:hover:bg-espresso-800/30`}>

                        {/* Active toggle */}
                        <button onClick={()=>toggleActive(item.id)}
                          className={`mt-1 w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${isOff?'border-silk dark:border-espresso-500':'border-terra-400 bg-terra-400'}`}>
                          {!isOff&&<Icons.Check className="w-2.5 h-2.5 text-white"/>}
                        </button>

                        {/* Name + desc */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2 flex-wrap">
                            <span className={`font-sans font-medium text-sm ${isOff?'line-through text-espresso-400':'text-espresso-800 dark:text-espresso-50'}`}>
                              {lang==='en'?(item.nameEn||item.name):item.name}
                            </span>
                            {lang==='both'&&item.nameEn&&(
                              <span className="text-xs text-espresso-400 font-sans">{item.nameEn}</span>
                            )}
                            {(item.tags||[]).map(t=>(
                              <span key={t} className={`text-xs px-1.5 py-0.5 rounded border ${TAGS_META[t]?.color}`}>
                                {TAGS_META[t]?.label}
                              </span>
                            ))}
                          </div>
                          <p className="text-xs text-espresso-400 font-sans mt-0.5 leading-relaxed line-clamp-2">{item.description}</p>
                          {/* Cost mini-bar */}
                          {ingCost > 0 && (
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="w-20 h-1 rounded-full bg-silk dark:bg-espresso-600 overflow-hidden">
                                <div className={`h-full rounded-full ${margin>=50?'bg-sage-400':margin>=35?'bg-amber-400':'bg-rose-400'}`}
                                  style={{width:`${Math.min(100,Math.max(0,margin))}%`}}/>
                              </div>
                              <span className={`text-xs font-mono ${grade.color}`}>{margin}%</span>
                              <span className="text-xs text-espresso-400 font-sans">עלות {fmtP(calcTotalCost(item))}</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right flex-shrink-0 pt-0.5">
                          <p className="font-serif font-bold text-lg">₪{item.price}</p>
                          {ingCost>0&&<p className={`text-xs font-mono ${grade.color}`}>{grade.label}</p>}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button onClick={()=>openEdit(item)}
                            className="p-1.5 rounded-lg hover:bg-canvas dark:hover:bg-espresso-600 text-espresso-400 hover:text-terra-500 transition"
                            title="ערוך">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                              <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button onClick={()=>deleteItem(item.id)}
                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-400 hover:text-rose-500 transition"
                            title="מחק">
                            <Icons.Trash className="w-3.5 h-3.5"/>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        <div className="pt-4 border-t border-silk dark:border-espresso-700 text-center">
          <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
        </div>
      </div>

      {/* Edit */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="ערוך מנה" size="lg"
        footer={<><Button variant="ghost" onClick={editModal.close}>ביטול</Button><Button variant="primary" onClick={saveEdit}>שמור שינויים</Button></>}>
        {draft && <ItemForm draft={draft} onChange={setDraft}/>}
      </Modal>

      {/* Add */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="מנה חדשה" size="lg"
        footer={<><Button variant="ghost" onClick={addModal.close}>ביטול</Button><Button variant="primary" onClick={saveAdd}>הוסף לתפריט</Button></>}>
        {draft && <ItemForm draft={draft} onChange={setDraft}/>}
      </Modal>
    </>
  )
}
