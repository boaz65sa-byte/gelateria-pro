import { useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { defaultMenuItems, menuCategories, calcMargin, calcTotalCost } from '../../data/menuData.js'
import { defaultInventory, inventoryCategories } from '../../data/inventoryData.js'
import { defaultSuppliers } from '../../data/suppliersData.js'
import { Link } from 'react-router-dom'

const fmtP = n => `₪${Math.round(n).toLocaleString('he-IL')}`
const pct  = n => `${Math.round(n)}%`

const MARGIN_COLOR = m =>
  m >= 60 ? 'text-sage-600 dark:text-sage-400' :
  m >= 45 ? 'text-amber-600 dark:text-amber-400' :
  'text-rose-500 dark:text-rose-400'

const MARGIN_BG = m =>
  m >= 60 ? 'bg-sage-400' :
  m >= 45 ? 'bg-amber-400' :
  'bg-rose-400'

export function Reports() {
  const [items]     = useLocalStorage('gelateria-menu-items', defaultMenuItems)
  const [inventory] = useLocalStorage('gelateria-inventory', defaultInventory)
  const [suppliers] = useLocalStorage('gelateria-suppliers', defaultSuppliers)
  const [workers]   = useLocalStorage('gelateria-workers', [])
  const [bizInfo]   = useLocalStorage('gelateria-biz-info', { name:'Sweet Station' })

  const activeItems = useMemo(() => items.filter(i => i.active !== false), [items])

  // ── Menu analysis ──────────────────────────────────────────────────────────
  const menuStats = useMemo(() => {
    const margins    = activeItems.map(i => calcMargin(i))
    const avgMargin  = margins.length ? Math.round(margins.reduce((s,m) => s+m, 0) / margins.length) : 0
    const topItems   = [...activeItems].sort((a,b) => calcMargin(b) - calcMargin(a)).slice(0, 5)
    const lowItems   = [...activeItems].filter(i => calcMargin(i) < 40)
    const byCategory = menuCategories.map(cat => {
      const catItems = activeItems.filter(i => i.category === cat.id)
      if (!catItems.length) return null
      const avg = Math.round(catItems.reduce((s,i) => s+calcMargin(i), 0) / catItems.length)
      return { ...cat, count: catItems.length, avgMargin: avg }
    }).filter(Boolean)
    return { avgMargin, topItems, lowItems, byCategory }
  }, [activeItems])

  // ── Inventory analysis ─────────────────────────────────────────────────────
  const inventoryStats = useMemo(() => {
    const totalItems  = inventory.length
    const lowStock    = inventory.filter(i => i.current < i.opening)
    const orderedItems = inventory.filter(i => i.ordered)
    const totalValue  = inventory.reduce((s,i) => {
      // Approximate value = current * avg cost (from menu ingredients or estimate ₪10/unit)
      return s + (i.current * 10)
    }, 0)
    return { totalItems, lowStock, orderedItems, totalValue }
  }, [inventory])

  // ── Workers cost (weekly) ──────────────────────────────────────────────────
  const workersCost = useMemo(() => {
    const [schedules] = [JSON.parse(localStorage.getItem('gelateria-weekly-schedules') || '{}')]
    const d=new Date(); const jan1=new Date(d.getFullYear(),0,1)
    const wk=Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7)
    const weekKey=`${d.getFullYear()}-W${String(wk).padStart(2,'0')}`
    const ws = schedules[weekKey] || {}
    return workers.reduce((sum, w) => {
      const rate   = parseFloat(w.hourlyRate) || 35
      const shifts = Object.values(ws).reduce((c,ds) => c+Object.values(ds).filter(a=>a.includes(w.id)).length, 0)
      return sum + shifts * 8 * rate
    }, 0)
  }, [workers])

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="font-serif italic text-terra-400 mb-0.5">Rapporto finanziario</p>
        <h1 className="text-3xl font-serif font-bold mb-1">דוחות כלכליים</h1>
        <p className="text-sm text-espresso-400 font-sans">
          {bizInfo.name} · {new Date().toLocaleDateString('he-IL',{month:'long',year:'numeric'})}
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l:'מרווח ממוצע תפריט', v:pct(menuStats.avgMargin),       c:MARGIN_COLOR(menuStats.avgMargin) },
          { l:'מנות פעילות',       v:activeItems.length,               c:'' },
          { l:'מלאי נמוך',         v:inventoryStats.lowStock.length,   c:inventoryStats.lowStock.length>0?'text-terra-500':'' },
          { l:'עלות עובדים/שבוע',  v:fmtP(workersCost),                c:'' },
        ].map((s,i) => (
          <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-4">
            <p className="text-xs text-espresso-400 font-sans uppercase tracking-wide mb-2">{s.l}</p>
            <p className={`text-2xl font-serif font-bold ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      {/* Category margin chart */}
      <div className="card">
        <h2 className="font-serif font-semibold text-lg mb-4">מרווח לפי קטגוריה</h2>
        <div className="space-y-3">
          {menuStats.byCategory.sort((a,b) => b.avgMargin - a.avgMargin).map(cat => (
            <div key={cat.id}>
              <div className="flex items-center justify-between text-sm font-sans mb-1">
                <span className="flex items-center gap-2">
                  <span>{cat.emoji}</span>
                  <span className="font-medium">{cat.label}</span>
                  <span className="text-xs text-espresso-400">({cat.count} מנות)</span>
                </span>
                <span className={`font-mono font-semibold ${MARGIN_COLOR(cat.avgMargin)}`}>{pct(cat.avgMargin)}</span>
              </div>
              <div className="h-2 rounded-full bg-canvas dark:bg-espresso-700 overflow-hidden">
                <div className={`h-full rounded-full transition-all ${MARGIN_BG(cat.avgMargin)}`}
                  style={{width:`${cat.avgMargin}%`}}/>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-espresso-400 font-sans mt-3">יעד: 55-70% מרווח גולמי לעסק פרמיום</p>
      </div>

      {/* Top 5 + Bottom items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Top performers */}
        <div className="card">
          <h2 className="font-serif font-semibold text-base mb-3">🏆 מנות הכי רווחיות</h2>
          <div className="space-y-2">
            {menuStats.topItems.map((item, i) => {
              const m = calcMargin(item)
              const cat = menuCategories.find(c => c.id === item.category)
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-linen dark:bg-espresso-700 text-xs font-mono font-bold flex items-center justify-center text-espresso-400 flex-shrink-0">{i+1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-sans font-medium truncate">{item.name}</p>
                    <p className="text-xs text-espresso-400 font-sans">{cat?.emoji} {cat?.label} · ₪{item.price}</p>
                  </div>
                  <span className={`text-sm font-mono font-bold flex-shrink-0 ${MARGIN_COLOR(m)}`}>{pct(m)}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Low margin alerts */}
        <div className="card">
          <h2 className="font-serif font-semibold text-base mb-3">⚠️ מנות לבדיקת תמחור</h2>
          {menuStats.lowItems.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sage-600 dark:text-sage-400 font-sans text-sm">✓ כל המנות מעל 40% מרווח</p>
            </div>
          ) : (
            <div className="space-y-2">
              {menuStats.lowItems.map(item => {
                const m   = calcMargin(item)
                const rec = Math.ceil(calcTotalCost(item) / (1 - 0.55))
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans font-medium truncate">{item.name}</p>
                      <p className="text-xs text-espresso-400 font-sans">מחיר נוכחי ₪{item.price} · מומלץ ₪{rec}</p>
                    </div>
                    <span className="text-sm font-mono font-bold text-rose-500 flex-shrink-0">{pct(m)}</span>
                  </div>
                )
              })}
            </div>
          )}
          <Link to="/menu" className="block mt-3 text-xs text-terra-500 hover:text-terra-700 transition font-sans">
            ← ערוך תמחור בתפריט
          </Link>
        </div>
      </div>

      {/* Inventory status */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif font-semibold text-lg">סטטוס מלאי</h2>
          <Link to="/inventory" className="text-xs text-terra-500 hover:text-terra-700 font-sans transition">← לניהול מלאי</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { l:'סה"כ פריטים',    v:inventoryStats.totalItems },
            { l:'מלאי תקין',      v:inventoryStats.totalItems - inventoryStats.lowStock.length, c:'text-sage-600 dark:text-sage-400' },
            { l:'מתחת לסף',       v:inventoryStats.lowStock.length, c:inventoryStats.lowStock.length>0?'text-terra-500':'' },
            { l:'בהזמנה כרגע',    v:inventoryStats.orderedItems.length, c:'text-amber-600' },
          ].map((s,i) => (
            <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
              <p className="text-xs text-espresso-400 font-sans mb-1">{s.l}</p>
              <p className={`text-xl font-serif font-bold ${s.c||''}`}>{s.v}</p>
            </div>
          ))}
        </div>
        {inventoryStats.lowStock.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-espresso-400 font-sans mb-2">פריטים שצריך להזמין:</p>
            <div className="flex flex-wrap gap-2">
              {inventoryStats.lowStock.map(item => (
                <span key={item.id} className="text-xs px-2.5 py-1 rounded-full bg-terra-50 dark:bg-terra-900/20 text-terra-600 dark:text-terra-300 border border-terra-200 dark:border-terra-700 font-sans">
                  {item.name} ({item.current}/{item.opening} {item.unit})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Workers */}
      {workers.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif font-semibold text-lg">עלות עובדים</h2>
            <Link to="/shifts" className="text-xs text-terra-500 hover:text-terra-700 font-sans transition">← לסידור עבודה</Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
              <p className="text-xs text-espresso-400 font-sans mb-1">עלות שבועית (שבוע זה)</p>
              <p className="text-2xl font-serif font-bold">{fmtP(workersCost)}</p>
            </div>
            <div className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
              <p className="text-xs text-espresso-400 font-sans mb-1">עלות חודשית משוערת</p>
              <p className="text-2xl font-serif font-bold">{fmtP(workersCost * 4.33)}</p>
            </div>
          </div>
          <p className="text-xs text-espresso-400 font-sans mt-3">{workers.length} עובדים רשומים · ערוך שכר שעתי בפרטי עובד</p>
        </div>
      )}

      <div className="pt-4 border-t border-silk dark:border-espresso-700 text-center">
        <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
      </div>
    </div>
  )
}
