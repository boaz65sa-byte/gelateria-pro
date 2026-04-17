import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

// ── helpers ──────────────────────────────────────────────────────────────────
const genId = () => `ing-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

const UNITS = ['g', 'kg', 'ml', 'l', 'כף', 'כפית', 'יחידות', 'כוס']

function toGrams(amount, unit) {
  if (unit === 'kg') return amount * 1000
  if (unit === 'l')  return amount * 1000
  return amount // g, ml, כף, etc — treat as-is (ratio only)
}

function fromGrams(grams, unit) {
  if (unit === 'kg') return +(grams / 1000).toFixed(3)
  if (unit === 'l')  return +(grams / 1000).toFixed(3)
  return +grams.toFixed(1)
}

function scale(amount, unit, factor) {
  const base = toGrams(amount, unit)
  return fromGrams(base * factor, unit)
}

function fmtNum(n) {
  if (n === 0) return '0'
  if (n >= 1000) return `${(n / 1000).toFixed(2)} ק"ג`
  if (Number.isInteger(n)) return String(n)
  return n.toFixed(1)
}

const EMPTY_INGREDIENT = () => ({ id: genId(), name: '', amount: '', unit: 'g' })

const defaultRecipe = {
  name: '',
  baseAmount: 1,
  baseUnit: 'kg',
  ingredients: [EMPTY_INGREDIENT()],
}

// ── component ────────────────────────────────────────────────────────────────
export function CustomRecipe() {
  const [saved, setSaved] = useLocalStorage('gelateria-custom-recipes', [])
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState(defaultRecipe)
  const [activeId, setActiveId] = useState(null)
  const [targetAmount, setTargetAmount] = useState(2)
  const [copiedMsg, setCopiedMsg] = useState(false)

  const activeRecipe = saved.find(r => r.id === activeId) || saved[0] || null

  // ── draft helpers ──────────────────────────────────────────────────────────
  const setDraftField = (k, v) => setDraft(d => ({ ...d, [k]: v }))

  const updateIng = (id, k, v) =>
    setDraft(d => ({ ...d, ingredients: d.ingredients.map(i => i.id === id ? { ...i, [k]: v } : i) }))

  const addIng = () =>
    setDraft(d => ({ ...d, ingredients: [...d.ingredients, EMPTY_INGREDIENT()] }))

  const removeIng = id =>
    setDraft(d => ({ ...d, ingredients: d.ingredients.filter(i => i.id !== id) }))

  const openNew = () => {
    setDraft({ ...defaultRecipe, ingredients: [EMPTY_INGREDIENT()] })
    setEditMode(true)
  }

  const openEdit = recipe => {
    setDraft({ ...recipe })
    setEditMode(true)
  }

  const saveRecipe = () => {
    if (!draft.name.trim()) return
    const validIngs = draft.ingredients.filter(i => i.name.trim() && i.amount !== '')
    if (validIngs.length === 0) return
    const recipe = { ...draft, id: draft.id || genId(), ingredients: validIngs }
    setSaved(prev => {
      const exists = prev.find(r => r.id === recipe.id)
      return exists ? prev.map(r => r.id === recipe.id ? recipe : r) : [...prev, recipe]
    })
    setActiveId(recipe.id)
    setEditMode(false)
  }

  const deleteRecipe = id => {
    if (!window.confirm('למחוק את המתכון?')) return
    setSaved(prev => prev.filter(r => r.id !== id))
    if (activeId === id) setActiveId(null)
  }

  // ── scaling calc ───────────────────────────────────────────────────────────
  const scaledIngredients = useMemo(() => {
    if (!activeRecipe) return []
    const baseG = toGrams(activeRecipe.baseAmount, activeRecipe.baseUnit)
    const targetG = toGrams(targetAmount, activeRecipe.baseUnit)
    const factor = baseG > 0 ? targetG / baseG : 1
    return activeRecipe.ingredients.map(ing => ({
      ...ing,
      scaled: scale(parseFloat(ing.amount) || 0, ing.unit, factor),
    }))
  }, [activeRecipe, targetAmount])

  const copyToClipboard = () => {
    const lines = scaledIngredients.map(i => `${i.name}: ${fmtNum(i.scaled)} ${i.unit}`)
    navigator.clipboard?.writeText(lines.join('\n'))
    setCopiedMsg(true)
    setTimeout(() => setCopiedMsg(false), 2000)
  }

  // ─────────────────────────────────────────────────────────────────────────
  if (editMode) {
    return <RecipeEditor draft={draft} onField={setDraftField} onUpdateIng={updateIng}
      onAddIng={addIng} onRemoveIng={removeIng} onSave={saveRecipe}
      onCancel={() => setEditMode(false)} />
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-serif italic text-terra-500 dark:text-terra-300 mb-0.5">Dal sacchetto</p>
          <h1 className="text-3xl font-serif font-bold mb-1">מתכון מהשקית</h1>
          <p className="text-sm font-sans text-espresso-400 dark:text-espresso-300">
            הכנס מתכון פעם אחת — שנה כמות בכל שימוש
          </p>
        </div>
        <Button variant="primary" onClick={openNew}>
          <Icons.Plus className="w-4 h-4" /> מתכון חדש
        </Button>
      </div>

      {saved.length === 0 ? (
        <EmptyState onNew={openNew} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recipe list */}
          <div className="space-y-2">
            <p className="section-eyebrow">המתכונים שלי</p>
            {saved.map(r => (
              <button key={r.id} onClick={() => { setActiveId(r.id); setTargetAmount(r.baseAmount) }}
                className={`w-full text-right p-4 rounded-xl border transition-all ${
                  activeId === r.id || (!activeId && r === saved[0])
                    ? 'border-terra-300 dark:border-terra-600 bg-terra-50 dark:bg-terra-900/20'
                    : 'border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 hover:border-bisque'
                }`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm font-sans text-espresso-800 dark:text-espresso-50 truncate">{r.name}</p>
                    <p className="text-xs text-espresso-400 dark:text-espresso-400 font-sans mt-0.5">
                      בסיס {r.baseAmount} {r.baseUnit} · {r.ingredients.length} מרכיבים
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); openEdit(r) }}
                      className="p-1.5 rounded-lg hover:bg-canvas dark:hover:bg-espresso-600 text-espresso-400 transition">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                        <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button onClick={e => { e.stopPropagation(); deleteRecipe(r.id) }}
                      className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-400 hover:text-rose-600 transition">
                      <Icons.Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Calculator */}
          {activeRecipe && (
            <div className="lg:col-span-2 space-y-4">
              <div className="card">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-serif font-bold">{activeRecipe.name}</h2>
                    <p className="text-xs text-espresso-400 dark:text-espresso-400 font-sans mt-0.5">
                      מתכון בסיס: {activeRecipe.baseAmount} {activeRecipe.baseUnit}
                    </p>
                  </div>
                  <span className="tag">{activeRecipe.ingredients.length} מרכיבים</span>
                </div>

                {/* Target amount control */}
                <div className="bg-linen dark:bg-espresso-800 rounded-2xl p-4 mb-5">
                  <p className="section-eyebrow mb-3">כמות רצויה</p>
                  <div className="flex items-center gap-4">
                    <input type="range"
                      min="0.5" max={activeRecipe.baseAmount * 20} step="0.5"
                      value={targetAmount}
                      onChange={e => setTargetAmount(parseFloat(e.target.value))}
                      className="flex-1" />
                    <div className="flex items-baseline gap-2">
                      <input type="number" min="0.1" step="0.5" value={targetAmount}
                        onChange={e => setTargetAmount(parseFloat(e.target.value) || 0)}
                        className="input-field w-24 text-center text-xl font-serif py-2" />
                      <span className="text-espresso-400 font-sans font-medium text-sm">{activeRecipe.baseUnit}</span>
                    </div>
                  </div>

                  {/* Quick presets */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[1, 2, 3, 5, 10].map(m => {
                      const v = +(activeRecipe.baseAmount * m).toFixed(2)
                      return (
                        <button key={m} onClick={() => setTargetAmount(v)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition ${
                            targetAmount === v
                              ? 'bg-terra-400 text-white'
                              : 'bg-white dark:bg-espresso-700 border border-silk dark:border-espresso-600 text-espresso-500 hover:border-bisque'
                          }`}>
                          ×{m}
                          <span className="text-opacity-70 mr-1">({v} {activeRecipe.baseUnit})</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Scaled table */}
                <div className="rounded-xl border border-silk dark:border-espresso-600 overflow-hidden mb-4">
                  <table className="w-full text-sm font-sans">
                    <thead>
                      <tr className="bg-linen dark:bg-espresso-800">
                        <th className="text-right px-4 py-2.5 text-xs text-espresso-400 font-medium">מרכיב</th>
                        <th className="text-center px-3 py-2.5 text-xs text-espresso-400 font-medium">מקור</th>
                        <th className="text-left px-4 py-2.5 text-xs text-espresso-400 font-medium">מחושב</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scaledIngredients.map((ing, idx) => {
                        const factor = (toGrams(targetAmount, activeRecipe.baseUnit) /
                                        toGrams(activeRecipe.baseAmount, activeRecipe.baseUnit))
                        const unchanged = Math.abs(factor - 1) < 0.001
                        return (
                          <tr key={ing.id}
                              className={`border-t border-silk dark:border-espresso-700 ${idx % 2 === 0 ? '' : 'bg-linen/30 dark:bg-espresso-800/30'}`}>
                            <td className="px-4 py-3 text-espresso-700 dark:text-espresso-100 font-medium">{ing.name}</td>
                            <td className="px-3 py-3 text-center text-espresso-400 dark:text-espresso-400 text-xs font-mono">
                              {ing.amount} {ing.unit}
                            </td>
                            <td className={`px-4 py-3 font-mono font-semibold text-left ${
                              unchanged ? 'text-espresso-500 dark:text-espresso-300' : 'text-terra-600 dark:text-terra-300'
                            }`}>
                              {fmtNum(ing.scaled)} {ing.unit}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button variant="secondary" onClick={copyToClipboard}>
                    {copiedMsg ? <><Icons.Check className="w-4 h-4" /> הועתק!</> : 'העתק רשימה'}
                  </Button>
                  <Button variant="secondary" onClick={() => window.print()} className="no-print">
                    <Icons.Print className="w-4 h-4" /> הדפס
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Recipe editor ─────────────────────────────────────────────────────────────
function RecipeEditor({ draft, onField, onUpdateIng, onAddIng, onRemoveIng, onSave, onCancel }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onCancel}
          className="p-2 rounded-xl hover:bg-linen dark:hover:bg-espresso-700 transition text-espresso-400">
          <Icons.ChevronLeft className="w-5 h-5 rotate-180" />
        </button>
        <div>
          <h1 className="text-2xl font-serif font-bold">{draft.id ? 'עריכת מתכון' : 'מתכון חדש'}</h1>
          <p className="text-sm text-espresso-400 font-sans">הכנס את הנתונים מהשקית</p>
        </div>
      </div>

      <div className="card space-y-5">
        {/* Name + base */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-espresso-400 font-sans mb-1.5">שם המתכון / שם המוצר על השקית</label>
            <input
              value={draft.name}
              onChange={e => onField('name', e.target.value)}
              className="input-field text-lg font-serif"
              placeholder="לדוגמה: Choco Dream Mix, בצק וופל פרמיום..."
            />
          </div>
          <div>
            <label className="block text-xs text-espresso-400 font-sans mb-1.5">כמות בסיס על השקית</label>
            <div className="flex gap-2">
              <input
                type="number" min="0.1" step="0.1"
                value={draft.baseAmount}
                onChange={e => onField('baseAmount', parseFloat(e.target.value) || 1)}
                className="input-field w-24 text-center font-serif text-lg"
              />
              <select value={draft.baseUnit} onChange={e => onField('baseUnit', e.target.value)}
                className="input-field flex-1">
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs text-espresso-400 font-sans uppercase tracking-widest font-semibold" style={{fontSize:'0.65rem'}}>
              מרכיבים לפי המתכון על השקית
            </label>
            <span className="tag">{draft.ingredients.length} מרכיבים</span>
          </div>

          <div className="space-y-2">
            {draft.ingredients.map((ing, idx) => (
              <div key={ing.id} className="flex items-center gap-2">
                <span className="w-6 text-center text-xs text-espresso-400 font-mono flex-shrink-0">{idx + 1}</span>
                <input
                  value={ing.name}
                  onChange={e => onUpdateIng(ing.id, 'name', e.target.value)}
                  className="input-field flex-1"
                  placeholder="שם המרכיב (קמח, ביצים, חלב...)"
                />
                <input
                  type="number" min="0" step="any"
                  value={ing.amount}
                  onChange={e => onUpdateIng(ing.id, 'amount', e.target.value)}
                  className="input-field w-24 text-center font-mono"
                  placeholder="כמות"
                />
                <select value={ing.unit} onChange={e => onUpdateIng(ing.id, 'unit', e.target.value)}
                  className="input-field w-20 text-sm">
                  {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                {draft.ingredients.length > 1 && (
                  <button onClick={() => onRemoveIng(ing.id)}
                    className="p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-300 hover:text-rose-500 transition flex-shrink-0">
                    <Icons.Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button onClick={onAddIng}
            className="mt-3 flex items-center gap-2 text-sm text-terra-600 dark:text-terra-300 hover:text-terra-700 font-sans font-medium transition">
            <Icons.Plus className="w-4 h-4" />
            הוסף מרכיב
          </button>
        </div>

        {/* Tip box */}
        <div className="bg-terra-50 dark:bg-terra-900/20 rounded-xl p-4 border border-terra-100 dark:border-terra-800/30">
          <p className="text-xs font-sans text-terra-700 dark:text-terra-300 leading-relaxed">
            💡 <strong>טיפ:</strong> הכנס את הכמויות בדיוק כפי שכתוב על השקית.
            המערכת תחשב אוטומטית לכל כמות שתרצה — ×2, ×5, ×10, וכו׳.
            אפשר לעבוד בכל יחידות (גרם, ק"ג, כפות...).
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2 border-t border-silk dark:border-espresso-600">
          <Button variant="ghost" onClick={onCancel}>ביטול</Button>
          <Button variant="primary" onClick={onSave}>
            <Icons.Check className="w-4 h-4" />
            {draft.id ? 'שמור שינויים' : 'שמור מתכון'}
          </Button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ onNew }) {
  return (
    <div className="card text-center py-16">
      <div className="text-5xl mb-4">📋</div>
      <h2 className="font-serif font-bold text-xl mb-2">אין עדיין מתכונים</h2>
      <p className="text-sm text-espresso-400 dark:text-espresso-300 font-sans mb-6 max-w-sm mx-auto">
        הוסף מתכון מהשקית פעם אחת — ואז תוכל לחשב כמויות בלחיצה
      </p>
      <Button variant="primary" onClick={onNew}>
        <Icons.Plus className="w-4 h-4" /> הוסף מתכון ראשון
      </Button>
    </div>
  )
}
