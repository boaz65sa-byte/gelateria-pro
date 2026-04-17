import { useMemo } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage.js'
import { formatTime, todayKey } from '../../utils/dateFormat.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

export function Checklist({ template, storageKey }) {
  const fullKey = `gelateria-${storageKey}-${todayKey()}`
  const [state, setState] = useLocalStorage(fullKey, {})

  const toggle = id => {
    setState(prev => {
      const next = { ...prev }
      if (next[id]) delete next[id]; else next[id] = new Date().toISOString()
      return next
    })
  }
  const resetAll = () => { if (window.confirm('למחוק את כל הסימונים?')) setState({}) }

  const { completed, total, critical, criticalDone } = useMemo(() => {
    const completedItems   = template.items.filter(i => state[i.id]).length
    const criticalItems    = template.items.filter(i => i.critical)
    const criticalCompleted = criticalItems.filter(i => state[i.id]).length
    return { completed: completedItems, total: template.items.length, critical: criticalItems.length, criticalDone: criticalCompleted }
  }, [state, template.items])

  const progress = total > 0 ? Math.round((completed / total) * 100) : 0
  const allDone  = completed === total && total > 0

  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="text-xl font-serif font-semibold mb-0.5">{template.title}</h2>
          <p className="text-sm font-sans text-espresso-400 dark:text-espresso-300">{template.subtitle}</p>
        </div>
        {completed > 0 && (
          <Button variant="ghost" onClick={resetAll} className="text-xs">
            <Icons.Reset className="w-4 h-4" /> אפס
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm font-sans mb-2">
          <span className={`font-medium ${allDone ? 'text-sage-600 dark:text-sage-400' : 'text-espresso-700 dark:text-espresso-100'}`}>
            {allDone ? '✓ הכל הושלם!' : `${completed} מתוך ${total}`}
          </span>
          <span className="text-espresso-400 dark:text-espresso-400 font-mono text-xs">{progress}%</span>
        </div>
        <div className="progress-track">
          <div className={`h-full rounded-full transition-all duration-700 ease-out ${allDone ? 'bg-sage-400' : 'bg-terra-400'}`}
               style={{ width:`${progress}%` }} />
        </div>
        {critical > 0 && (
          <p className="text-xs text-espresso-400 dark:text-espresso-400 mt-2 font-sans">
            ★ משימות קריטיות: {criticalDone}/{critical}
          </p>
        )}
      </div>

      <ul className="space-y-1">
        {template.items.map(item => {
          const checkedAt = state[item.id]
          const isChecked = !!checkedAt
          return (
            <li key={item.id}>
              <button onClick={() => toggle(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl text-right transition-all ${
                  isChecked
                    ? 'bg-sage-50 dark:bg-sage-800/10'
                    : 'hover:bg-linen dark:hover:bg-espresso-700/60'
                }`}>
                <div className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all border-2 ${
                  isChecked
                    ? 'bg-sage-400 border-sage-400 text-white'
                    : 'border-silk dark:border-espresso-500'
                }`}>
                  {isChecked && <Icons.Check className="w-3 h-3" />}
                </div>
                <span className={`flex-1 text-sm font-sans ${
                  isChecked
                    ? 'text-espresso-400 dark:text-espresso-400 line-through'
                    : 'text-espresso-700 dark:text-espresso-100'
                }`}>
                  {item.text}
                  {item.critical && !isChecked && (
                    <span className="mr-1.5 text-rose-500 text-xs" title="קריטי">★</span>
                  )}
                </span>
                {checkedAt && (
                  <span className="text-xs text-espresso-400 dark:text-espresso-400 flex items-center gap-1 flex-shrink-0 font-mono">
                    <Icons.Clock className="w-3 h-3" />{formatTime(checkedAt)}
                  </span>
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
