import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { useModal } from '../../hooks/useModal.js'
import { Modal } from '../../components/ui/Modal.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { Icons } from '../../components/ui/Icons.jsx'
import { defaultInventory, inventoryCategories } from '../../data/inventoryData.js'
import { defaultSuppliers } from '../../data/suppliersData.js'
import { openWhatsApp, buildSupplierOrderMessage, cleanPhone } from '../../utils/whatsapp.js'
import { formatDate } from '../../utils/dateFormat.js'

const genId = () => `inv-${Date.now()}-${Math.random().toString(36).slice(2,5)}`

// ── status helpers ────────────────────────────────────────────────────────────
function getStatus(item) {
  if (item.current <= 0)                        return 'empty'
  if (item.current < item.opening)              return 'low'
  if (item.current < item.opening * 1.2)        return 'warning'
  return 'ok'
}

const STATUS_META = {
  empty:   { label:'נגמר!',        color:'text-red-700 dark:text-red-300',      bg:'bg-red-50 dark:bg-red-900/20',      border:'border-red-200 dark:border-red-700',     dot:'bg-red-500',    badgeClass:'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  low:     { label:'מתחת לפתיחה',  color:'text-terra-700 dark:text-terra-300',  bg:'bg-terra-50 dark:bg-terra-900/20',  border:'border-terra-200 dark:border-terra-700', dot:'bg-terra-400',  badgeClass:'bg-terra-50 dark:bg-terra-900/30 text-terra-700 dark:text-terra-300' },
  warning: { label:'קרוב לסף',     color:'text-amber-700 dark:text-amber-300',  bg:'bg-amber-50 dark:bg-amber-900/20',  border:'border-amber-200 dark:border-amber-700', dot:'bg-amber-400',  badgeClass:'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
  ok:      { label:'תקין',         color:'text-sage-600 dark:text-sage-400',     bg:'',                                  border:'',                                       dot:'bg-sage-400',   badgeClass:'bg-sage-50 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300' },
}

// ── WA icon ───────────────────────────────────────────────────────────────────
const WaIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

// ── Item edit form ────────────────────────────────────────────────────────────
function ItemForm({ draft, onChange, suppliers }) {
  const set = (k,v) => onChange({...draft,[k]:v})
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2">
          <label className="block text-xs text-espresso-400 font-sans mb-1">שם המוצר</label>
          <input value={draft.name} onChange={e=>set('name',e.target.value)} className="input-field" placeholder="לדוגמה: חלב 3%"/>
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">קטגוריה</label>
          <select value={draft.category} onChange={e=>set('category',e.target.value)} className="input-field">
            {Object.entries(inventoryCategories).map(([k,c])=>(
              <option key={k} value={k}>{c.emoji} {c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-espresso-400 font-sans mb-1">יחידת מידה</label>
          <input value={draft.unit} onChange={e=>set('unit',e.target.value)} className="input-field" placeholder='ק"ג, ליטר, יחידות'/>
        </div>
      </div>

      {/* The 3 key quantities */}
      <div className="bg-linen dark:bg-espresso-800 rounded-xl p-4 space-y-3">
        <p className="text-xs text-espresso-400 font-sans font-semibold uppercase tracking-wide">כמויות</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-espresso-400 font-sans mb-1">מלאי פתיחה</label>
            <input type="number" min="0" step="0.1" value={draft.opening}
              onChange={e=>set('opening',parseFloat(e.target.value)||0)}
              className="input-field text-center font-mono"/>
            <p className="text-xs text-espresso-400 mt-1">הסף להתראה</p>
          </div>
          <div>
            <label className="block text-xs text-espresso-400 font-sans mb-1">מלאי נוכחי</label>
            <input type="number" min="0" step="0.1" value={draft.current}
              onChange={e=>set('current',parseFloat(e.target.value)||0)}
              className="input-field text-center font-mono"/>
            <p className="text-xs text-espresso-400 mt-1">מה יש עכשיו</p>
          </div>
          <div>
            <label className="block text-xs text-espresso-400 font-sans mb-1">כמות להזמנה</label>
            <input type="number" min="0" step="0.1" value={draft.orderQty}
              onChange={e=>set('orderQty',parseFloat(e.target.value)||0)}
              className="input-field text-center font-mono"/>
            <p className="text-xs text-espresso-400 mt-1">כמה להזמין</p>
          </div>
        </div>
        {/* Visual gap indicator */}
        {draft.current < draft.opening && (
          <div className="flex items-center gap-2 pt-1">
            <div className="w-2 h-2 rounded-full bg-terra-400 flex-shrink-0"/>
            <p className="text-xs text-terra-600 dark:text-terra-300 font-sans">
              חסר: <strong>{(draft.opening - draft.current).toFixed(1)} {draft.unit}</strong> · יוזמן: <strong>{draft.orderQty} {draft.unit}</strong>
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">ספק</label>
        <select value={draft.supplierId||''} onChange={e=>set('supplierId',e.target.value)} className="input-field">
          <option value="">— ללא ספק —</option>
          {suppliers.filter(s=>s.active).map(s=>(
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs text-espresso-400 font-sans mb-1">הערות</label>
        <input value={draft.notes||''} onChange={e=>set('notes',e.target.value)} className="input-field" placeholder="מידע נוסף..."/>
      </div>
    </div>
  )
}

// ── Alert Banner ──────────────────────────────────────────────────────────────
function AlertBanner({ alerts, suppliers, onOrder, onDismiss }) {
  if (alerts.length === 0) return null
  return (
    <div className="card border-2 border-terra-300 dark:border-terra-600 bg-terra-50/50 dark:bg-terra-900/10">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-terra-400 text-white flex items-center justify-center flex-shrink-0">
            <Icons.Alert className="w-4 h-4"/>
          </div>
          <div>
            <p className="font-serif font-semibold text-terra-800 dark:text-terra-100">
              {alerts.length} מוצרים ירדו ממלאי הפתיחה!
            </p>
            <p className="text-xs text-terra-600 dark:text-terra-300 font-sans">נדרשת הזמנה חדשה</p>
          </div>
        </div>
        <button onClick={onDismiss} className="text-terra-400 hover:text-terra-600 transition p-1">
          <Icons.Close className="w-4 h-4"/>
        </button>
      </div>
      <div className="space-y-2">
        {alerts.map(item => {
          const supplier = suppliers.find(s=>s.id===item.supplierId)
          const gap = item.opening - item.current
          const status = getStatus(item)
          const meta = STATUS_META[status]
          return (
            <div key={item.id} className="flex items-center gap-3 bg-white dark:bg-espresso-700 rounded-xl px-3 py-2.5 border border-terra-100 dark:border-terra-800/30">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${meta.dot}`}/>
              <div className="flex-1 min-w-0">
                <span className="font-sans font-medium text-sm text-espresso-800 dark:text-espresso-50">{item.name}</span>
                <span className="text-xs text-espresso-400 font-sans mr-2">
                  · יש {item.current} {item.unit} / פתיחה {item.opening} {item.unit}
                  {gap > 0 && <span className="text-terra-500 dark:text-terra-300 font-medium"> · חסר {gap.toFixed(1)}</span>}
                </span>
                {supplier && <span className="text-xs text-espresso-400 font-sans">· {supplier.name}</span>}
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full border ${meta.badgeClass}`}>{meta.label}</span>
                {supplier && cleanPhone(supplier.phone) && (
                  <button onClick={() => onOrder([item], supplier)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 transition font-sans font-medium">
                    <WaIcon/> הזמן
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-terra-100 dark:border-terra-800/30 flex gap-2 flex-wrap">
        <button onClick={() => {
          const bySupplier = {}
          alerts.forEach(item => {
            const sup = suppliers.find(s=>s.id===item.supplierId)
            if (!sup || !cleanPhone(sup.phone)) return
            if (!bySupplier[sup.id]) bySupplier[sup.id] = { sup, items: [] }
            bySupplier[sup.id].items.push(item)
          })
          Object.values(bySupplier).forEach((g,i) => setTimeout(()=>onOrder(g.items,g.sup),i*700))
        }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-sans font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 transition">
          <WaIcon/> שלח הכל לספקים
        </button>
      </div>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export function Inventory() {
  const [inventory, setInventory]   = useLocalStorage('gelateria-inventory', defaultInventory)
  const [suppliers]                 = useLocalStorage('gelateria-suppliers', defaultSuppliers)
  const [dismissed, setDismissed]   = useLocalStorage('gelateria-alert-dismissed', '')
  const [filter, setFilter]         = useState('all')
  const [printMode, setPrintMode]   = useState(false)
  const [search, setSearch]         = useState('')

  const editModal  = useModal()
  const addModal   = useModal()
  const [draft, setDraft] = useState(null)

  // alerts: items below opening level
  const alerts = useMemo(()=>inventory.filter(i=>i.current<i.opening),[inventory])
  const todayKey = new Date().toISOString().slice(0,10)
  const showAlert = alerts.length > 0 && dismissed !== todayKey

  // stats
  const stats = useMemo(()=>({
    total:    inventory.length,
    empty:    inventory.filter(i=>getStatus(i)==='empty').length,
    low:      inventory.filter(i=>getStatus(i)==='low').length,
    warning:  inventory.filter(i=>getStatus(i)==='warning').length,
    ok:       inventory.filter(i=>getStatus(i)==='ok').length,
  }),[inventory])

  // filtered + searched
  const visible = useMemo(()=>{
    let items = inventory
    if (filter==='alerts')  items = items.filter(i=>i.current<i.opening)
    else if (filter!=='all') items = items.filter(i=>i.category===filter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      items = items.filter(i=>i.name.toLowerCase().includes(q) || (suppliers.find(s=>s.id===i.supplierId)?.name||'').toLowerCase().includes(q))
    }
    return items
  },[inventory, filter, search, suppliers])

  // group by category
  const grouped = useMemo(()=>{
    const g={}
    visible.forEach(item=>{ if(!g[item.category])g[item.category]=[]; g[item.category].push(item) })
    return g
  },[visible])

  // mutations
  const toggleOrdered = (id) =>
    setInventory(prev => prev.map(i => i.id === id ? {...i, ordered: !i.ordered} : i))
  const deleteItem   = id => { if(window.confirm('למחוק פריט?')) setInventory(prev=>prev.filter(i=>i.id!==id)) }
  const adjustQty    = (id, delta) => {
    setInventory(prev=>prev.map(i=>{
      if(i.id!==id) return i
      return {...i, current:Math.max(0,+(i.current+delta).toFixed(2))}
    }))
  }

  const openEdit = item => { setDraft({...item}); editModal.open() }
  const saveEdit = () => {
    setInventory(prev=>prev.map(i=>i.id===draft.id?{...draft}:i))
    editModal.close()
  }
  const openAdd = () => {
    setDraft({id:null,name:'',category:'dairy',unit:'ק"ג',current:0,opening:0,orderQty:0,supplierId:'',notes:''})
    addModal.open()
  }
  const saveAdd = () => {
    if(!draft?.name?.trim()) return
    setInventory(prev=>[...prev,{...draft,id:genId()}])
    addModal.close()
  }

  const sendOrder = (items, supplier) => {
    const msg = buildSupplierOrderMessage({
      supplier,
      items: items.map(i=>({ name:i.name, quantity:i.orderQty, unit:i.unit })),
      date: formatDate(new Date()),
    })
    openWhatsApp(supplier.phone, msg)
  }

  const reset = () => { if(window.confirm('לאפס לברירת מחדל?')) setInventory(defaultInventory) }

  // ── print ──────────────────────────────────────────────────────────────────
  if (printMode) {
    return (
      <div>
        <div className="no-print flex gap-2 mb-6">
          <Button variant="primary" onClick={()=>window.print()}><Icons.Print className="w-4 h-4"/> הדפס</Button>
          <Button variant="secondary" onClick={()=>setPrintMode(false)}><Icons.Close className="w-4 h-4"/> חזור</Button>
        </div>
        <div className="mb-6 pb-4 border-b-2 border-espresso-800">
          <h1 className="text-2xl font-serif font-bold">Sweet Station — דוח מלאי</h1>
          <p className="text-sm text-espresso-400 font-sans mt-1">{formatDate(new Date())} · {inventory.length} פריטים</p>
        </div>
        {Object.entries(inventoryCategories).map(([catKey,cat])=>{
          const items=inventory.filter(i=>i.category===catKey)
          if(!items.length) return null
          return (
            <div key={catKey} className="mb-7 avoid-break">
              <h2 className="text-base font-serif font-semibold mb-2">{cat.emoji} {cat.label}</h2>
              <table className="w-full text-sm font-sans border-collapse">
                <thead>
                  <tr className="bg-linen border-b border-silk">
                    <th className="text-right px-3 py-2 font-medium text-xs">מוצר</th>
                    <th className="text-center px-2 py-2 font-medium text-xs">פתיחה</th>
                    <th className="text-center px-2 py-2 font-medium text-xs">נוכחי</th>
                    <th className="text-center px-2 py-2 font-medium text-xs">להזמנה</th>
                    <th className="text-center px-2 py-2 font-medium text-xs">סטטוס</th>
                    <th className="text-right px-2 py-2 font-medium text-xs">ספק</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item,idx)=>{
                    const st=getStatus(item); const meta=STATUS_META[st]
                    const sup=suppliers.find(s=>s.id===item.supplierId)
                    return (
                      <tr key={item.id} className={`border-b border-silk/50 ${idx%2===0?'':'bg-linen/20'}`}>
                        <td className="px-3 py-2 font-medium">{item.name}</td>
                        <td className="px-2 py-2 text-center font-mono">{item.opening} {item.unit}</td>
                        <td className={`px-2 py-2 text-center font-mono font-bold ${meta.color}`}>{item.current} {item.unit}</td>
                        <td className="px-2 py-2 text-center font-mono">{item.orderQty} {item.unit}</td>
                        <td className="px-2 py-2 text-center"><span className={`px-2 py-0.5 rounded-full text-xs ${meta.badgeClass}`}>{meta.label}</span></td>
                        <td className="px-2 py-2 text-xs text-espresso-400">{sup?.name||'—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )
        })}
        <div className="mt-6 pt-4 border-t border-silk text-center">
          <p className="text-xs text-espresso-400 font-sans">bs-simple.com · בועז סעדה — פתרונות יצירתיים</p>
        </div>
      </div>
    )
  }

  // ── main ───────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="font-serif italic text-terra-400 mb-0.5">Gestione magazzino</p>
            <h1 className="text-3xl font-serif font-bold mb-1">ניהול מלאי</h1>
            <p className="text-sm text-espresso-400 font-sans">
              {inventory.length} מוצרים ·{' '}
              {alerts.length > 0
                ? <span className="text-terra-500 font-medium">{alerts.length} מתחת למלאי פתיחה</span>
                : <span className="text-sage-600">כל המלאי תקין</span>
              }
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" onClick={openAdd}><Icons.Plus className="w-4 h-4"/> מוצר חדש</Button>
            <Button variant="secondary" onClick={()=>setPrintMode(true)}><Icons.Print className="w-4 h-4"/> דוח מלאי</Button>
            <Button variant="ghost" onClick={reset}><Icons.Reset className="w-4 h-4"/></Button>
          </div>
        </div>

        {/* Alert banner */}
        {showAlert && (
          <AlertBanner
            alerts={alerts}
            suppliers={suppliers}
            onOrder={sendOrder}
            onDismiss={()=>setDismissed(todayKey)}
          />
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label:'סה"כ מוצרים', value:stats.total,   color:'' },
            { label:'תקין',         value:stats.ok,      color:'text-sage-600 dark:text-sage-400' },
            { label:'מתחת לפתיחה', value:stats.low,     color:'text-terra-500 dark:text-terra-300' },
            { label:'נגמר',         value:stats.empty,   color:'text-red-600 dark:text-red-400' },
          ].map((s,i)=>(
            <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3">
              <p className="text-xs text-espresso-400 font-sans uppercase tracking-wide mb-1">{s.label}</p>
              <p className={`text-2xl font-serif font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="flex flex-col gap-2">
          <input value={search} onChange={e=>setSearch(e.target.value)}
            className="input-field" placeholder="חפש מוצר או ספק..."/>
          <div className="flex flex-wrap gap-2">
            {[
              { key:'all',    label:'הכל' },
              { key:'alerts', label:`⚠️ צריך הזמנה (${alerts.length})`, danger:alerts.length>0 },
              ...Object.entries(inventoryCategories).map(([k,c])=>({ key:k, label:`${c.emoji} ${c.label}` })),
            ].map(f=>(
              <button key={f.key} onClick={()=>setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-sans font-medium transition border ${
                  filter===f.key
                    ? f.danger ? 'bg-terra-400 text-white border-transparent' : 'bg-espresso-800 dark:bg-espresso-600 text-white border-transparent'
                    : 'bg-white dark:bg-espresso-700 border-silk dark:border-espresso-600 text-espresso-500 hover:border-terra-200'
                }`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          {Object.keys(grouped).length === 0 && (
            <div className="card text-center py-12 text-espresso-400 font-sans">אין מוצרים להצגה</div>
          )}
          {Object.entries(grouped).map(([catKey, items])=>{
            const cat = inventoryCategories[catKey]
            const catAlerts = items.filter(i=>i.current<i.opening).length
            return (
              <div key={catKey} className="card p-0 overflow-hidden">
                {/* Category header */}
                <div className="flex items-center gap-2 px-5 py-3 bg-linen/60 dark:bg-espresso-800/60 border-b border-silk dark:border-espresso-700">
                  <span>{cat?.emoji}</span>
                  <span className="font-serif font-semibold text-sm">{cat?.label}</span>
                  <span className="text-xs text-espresso-400 font-sans">({items.length})</span>
                  {catAlerts>0 && (
                    <span className="mr-auto text-xs px-2 py-0.5 rounded-full bg-terra-50 dark:bg-terra-900/20 text-terra-600 dark:text-terra-300 border border-terra-200 dark:border-terra-700">
                      {catAlerts} צריך הזמנה
                    </span>
                  )}
                </div>

                {/* Items */}
                <div className="divide-y divide-silk/40 dark:divide-espresso-700/40">
                  {items.map(item=>{
                    const status = getStatus(item)
                    const meta   = STATUS_META[status]
                    const supplier = suppliers.find(s=>s.id===item.supplierId)
                    const gap      = item.opening - item.current
                    const pct      = item.opening>0 ? Math.min(100,Math.round((item.current/item.opening)*100)) : 100

                    return (
                      <div key={item.id}
                        className={`px-4 py-3 group transition ${status!=='ok'?meta.bg:'hover:bg-linen/30 dark:hover:bg-espresso-800/30'}`}>

                        <div className="flex items-start gap-3">
                          {/* Status dot */}
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${meta.dot}`}/>

                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-sans font-medium text-sm text-espresso-800 dark:text-espresso-50">{item.name}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full border ${meta.badgeClass}`}>{meta.label}</span>
                              {supplier && <span className="text-xs text-espresso-400 font-sans">{supplier.name}</span>}
                              {item.notes && <span className="text-xs text-espresso-400 font-sans">· {item.notes}</span>}
                            </div>

                            {/* Progress bar */}
                            <div className="flex items-center gap-3 mb-1.5">
                              <div className="flex-1 h-1.5 rounded-full bg-white/60 dark:bg-espresso-700 overflow-hidden max-w-[160px]">
                                <div className={`h-full rounded-full transition-all ${meta.dot}`} style={{width:`${pct}%`}}/>
                              </div>
                              <span className="text-xs font-mono text-espresso-500 dark:text-espresso-300">
                                {item.current} / {item.opening} {item.unit}
                              </span>
                            </div>

                            {/* Alert text */}
                            {gap > 0 && (
                              <p className={`text-xs font-sans ${meta.color}`}>
                                חסר <strong>{gap.toFixed(1)} {item.unit}</strong> למלאי פתיחה · יוזמן: <strong>{item.orderQty} {item.unit}</strong>
                              </p>
                            )}
                          </div>

                          {/* Controls */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* +/- */}
                            <button onClick={()=>adjustQty(item.id,-1)}
                              className="w-7 h-7 rounded-lg border border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 flex items-center justify-center text-espresso-400 hover:border-terra-300 transition">
                              <Icons.Minus className="w-3.5 h-3.5"/>
                            </button>
                            <input type="number" min="0" step="0.1" value={item.current}
                              onChange={e=>updateItem(item.id,{current:parseFloat(e.target.value)||0})}
                              className="w-14 text-center bg-white dark:bg-espresso-700 border border-silk dark:border-espresso-600 rounded-lg py-1 text-sm font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-terra-400"/>
                            <button onClick={()=>adjustQty(item.id,1)}
                              className="w-7 h-7 rounded-lg border border-silk dark:border-espresso-600 bg-white dark:bg-espresso-700 flex items-center justify-center text-espresso-400 hover:border-terra-300 transition">
                              <Icons.Plus className="w-3.5 h-3.5"/>
                            </button>

                            {/* WhatsApp order button */}
                            {gap>0 && supplier && cleanPhone(supplier.phone) && (
                              <button onClick={()=>sendOrder([item],supplier)}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-sans font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 transition mr-1">
                                <WaIcon/> הזמן
                              </button>
                            )}

                            {/* Mark as ordered */}
                            {gap>0 && (
                              <button onClick={()=>toggleOrdered(item.id)}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-sans font-medium transition border mr-1 ${
                                  item.ordered
                                    ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 hover:bg-amber-100'
                                    : 'bg-canvas dark:bg-espresso-700 text-espresso-400 border-silk hover:border-bisque'
                                }`}>
                                {item.ordered ? '📦 בהזמנה' : 'סמן כהוזמן'}
                              </button>
                            )}

                            {/* Edit / Delete */}
                            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={()=>openEdit(item)}
                                className="p-1.5 rounded-lg hover:bg-canvas dark:hover:bg-espresso-600 text-espresso-400 hover:text-terra-500 transition">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 16 16">
                                  <path d="M11 2l3 3-8 8H3v-3l8-8z" strokeLinejoin="round"/>
                                </svg>
                              </button>
                              <button onClick={()=>deleteItem(item.id)}
                                className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 text-espresso-400 hover:text-rose-500 transition">
                                <Icons.Trash className="w-3.5 h-3.5"/>
                              </button>
                            </div>
                          </div>
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

      {/* Edit modal */}
      <Modal isOpen={editModal.isOpen} onClose={editModal.close} title="ערוך מוצר" size="md"
        footer={<><Button variant="ghost" onClick={editModal.close}>ביטול</Button><Button variant="primary" onClick={saveEdit}>שמור</Button></>}>
        {draft && <ItemForm draft={draft} onChange={setDraft} suppliers={suppliers}/>}
      </Modal>

      {/* Add modal */}
      <Modal isOpen={addModal.isOpen} onClose={addModal.close} title="מוצר חדש" size="md"
        footer={<><Button variant="ghost" onClick={addModal.close}>ביטול</Button><Button variant="primary" onClick={saveAdd}>הוסף</Button></>}>
        {draft && <ItemForm draft={draft} onChange={setDraft} suppliers={suppliers}/>}
      </Modal>
    </>
  )
}
