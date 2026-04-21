import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { inventoryCategories } from '../../data/inventoryData.js'
import { defaultSuppliers } from '../../data/suppliersData.js'
import { formatDate } from '../../utils/dateFormat.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'
import { openWhatsApp, buildSupplierOrderMessage, cleanPhone } from '../../utils/whatsapp.js'

const WA_ICON = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

export function OrderForm({ lowStockItems, onClose }) {
  const [suppliers] = useLocalStorage('gelateria-suppliers', defaultSuppliers)
  const [orderQuantities, setOrderQuantities] = useState(() => {
    const init = {}
    lowStockItems.forEach(item => {
      init[item.id] = Math.max(item.threshold * 2 - item.quantity, item.threshold)
    })
    return init
  })
  const [notes, setNotes] = useState('')

  // Group items by matching supplier (by category)
  const bySupplier = lowStockItems.reduce((acc, item) => {
    // Find a supplier that handles this category
    const matchedSup = suppliers.find(s => s.active && s.categories.includes(item.category))
    const key = matchedSup ? matchedSup.id : '_no_supplier'
    const label = matchedSup ? matchedSup.name : (item.supplier || 'ספק לא מוגדר')
    if (!acc[key]) acc[key] = { label, supplier: matchedSup || null, items: [] }
    acc[key].items.push(item)
    return acc
  }, {})

  const updateQty = (id, val) =>
    setOrderQuantities(prev => ({ ...prev, [id]: Math.max(0, parseFloat(val) || 0) }))

  const sendToSupplier = (supplierGroup) => {
    const { supplier, items, label } = supplierGroup
    if (!supplier || !cleanPhone(supplier.phone)) {
      alert(`לספק "${label}" אין מספר WhatsApp.\nהגדר מספר בעמוד ההגדרות.`)
      return
    }
    const orderItems = items.map(item => ({
      name: item.name,
      quantity: orderQuantities[item.id],
      unit: item.unit,
    }))
    const msg = buildSupplierOrderMessage({
      supplier,
      items: orderItems,
      date: formatDate(new Date()),
    })
    openWhatsApp(supplier.phone, msg)
  }

  const sendAll = () => {
    const groups = Object.values(bySupplier).filter(g => g.supplier && cleanPhone(g.supplier.phone))
    if (groups.length === 0) {
      alert('לא נמצאו ספקים עם מספר WhatsApp. הגדר ספקים בעמוד ההגדרות.')
      return
    }
    groups.forEach((g, i) => {
      setTimeout(() => sendToSupplier(g), i * 600)
    })
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 mb-6 no-print">
        <div>
          <h2 className="text-xl font-serif font-semibold mb-1">טופס הזמנה</h2>
          <p className="text-sm font-sans text-espresso-400 dark:text-espresso-300">
            נוצר אוטומטית · {formatDate(new Date())}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={sendAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-sans font-medium bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100 transition">
            <WA_ICON />
            שלח הכל ל-WhatsApp
          </button>
          <Button variant="secondary" onClick={() => window.print()}>
            <Icons.Print className="w-4 h-4" /> הדפס
          </Button>
          <Button variant="ghost" onClick={onClose}><Icons.Close className="w-4 h-4" /></Button>
        </div>
      </div>

      <div className="print-only mb-6">
        <h1 className="text-2xl font-bold mb-1">טופס הזמנת סחורה</h1>
        <p className="text-sm">The Sweet Station · {formatDate(new Date())}</p>
      </div>

      {Object.keys(bySupplier).length === 0 ? (
        <div className="text-center py-12 text-espresso-400">
          <Icons.Check className="w-12 h-12 mx-auto mb-2 text-sage-400" />
          <p className="font-sans">אין פריטים במלאי נמוך</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(bySupplier).map(([key, group]) => {
            const { supplier, label, items } = group
            const hasPhone = supplier && cleanPhone(supplier.phone)
            return (
              <div key={key} className="avoid-break">
                {/* Supplier header */}
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-silk dark:border-espresso-700">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-serif font-semibold text-espresso-800 dark:text-espresso-50">{label}</h3>
                    {supplier && (
                      <span className="text-xs font-mono text-espresso-400" dir="ltr">
                        {cleanPhone(supplier.phone) || 'אין מספר'}
                      </span>
                    )}
                    {supplier?.note && (
                      <span className="tag text-xs">📝 {supplier.note}</span>
                    )}
                  </div>
                  <button
                    onClick={() => sendToSupplier(group)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition border no-print ${
                      hasPhone
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 hover:bg-emerald-100'
                        : 'bg-canvas dark:bg-espresso-700 text-espresso-400 border-silk'
                    }`}
                    title={hasPhone ? `שלח הזמנה ל-${label}` : 'הוסף מספר WhatsApp בהגדרות'}>
                    <WA_ICON />
                    {hasPhone ? `שלח ל-${label}` : 'אין מספר'}
                  </button>
                </div>

                {/* Items table */}
                <div className="rounded-xl border border-silk dark:border-espresso-600 overflow-hidden">
                  <table className="w-full text-sm font-sans">
                    <thead className="bg-linen dark:bg-espresso-800">
                      <tr>
                        <th className="text-right px-4 py-2.5 font-medium text-xs text-espresso-400">פריט</th>
                        <th className="text-center px-3 py-2.5 font-medium text-xs text-espresso-400">קטגוריה</th>
                        <th className="text-center px-3 py-2.5 font-medium text-xs text-espresso-400">במלאי</th>
                        <th className="text-left px-4 py-2.5 font-medium text-xs text-espresso-400">כמות להזמנה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => {
                        const cat = inventoryCategories[item.category]
                        return (
                          <tr key={item.id} className="border-t border-silk dark:border-espresso-700">
                            <td className="px-4 py-2.5 font-medium">{item.name}</td>
                            <td className="px-3 py-2.5 text-center text-xs text-espresso-400">{cat?.label}</td>
                            <td className="px-3 py-2.5 text-center text-xs text-espresso-400">
                              {item.quantity} {item.unit}
                            </td>
                            <td className="px-4 py-2.5 text-left">
                              <div className="flex items-center gap-1 justify-end">
                                <input
                                  type="number" min="0" step="0.1"
                                  value={orderQuantities[item.id]}
                                  onChange={e => updateQty(item.id, e.target.value)}
                                  className="input-field w-20 text-center py-1.5 text-sm no-print"
                                />
                                <span className="print-only font-semibold">{orderQuantities[item.id]}</span>
                                <span className="text-xs text-espresso-400">{item.unit}</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}

          <div>
            <label className="block text-sm font-sans font-medium mb-2">הערות כלליות:</label>
            <textarea rows="2" value={notes} onChange={e => setNotes(e.target.value)}
              className="input-field resize-none" placeholder="הערות נוספות לטופס..." />
          </div>

          <div className="print-only mt-8 pt-4 border-t border-silk text-xs text-center">
            bs-simple.com · בועז סעדה — פתרונות יצירתיים
          </div>
        </div>
      )}
    </div>
  )
}
