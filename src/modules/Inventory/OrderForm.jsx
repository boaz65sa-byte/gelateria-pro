import { useState } from 'react'
import { inventoryCategories } from '../../data/inventoryData.js'
import { formatDate } from '../../utils/dateFormat.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

export function OrderForm({ lowStockItems, onClose }) {
  const [orderQuantities, setOrderQuantities] = useState(() => {
    const initial = {}
    lowStockItems.forEach((item) => {
      initial[item.id] = Math.max(
        item.threshold * 2 - item.quantity,
        item.threshold
      )
    })
    return initial
  })

  const [notes, setNotes] = useState('')

  // Group by supplier
  const bySupplier = lowStockItems.reduce((acc, item) => {
    if (!acc[item.supplier]) acc[item.supplier] = []
    acc[item.supplier].push(item)
    return acc
  }, {})

  const updateQty = (id, val) => {
    setOrderQuantities((prev) => ({ ...prev, [id]: Math.max(0, parseFloat(val) || 0) }))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 mb-6 no-print">
        <div>
          <h2 className="text-xl font-serif font-semibold mb-1">טופס הזמנה</h2>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-200">
            נוצר אוטומטית מפריטים במלאי נמוך · {formatDate(new Date())}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handlePrint}>
            <Icons.Print className="w-4 h-4" />
            הדפס
          </Button>
          <Button variant="ghost" onClick={onClose}>
            <Icons.Close className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="print-only mb-6">
        <h1 className="text-2xl font-bold mb-1">טופס הזמנת סחורה</h1>
        <p className="text-sm">Gelateria Pro · {formatDate(new Date())}</p>
      </div>

      {Object.keys(bySupplier).length === 0 ? (
        <div className="text-center py-12 text-charcoal-500 dark:text-charcoal-200">
          <Icons.Check className="w-12 h-12 mx-auto mb-2 text-emerald-500" />
          <p>אין פריטים במלאי נמוך כעת</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(bySupplier).map(([supplier, items]) => (
            <div key={supplier} className="avoid-break">
              <h3 className="text-sm font-semibold mb-3 text-gold-700 dark:text-gold-200 border-b border-charcoal-50 dark:border-charcoal-700 pb-2">
                {supplier}
              </h3>
              <div className="rounded-lg border border-charcoal-50 dark:border-charcoal-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-ivory dark:bg-charcoal-700">
                    <tr>
                      <th className="text-right px-3 py-2 font-medium text-xs">פריט</th>
                      <th className="text-center px-3 py-2 font-medium text-xs">קטגוריה</th>
                      <th className="text-center px-3 py-2 font-medium text-xs">במלאי</th>
                      <th className="text-left px-3 py-2 font-medium text-xs">כמות להזמנה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const cat = inventoryCategories[item.category]
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-charcoal-50 dark:border-charcoal-700 last:border-0"
                        >
                          <td className="px-3 py-2.5">{item.name}</td>
                          <td className="px-3 py-2.5 text-center text-xs text-charcoal-500 dark:text-charcoal-200">
                            {cat?.label}
                          </td>
                          <td className="px-3 py-2.5 text-center text-xs">
                            <span className="text-charcoal-500 dark:text-charcoal-200">
                              {item.quantity} {item.unit}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-left">
                            <div className="flex items-center gap-1 justify-end">
                              <input
                                type="number"
                                min="0"
                                step="0.1"
                                value={orderQuantities[item.id]}
                                onChange={(e) => updateQty(item.id, e.target.value)}
                                className="input-field w-20 text-center py-1.5 text-sm no-print"
                              />
                              <span className="print-only font-semibold">
                                {orderQuantities[item.id]}
                              </span>
                              <span className="text-xs text-charcoal-500 dark:text-charcoal-200 mr-1">
                                {item.unit}
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          <div className="avoid-break">
            <label className="block text-sm font-medium mb-2">הערות לספק:</label>
            <textarea
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input-field resize-none"
              placeholder="למשל: להביא עד יום שלישי 10:00"
            />
            {notes && <p className="hidden print:block mt-2 text-sm">{notes}</p>}
          </div>

          <div className="print-only mt-8 pt-4 border-t text-xs">
            bs-simple.com · בועז סעדה — פתרונות יצירתיים
          </div>
        </div>
      )}
    </div>
  )
}
