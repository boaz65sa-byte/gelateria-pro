import { useState, useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { defaultInventory, inventoryCategories } from '../../data/inventoryData.js'
import { InventoryItem } from './InventoryItem.jsx'
import { OrderForm } from './OrderForm.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

const catVisual = {
  chocolate: { emoji:'🍫', label:'Cioccolato', bg:'bg-amber-50  dark:bg-amber-900/20',  border:'border-amber-200 dark:border-amber-700',  active:'border-amber-400 bg-amber-100 dark:bg-amber-800/40',  bar:'bg-amber-400'  },
  dairy:     { emoji:'🥛', label:'Latticini',  bg:'bg-sky-50    dark:bg-sky-900/20',    border:'border-sky-200   dark:border-sky-700',    active:'border-sky-400   bg-sky-100   dark:bg-sky-800/40',    bar:'bg-sky-400'    },
  packaging: { emoji:'📦', label:'Packaging',  bg:'bg-violet-50 dark:bg-violet-900/20', border:'border-violet-200 dark:border-violet-700', active:'border-violet-400 bg-violet-100 dark:bg-violet-800/40',bar:'bg-violet-400' },
  dry:       { emoji:'🌾', label:'Secchi',     bg:'bg-yellow-50 dark:bg-yellow-900/20', border:'border-yellow-200 dark:border-yellow-700', active:'border-yellow-400 bg-yellow-100 dark:bg-yellow-800/40',bar:'bg-yellow-400' },
  fruits:    { emoji:'🍓', label:'Frutta',     bg:'bg-rose-50   dark:bg-rose-900/20',   border:'border-rose-200  dark:border-rose-700',   active:'border-rose-400  bg-rose-100  dark:bg-rose-800/40',   bar:'bg-rose-400'   },
}
const fallVis = { emoji:'📋', label:'', bg:'bg-canvas', border:'border-silk', active:'border-bisque bg-linen', bar:'bg-bisque' }

export function Inventory() {
  const [inventory, setInventory] = useLocalStorage('gelateria-inventory', defaultInventory)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [showAddForm,   setShowAddForm  ] = useState(false)
  const [expandedCats,  setExpandedCats ] = useState({})

  const lowStockItems = useMemo(() => inventory.filter(i => i.quantity <= i.threshold), [inventory])

  const catStats = useMemo(() => {
    const s = {}
    Object.keys(inventoryCategories).forEach(cat => {
      const items = inventory.filter(i => i.category === cat)
      s[cat] = { total: items.length, low: items.filter(i => i.quantity <= i.threshold).length }
    })
    return s
  }, [inventory])

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return inventory
    if (activeCategory === 'low') return lowStockItems
    return inventory.filter(i => i.category === activeCategory)
  }, [inventory, activeCategory, lowStockItems])

  const grouped = useMemo(() => {
    if (activeCategory !== 'all') return null
    const g = {}
    filtered.forEach(item => { if (!g[item.category]) g[item.category]=[]; g[item.category].push(item) })
    return g
  }, [filtered, activeCategory])

  const toggleCat = cat => setExpandedCats(p => ({ ...p, [cat]: p[cat]===false ? true : false }))
  const updateItem = (id, changes) => setInventory(prev => prev.map(i => i.id===id ? {...i,...changes} : i))
  const deleteItem = id => setInventory(prev => prev.filter(i => i.id !== id))
  const addItem = item => { setInventory(prev => [...prev, {...item, id:`inv-${Date.now()}`, quantity:parseFloat(item.quantity)||0, threshold:parseFloat(item.threshold)||0}]); setShowAddForm(false) }
  const resetInventory = () => { if (window.confirm('לאפס את המלאי לברירת המחדל?')) setInventory(defaultInventory) }

  if (showOrderForm) return <OrderForm lowStockItems={lowStockItems} onClose={() => setShowOrderForm(false)} />

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="font-serif italic text-terra-500 dark:text-terra-300 mb-0.5">Gestione magazzino</p>
          <h1 className="text-3xl font-serif font-bold mb-1">ניהול מלאי</h1>
          <p className="text-sm font-sans text-espresso-400 dark:text-espresso-300">
            {inventory.length} פריטים ·{' '}
            <span className={lowStockItems.length > 0 ? 'text-rose-600 dark:text-rose-400 font-medium' : ''}>
              {lowStockItems.length} במלאי נמוך
            </span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {lowStockItems.length > 0 && (
            <Button variant="primary" onClick={() => setShowOrderForm(true)}>
              <Icons.Print className="w-4 h-4" /> צור טופס הזמנה
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowAddForm(true)}>
            <Icons.Plus className="w-4 h-4" /> פריט חדש
          </Button>
          <Button variant="ghost" onClick={resetInventory} title="אפס"><Icons.Reset className="w-4 h-4" /></Button>
        </div>
      </div>

      {/* Category cards grid */}
      <div>
        <p className="section-eyebrow">קטגוריות</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

          {/* All */}
          <button onClick={() => setActiveCategory('all')}
            className={`cat-card ${activeCategory==='all' ? 'border-2 border-espresso-400 dark:border-espresso-400' : 'border'}`}>
            <div className="text-2xl mb-2">🏪</div>
            <p className="font-sans font-medium text-sm text-espresso-700 dark:text-espresso-100 leading-tight mb-0.5">הכל</p>
            <p className="text-xs text-espresso-400 dark:text-espresso-400 font-sans">{inventory.length} פריטים</p>
          </button>

          {Object.entries(inventoryCategories).map(([key, cat]) => {
            const vis   = catVisual[key] || fallVis
            const stats = catStats[key]  || { total:0, low:0 }
            const isAct = activeCategory === key
            const pct   = stats.total > 0 ? Math.round(((stats.total - stats.low) / stats.total) * 100) : 100
            return (
              <button key={key} onClick={() => setActiveCategory(key)}
                className={`cat-card border ${isAct ? `border-2 ${vis.active}` : `${vis.border} ${vis.bg}`}`}>
                <div className="text-2xl mb-2">{vis.emoji}</div>
                <p className="font-sans text-xs italic text-espresso-400 dark:text-espresso-400 mb-0.5">{vis.label}</p>
                <p className="font-sans font-medium text-sm text-espresso-700 dark:text-espresso-100 leading-tight mb-1">{cat.label}</p>
                <p className="text-xs text-espresso-400 dark:text-espresso-400 font-sans mb-2">{stats.total} פריטים</p>
                {stats.low > 0 && <p className="text-xs font-medium text-rose-600 dark:text-rose-400 mb-1.5">{stats.low} נמוך</p>}
                {stats.total > 0 && (
                  <div className="h-1 rounded-full bg-silk dark:bg-espresso-600 overflow-hidden">
                    <div className={`h-full rounded-full ${stats.low>0 ? 'bg-rose-400' : vis.bar} transition-all`}
                         style={{width:`${pct}%`}} />
                  </div>
                )}
              </button>
            )
          })}

          {lowStockItems.length > 0 && (
            <button onClick={() => setActiveCategory('low')}
              className={`cat-card border ${activeCategory==='low' ? 'border-2 border-rose-400 bg-rose-100 dark:bg-rose-800/30' : 'border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-900/20'}`}>
              <div className="text-2xl mb-2">⚠️</div>
              <p className="font-sans font-medium text-sm text-rose-700 dark:text-rose-300 leading-tight mb-0.5">מלאי נמוך</p>
              <p className="text-xs font-medium text-rose-600 dark:text-rose-400 font-sans">{lowStockItems.length} פריטים</p>
            </button>
          )}
        </div>
      </div>

      {showAddForm && <AddItemForm onAdd={addItem} onCancel={() => setShowAddForm(false)} />}

      {/* Items */}
      <div className="space-y-4">
        {activeCategory === 'all' && grouped ? (
          Object.entries(grouped).map(([catKey, items]) => {
            const cat  = inventoryCategories[catKey]
            const vis  = catVisual[catKey] || fallVis
            const isEx = expandedCats[catKey] !== false
            const low  = items.filter(i => i.quantity <= i.threshold).length
            return (
              <div key={catKey} className="card p-0 overflow-hidden">
                <button onClick={() => toggleCat(catKey)}
                  className="w-full flex items-center gap-3 px-5 py-4 hover:bg-linen dark:hover:bg-espresso-700/50 transition text-right">
                  <span className="text-xl">{vis.emoji}</span>
                  <div className="flex-1">
                    <span className="font-sans font-medium text-sm text-espresso-700 dark:text-espresso-100">{cat?.label}</span>
                    <span className="text-xs text-espresso-400 dark:text-espresso-400 mr-2 font-sans">({items.length})</span>
                    {low > 0 && <span className="badge-danger mr-1">{low} נמוך</span>}
                  </div>
                  <Icons.ChevronLeft className={`w-4 h-4 text-espresso-400 transition-transform ${isEx ? 'rotate-90' : '-rotate-90'}`} />
                </button>
                {isEx && (
                  <div className="border-t border-silk dark:border-espresso-700 px-3 py-2 space-y-0.5">
                    {items.map(item => <InventoryItem key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} />)}
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="card">
            <p className="section-eyebrow mb-4">
              {activeCategory==='low' ? '⚠️ מלאי נמוך' : `${catVisual[activeCategory]?.emoji || ''} ${inventoryCategories[activeCategory]?.label || ''}`}
            </p>
            {filtered.length === 0
              ? <p className="text-center py-8 text-espresso-400 font-sans">אין פריטים</p>
              : <div className="space-y-0.5">
                  {filtered.map(item => <InventoryItem key={item.id} item={item} onUpdate={updateItem} onDelete={deleteItem} />)}
                </div>
            }
          </div>
        )}
      </div>
    </div>
  )
}

function AddItemForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({ name:'', category:'chocolate', quantity:0, threshold:1, unit:'ק"ג', supplier:'' })
  const sub = e => { e.preventDefault(); if (!form.name.trim()) return; onAdd(form) }
  return (
    <div className="card border-2 border-terra-300 dark:border-terra-600/50">
      <h3 className="font-serif font-semibold text-lg mb-4">הוספת פריט חדש</h3>
      <form onSubmit={sub} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><label className="block text-xs text-espresso-400 mb-1">שם הפריט</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-field"/></div>
        <div><label className="block text-xs text-espresso-400 mb-1">ספק</label><input value={form.supplier} onChange={e=>setForm({...form,supplier:e.target.value})} className="input-field"/></div>
        <div><label className="block text-xs text-espresso-400 mb-1">קטגוריה</label>
          <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="input-field">
            {Object.entries(inventoryCategories).map(([k,c])=><option key={k} value={k}>{catVisual[k]?.emoji} {c.label}</option>)}
          </select>
        </div>
        <div><label className="block text-xs text-espresso-400 mb-1">יחידת מידה</label><input value={form.unit} onChange={e=>setForm({...form,unit:e.target.value})} className="input-field" placeholder='ק"ג, ליטר, יחידות'/></div>
        <div><label className="block text-xs text-espresso-400 mb-1">כמות נוכחית</label><input type="number" min="0" step="0.1" value={form.quantity} onChange={e=>setForm({...form,quantity:e.target.value})} className="input-field"/></div>
        <div><label className="block text-xs text-espresso-400 mb-1">סף מלאי נמוך</label><input type="number" min="0" step="0.1" value={form.threshold} onChange={e=>setForm({...form,threshold:e.target.value})} className="input-field"/></div>
        <div className="md:col-span-2 flex gap-2 justify-end pt-1">
          <Button type="button" variant="ghost" onClick={onCancel}>ביטול</Button>
          <Button type="submit" variant="primary">הוסף פריט</Button>
        </div>
      </form>
    </div>
  )
}
