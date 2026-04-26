import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import {
  bases, sizes, toppings, toppingCategories, signatureCombos,
  sizeGrams, baseColors, baseTypes,
} from '../../data/frozenStationData.js'

const genId = () => `top-${Date.now()}-${Math.random().toString(36).slice(2,5)}`
const fmtP  = n => `₪${Number(n).toFixed(0)}`

// ── views ─────────────────────────────────────────────────────────────────────
const VIEWS = [
  { id:'builder',  label:'בנה קערה',       emoji:'🍧' },
  { id:'toppings', label:'תוספות',          emoji:'✨' },
  { id:'combos',   label:'קומבינות חתימה', emoji:'⭐' },
  { id:'checklist',label:'צ\'קליסט תחנה',  emoji:'📋' },
]

// ── Topping pill ──────────────────────────────────────────────────────────────
function ToppingPill({ t, selected, onClick }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-medium border transition ${
        selected
          ? 'bg-terra-400 text-white border-terra-400 shadow-sm'
          : 'bg-white dark:bg-espresso-700 border-silk dark:border-espresso-600 text-espresso-600 dark:text-espresso-200 hover:border-terra-200'
      }`}>
      <span>{t.emoji}</span>
      <span>{t.name}</span>
      <span className={`font-mono ${selected ? 'text-white/80' : 'text-espresso-400'}`}>+{fmtP(t.price)}</span>
    </button>
  )
}

// ── Bowl Builder ──────────────────────────────────────────────────────────────
function BowlBuilder({ allToppings, onSave }) {
  const [selectedBase, setBase]         = useState(bases[0].id)
  const [selectedSize, setSize]         = useState('m')
  const [selectedToppings, setToppings] = useState([])
  const [lang, setLang]                 = useState('he')

  const base    = bases.find(b => b.id === selectedBase)
  const size    = sizes.find(s => s.id === selectedSize)

  const totalPrice = useMemo(() => {
    const basePrice = base?.price[selectedSize] || 0
    const topPrice  = selectedToppings.reduce((s,id) => {
      const t = allToppings.find(t => t.id === id)
      return s + (t?.price || 0)
    }, 0)
    return basePrice + topPrice
  }, [base, selectedSize, selectedToppings, allToppings])

  const totalCost = useMemo(() => {
    const baseCost = (base?.costPerG || 0) * sizeGrams[selectedSize]
    const topCost  = selectedToppings.reduce((s,id) => {
      const t = allToppings.find(t => t.id === id)
      return s + (t?.cost || 0)
    }, 0)
    return baseCost + topCost
  }, [base, selectedSize, selectedToppings, allToppings])

  const margin = totalPrice > 0 ? Math.round(((totalPrice - totalCost) / totalPrice) * 100) : 0

  const toggleTopping = id => {
    setToppings(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const clear = () => setToppings([])

  // Group bases by type
  const basesGrouped = useMemo(() => {
    const g = {}
    bases.forEach(b => {
      if (!g[b.type]) g[b.type] = []
      g[b.type].push(b)
    })
    return g
  }, [])

  return (
    <div className="space-y-5">

      {/* Lang toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-espresso-400 font-sans">שפה:</span>
        <div className="flex gap-1 bg-linen dark:bg-espresso-800 rounded-xl p-1">
          {[{k:'he',l:'עברית'},{k:'en',l:'EN'}].map(o=>(
            <button key={o.k} onClick={()=>setLang(o.k)}
              className={`px-3 py-1 rounded-lg text-xs font-sans font-medium transition ${lang===o.k?'bg-white dark:bg-espresso-700 text-espresso-800 dark:text-espresso-50':'text-espresso-400 hover:text-espresso-700'}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>

      {/* Base selection */}
      <div>
        <p className="section-eyebrow mb-3">בחר בסיס</p>
        <div className="space-y-3">
          {Object.entries(basesGrouped).map(([type, typeBase]) => {
            const typeMeta = baseTypes[type]
            return (
              <div key={type}>
                <p className="text-xs text-espresso-400 font-sans mb-2 flex items-center gap-1">
                  <span>{typeMeta.emoji}</span> {typeMeta.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {typeBase.map(b => (
                    <button key={b.id} onClick={() => setBase(b.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-sans font-medium transition ${
                        selectedBase === b.id
                          ? 'bg-terra-400 text-white border-terra-400'
                          : `bg-white dark:bg-espresso-700 border-silk hover:border-terra-200 ${baseColors[b.color]?.split(' ')[0] || ''}`
                      }`}>
                      <span>{b.emoji}</span>
                      <span>{lang === 'en' ? b.nameEn : b.name}</span>
                      <span className={`text-xs font-mono ${selectedBase === b.id ? 'text-white/70' : 'text-espresso-400'}`}>
                        {fmtP(b.price.s)}-{fmtP(b.price.l)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Size selection */}
      <div>
        <p className="section-eyebrow mb-3">גודל</p>
        <div className="flex gap-3">
          {sizes.map(s => (
            <button key={s.id} onClick={() => setSize(s.id)}
              className={`flex-1 py-3 rounded-xl border-2 text-center transition ${
                selectedSize === s.id
                  ? 'bg-espresso-800 dark:bg-espresso-600 text-white border-espresso-800 dark:border-espresso-600'
                  : 'bg-white dark:bg-espresso-700 border-silk hover:border-bisque'
              }`}>
              <p className="font-sans font-semibold text-sm">{s.label}</p>
              <p className={`text-xs font-mono ${selectedSize===s.id?'text-white/70':'text-espresso-400'}`}>
                {base?.price[s.id] ? fmtP(base.price[s.id]) : ''} · {s.grams}g
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Toppings by category */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="section-eyebrow mb-0">תוספות</p>
          {selectedToppings.length > 0 && (
            <button onClick={clear} className="text-xs text-espresso-400 hover:text-rose-500 transition font-sans">
              נקה הכל ({selectedToppings.length})
            </button>
          )}
        </div>
        <div className="space-y-4">
          {toppingCategories.map(cat => {
            const catTops = allToppings.filter(t => t.cat === cat.id)
            if (!catTops.length) return null
            return (
              <div key={cat.id}>
                <p className="text-xs text-espresso-400 font-sans mb-2 flex items-center gap-1">
                  <span>{cat.emoji}</span>
                  {lang === 'en' ? cat.labelEn : cat.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {catTops.map(t => (
                    <ToppingPill key={t.id} t={lang==='en'?{...t,name:t.nameEn}:t}
                      selected={selectedToppings.includes(t.id)}
                      onClick={() => toggleTopping(t.id)}/>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order summary */}
      <div className={`card border-2 ${margin >= 50 ? 'border-terra-200 dark:border-terra-700 bg-terra-50/30 dark:bg-terra-900/10' : 'border-silk'}`}>
        <p className="section-eyebrow mb-3">סיכום הזמנה</p>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{base?.emoji}</div>
          <div className="flex-1">
            <p className="font-serif font-bold text-lg">{lang==='en'?base?.nameEn:base?.name}</p>
            <p className="text-sm text-espresso-400 font-sans">{size?.label} · {sizeGrams[selectedSize]}g</p>
            {selectedToppings.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedToppings.map(id => {
                  const t = allToppings.find(t => t.id === id)
                  return t ? (
                    <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-linen dark:bg-espresso-700 border border-silk font-sans">
                      {t.emoji} {lang==='en'?t.nameEn:t.name}
                    </span>
                  ) : null
                })}
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-serif font-bold text-2xl text-terra-500 dark:text-terra-300">{fmtP(totalPrice)}</p>
            <p className="text-xs text-espresso-400 font-sans mt-0.5">עלות: {fmtP(totalCost)}</p>
            <p className={`text-xs font-mono font-semibold mt-0.5 ${margin>=55?'text-sage-600 dark:text-sage-400':margin>=40?'text-amber-600':'text-rose-500'}`}>
              מרווח {margin}%
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Toppings manager ──────────────────────────────────────────────────────────
function ToppingsManager({ allToppings, setAllToppings }) {
  const editModal = useModal()
  const [draft, setDraft] = useState(null)
  const [filterCat, setFilterCat] = useState('all')
  const [search, setSearch] = useState('')
  const [showPopular, setShowPopular] = useState(false)

  const visible = useMemo(() => {
    let list = allToppings
    if (filterCat !== 'all') list = list.filter(t => t.cat === filterCat)
    if (showPopular) list = list.filter(t => t.popular)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.name.includes(q) || t.nameEn.toLowerCase().includes(q))
    }
    return list
  }, [allToppings, filterCat, showPopular, search])

  const grouped = useMemo(() => {
    if (filterCat !== 'all') return { [filterCat]: visible }
    const g = {}
    visible.forEach(t => { if (!g[t.cat]) g[t.cat] = []; g[t.cat].push(t) })
    return g
  }, [visible, filterCat])

  const openEdit = t => { setDraft({...t}); editModal.open() }
  const openAdd  = () => {
    setDraft({id:null,name:'',nameEn:'',cat:'dry',price:3,cost:1,emoji:'🍓',popular:false})
    editModal.open()
  }
  const save = () => {
    if (!draft?.name) return
    const rec = {...draft, id: draft.id || genId()}
    setAllToppings(prev =>
      prev.find(t => t.id === rec.id) ? prev.map(t => t.id===rec.id?rec:t) : [...prev, rec]
    )
    editModal.close()
  }
  const del = id => {
    if (window.confirm('למחוק תוספת?')) setAllToppings(prev => prev.filter(t => t.id !== id))
  }

  return (
    <>
      <div className="space-y-4">
        {/* Search + filters */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input value={search} onChange={e=>setSearch(e.target.value)}
              className="input-field flex-1" placeholder="חפש תוספת..."/>
            <Button variant="primary" onClick={openAdd} className="flex-shrink-0">
              <Icons.Plus className="w-4 h-4"/> הוסף תוספת
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={()=>setFilterCat('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition ${filterCat==='all'?'bg-espresso-800 dark:bg-espresso-600 text-white border-transparent':'bg-white dark:bg-espresso-700 border-silk text-espresso-500 hover:border-terra-200'}`}>
              הכל ({allToppings.length})
            </button>
            {toppingCategories.map(c => (
              <button key={c.id} onClick={()=>setFilterCat(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition ${filterCat===c.id?'bg-espresso-800 dark:bg-espresso-600 text-white border-transparent':'bg-white dark:bg-espresso-700 border-silk text-espresso-500 hover:border-terra-200'}`}>
                {c.emoji} {c.label}
              </button>
            ))}
            <button onClick={()=>setShowPopular(p=>!p)}
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium border transition ${showPopular?'bg-terra-400 text-white border-terra-400':'bg-white dark:bg-espresso-700 border-silk text-espresso-500 hover:border-terra-200'}`}>
              ⭐ פופולרי
            </button>
          </div>
        </div>

        {/* Toppings list */}
        {Object.entries(grouped).map(([catKey, catTops]) => {
          const cat = toppingCategories.find(c => c.id === catKey)
          return (
            <div key={catKey} className="card p-0 overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-3 bg-linen/60 dark:bg-espresso-800/60 border-b border-silk dark:border-espresso-700">
                <span>{cat?.emoji}</span>
                <span className="font-serif font-semibold text-sm">{cat?.label}</span>
                <span className="text-xs text-espresso-400 font-sans">({catTops.length})</span>
              </div>
              <div className="divide-y divide-silk/40 dark:divide-espresso-700/40">
                {catTops.map(t => (
                  <div key={t.id} className="flex items-center gap-3 px-4 py-2.5 group hover:bg-linen/30 dark:hover:bg-espresso-800/30 transition">
                    <span className="text-lg flex-shrink-0">{t.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-sans font-medium text-sm">{t.name}</span>
                        <span className="text-xs text-espresso-400 font-sans">{t.nameEn}</span>
                        {t.popular && <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-700">⭐ פופולרי</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-terra-600 dark:text-terra-300 font-mono font-semibold">מחיר: {fmtP(t.price)}</span>
                        <span className="text-xs text-espresso-400 font-mono">עלות: {fmtP(t.cost)}</span>
                        <span className={`text-xs font-mono ${Math.round((t.price-t.cost)/t.price*100)>=60?'text-sage-600 dark:text-sage-400':'text-amber-600'}`}>
                          {Math.round((t.price-t.cost)/t.price*100)}% מרווח
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button onClick={() => openEdit(t)}
                        className="p-1.5 rounded-lg hover:bg-canvas dark:hover:bg-espresso-600 text-espresso-400 hover:text-terra-500 transition">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                          <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button onClick={() => del(t.id)}
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

      <Modal isOpen={editModal.isOpen} onClose={editModal.close}
        title={draft?.id ? 'ערוך תוספת' : 'תוספת חדשה'} size="sm"
        footer={<><Button variant="ghost" onClick={editModal.close}>ביטול</Button><Button variant="primary" onClick={save}>שמור</Button></>}>
        {draft && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">שם בעברית</label>
                <input value={draft.name} onChange={e=>setDraft(d=>({...d,name:e.target.value}))} className="input-field"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">Name EN</label>
                <input value={draft.nameEn||''} onChange={e=>setDraft(d=>({...d,nameEn:e.target.value}))} className="input-field" dir="ltr"/>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">Emoji</label>
                <input value={draft.emoji||''} onChange={e=>setDraft(d=>({...d,emoji:e.target.value}))} className="input-field text-center text-lg"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">מחיר ₪</label>
                <input type="number" min="0" value={draft.price} onChange={e=>setDraft(d=>({...d,price:parseFloat(e.target.value)||0}))} className="input-field text-center font-mono"/>
              </div>
              <div>
                <label className="block text-xs text-espresso-400 font-sans mb-1">עלות ₪</label>
                <input type="number" min="0" step="0.1" value={draft.cost} onChange={e=>setDraft(d=>({...d,cost:parseFloat(e.target.value)||0}))} className="input-field text-center font-mono"/>
              </div>
            </div>
            <div>
              <label className="block text-xs text-espresso-400 font-sans mb-1">קטגוריה</label>
              <select value={draft.cat} onChange={e=>setDraft(d=>({...d,cat:e.target.value}))} className="input-field">
                {toppingCategories.map(c=><option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="popular-cb" checked={!!draft.popular} onChange={e=>setDraft(d=>({...d,popular:e.target.checked}))}/>
              <label htmlFor="popular-cb" className="text-sm font-sans">⭐ תוספת פופולרית</label>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

// ── Signature combos view ─────────────────────────────────────────────────────
function CombosView({ allToppings }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-espresso-400 font-sans">
        5 קומבינות חתימה מוכנות מראש — לחץ להצגת פרטים מלאים
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {signatureCombos.map(combo => {
          const base = bases.find(b => b.id === combo.baseId)
          const comboTops = combo.toppingIds.map(id => allToppings.find(t=>t.id===id)).filter(Boolean)
          const cost = (base?.costPerG||0)*sizeGrams[combo.size] + comboTops.reduce((s,t)=>s+(t.cost||0),0)
          const margin = Math.round(((combo.price-cost)/combo.price)*100)
          return (
            <div key={combo.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{combo.emoji}</span>
                  <div>
                    <p className="font-serif font-bold text-base">{combo.name}</p>
                    <p className="text-xs text-espresso-400 font-sans">{combo.nameEn}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-serif font-bold text-xl text-terra-500 dark:text-terra-300">{fmtP(combo.price)}</p>
                  <p className={`text-xs font-mono ${margin>=55?'text-sage-600 dark:text-sage-400':'text-amber-600'}`}>{margin}% מרווח</p>
                </div>
              </div>
              <div className="bg-linen dark:bg-espresso-800 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span>{base?.emoji}</span>
                  <span className="text-sm font-sans font-medium">{base?.name}</span>
                  <span className="text-xs text-espresso-400 font-sans">· {sizes.find(s=>s.id===combo.size)?.label}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {comboTops.map(t=>(
                    <span key={t.id} className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-espresso-700 border border-silk font-sans">
                      {t.emoji} {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-espresso-400 font-sans">{combo.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Station checklist view ────────────────────────────────────────────────────
const STATION_CHECKLIST = [
  { section:'פתיחת תחנה', items:[
    'לבדוק טמפרטורת מכונת פרוזן יוגורט (-2°C עד -4°C)',
    'לבדוק טמפרטורת מכונת גלידה (-6°C עד -8°C)',
    'להכין את כל קערות גדלים S/M/L על השולחן',
    'למלא את כל קופסאות התוספות היבשות',
    'להוציא פירות קפואים מהמקפיא 15 דקות לפני פתיחה',
    'לבדוק שכל רטבים וקרמים מלאים בסחיטנים',
    'להכין פירות טריים חתוכים (תות, בננה, קיווי)',
    'לבדוק מלאי כוסות וכפיות',
    'לנקות ולחטא משטח העבודה',
    'לבדוק שלטי מחירים',
  ]},
  { section:'במהלך השירות', items:[
    'לחדש תוספות יבשות כל שעה',
    'לבדוק פירות קפואים — לא יותר מ-4 שעות מחוץ למקפיא',
    'לנקות שיורי תוספות מהשולחן',
    'לחדש פירות טריים לפי צורך',
    'לבדוק רמת מכונת פרוזן כל 2 שעות',
  ]},
  { section:'סגירת תחנה', items:[
    'להחזיר פירות קפואים שנשארו למקפיא (תוך 30 דקות)',
    'לשמור פירות טריים שנשארו במקרר (לא יותר מ-24 שעות)',
    'לנקות לחלוטין כל קופסאות התוספות',
    'לשטוף ולחטא שולחן העבודה עם חומר חיטוי',
    'לנקות את מכונת הפרוזן לפי הוראות היצרן',
    'לבדוק ולתעד טמפרטורות מכונות לפני סגירה',
    'לרשום מלאי תוספות שנגמר לטופס ההזמנה',
  ]},
]

function StationChecklist() {
  const today = new Date().toISOString().slice(0,10)
  const [checks, setChecks] = useLocalStorage(`gelateria-frozen-checks-${today}`, {})
  const toggle = key => setChecks(p => {const n={...p}; if(n[key]) delete n[key]; else n[key]=true; return n})
  const resetAll = () => { if(window.confirm('לאפס צ\'קליסט?')) setChecks({}) }
  const total = STATION_CHECKLIST.reduce((s,sec)=>s+sec.items.length,0)
  const done  = Object.keys(checks).length

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="card py-4">
        <div className="flex justify-between text-sm font-sans mb-2">
          <span className="font-medium">{done===total&&total>0?'✓ הכל הושלם!': `${done} מתוך ${total}`}</span>
          <div className="flex items-center gap-3">
            <span className="text-espresso-400 font-mono">{Math.round((done/total)*100)}%</span>
            {done>0&&<button onClick={resetAll} className="text-xs text-espresso-400 hover:text-rose-500 transition">אפס</button>}
          </div>
        </div>
        <div className="h-2 rounded-full bg-canvas dark:bg-espresso-700 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${done===total&&total>0?'bg-sage-400':'bg-terra-400'}`}
            style={{width:`${total>0?Math.round((done/total)*100):0}%`}}/>
        </div>
      </div>

      {STATION_CHECKLIST.map((sec, si) => {
        const secDone = sec.items.filter((_,ii)=>checks[`${si}-${ii}`]).length
        return (
          <div key={si} className="card p-0 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 bg-linen/60 dark:bg-espresso-800/60 border-b border-silk dark:border-espresso-700">
              <span className="font-serif font-semibold text-sm">{sec.section}</span>
              <span className="text-xs text-espresso-400 font-mono">{secDone}/{sec.items.length}</span>
            </div>
            <ul className="divide-y divide-silk/40 dark:divide-espresso-700/40">
              {sec.items.map((item, ii) => {
                const key = `${si}-${ii}`
                const done2 = !!checks[key]
                return (
                  <li key={ii}>
                    <button onClick={()=>toggle(key)}
                      className={`w-full flex items-center gap-3 px-5 py-3 text-right transition ${done2?'bg-sage-50/30 dark:bg-sage-900/10':'hover:bg-linen/40 dark:hover:bg-espresso-800/30'}`}>
                      <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition ${done2?'bg-sage-400 border-sage-400 text-white':'border-silk dark:border-espresso-500'}`}>
                        {done2 && <Icons.Check className="w-3 h-3"/>}
                      </div>
                      <span className={`text-sm font-sans ${done2?'line-through text-espresso-400':'text-espresso-700 dark:text-espresso-100'}`}>
                        {item}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function FrozenStation() {
  const [view, setView] = useState('builder')
  const [allToppings, setAllToppings] = useLocalStorage('gelateria-frozen-toppings', toppings)

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-serif italic text-terra-400 mb-0.5">Frozen Station</p>
          <h1 className="text-3xl font-serif font-bold mb-1">תחנת פרוזן וגלידה</h1>
          <p className="text-sm text-espresso-400 font-sans">
            {allToppings.length} תוספות · 5 קומבינות חתימה · {bases.length} בסיסים
          </p>
        </div>
      </div>

      {/* View tabs */}
      <div className="flex flex-wrap gap-2">
        {VIEWS.map(v => (
          <button key={v.id} onClick={()=>setView(v.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium transition border ${
              view===v.id
                ? 'bg-terra-400 text-white border-terra-400'
                : 'bg-white dark:bg-espresso-700 border-silk dark:border-espresso-600 text-espresso-500 hover:border-terra-200'
            }`}>
            <span>{v.emoji}</span> {v.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {view === 'builder'   && <BowlBuilder allToppings={allToppings}/>}
      {view === 'toppings'  && <ToppingsManager allToppings={allToppings} setAllToppings={setAllToppings}/>}
      {view === 'combos'    && <CombosView allToppings={allToppings}/>}
      {view === 'checklist' && <StationChecklist/>}

      <div className="pt-4 border-t border-silk dark:border-espresso-700 text-center">
        <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
      </div>
    </div>
  )
}
