import { Icons } from '../../components/ui/Icons.jsx'

export function InventoryItem({ item, onUpdate, onDelete }) {
  const isLow = item.quantity <= item.threshold
  const isCritical = item.quantity < item.threshold * 0.5

  const increment = () => onUpdate(item.id, { quantity: item.quantity + 1 })
  const decrement = () =>
    onUpdate(item.id, { quantity: Math.max(0, item.quantity - 1) })

  const setQuantity = (v) =>
    onUpdate(item.id, { quantity: Math.max(0, parseFloat(v) || 0) })

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg transition ${
        isCritical
          ? 'bg-red-50 dark:bg-red-900/20'
          : isLow
          ? 'bg-gold-50/50 dark:bg-gold-800/10'
          : 'hover:bg-ivory dark:hover:bg-charcoal-700'
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{item.name}</span>
          {isCritical && (
            <span className="badge-danger">
              <Icons.Alert className="w-3 h-3" />
              קריטי
            </span>
          )}
          {isLow && !isCritical && (
            <span className="badge-gold">מלאי נמוך</span>
          )}
        </div>
        <p className="text-xs text-charcoal-500 dark:text-charcoal-200 mt-0.5">
          ספק: {item.supplier} · סף: {item.threshold} {item.unit}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={decrement}
          className="w-8 h-8 rounded-md flex items-center justify-center text-charcoal-500 hover:bg-white dark:hover:bg-charcoal-600 transition"
          aria-label="הפחת"
        >
          <Icons.Minus className="w-4 h-4" />
        </button>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            min="0"
            step="0.1"
            value={item.quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-14 text-center bg-transparent font-mono font-semibold text-sm border-none focus:outline-none focus:ring-2 focus:ring-gold-400 rounded py-1"
          />
          <span className="text-xs text-charcoal-500 dark:text-charcoal-200 w-12">
            {item.unit}
          </span>
        </div>
        <button
          onClick={increment}
          className="w-8 h-8 rounded-md flex items-center justify-center text-charcoal-500 hover:bg-white dark:hover:bg-charcoal-600 transition"
          aria-label="הוסף"
        >
          <Icons.Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (window.confirm(`למחוק את "${item.name}"?`)) onDelete(item.id)
          }}
          className="w-8 h-8 rounded-md flex items-center justify-center text-charcoal-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition mr-2"
          aria-label="מחק"
        >
          <Icons.Trash className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
