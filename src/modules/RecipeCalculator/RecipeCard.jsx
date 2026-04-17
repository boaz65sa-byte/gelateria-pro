import { useMemo } from 'react'
import { calculateRecipe } from '../../data/recipes.js'
import { Icons } from '../../components/ui/Icons.jsx'
import { Button } from '../../components/ui/Button.jsx'

export function RecipeCard({ recipe, targetKg }) {
  const ingredients = useMemo(() => calculateRecipe(recipe, targetKg), [recipe, targetKg])
  const totalGrams   = useMemo(() => ingredients.reduce((s, i) => s + i.computed, 0), [ingredients])

  const fmt = g => g >= 1000 ? `${(g/1000).toFixed(2)} ק"ג` : `${g} g`

  return (
    <div className="card avoid-break">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <p className="font-serif italic text-terra-500 dark:text-terra-300 text-sm mb-0.5">Ricetta</p>
          <h2 className="text-2xl font-serif font-bold mb-1">{recipe.name}</h2>
          <p className="text-sm text-espresso-400 dark:text-espresso-300 font-sans">{recipe.subtitle}</p>
        </div>
        <Button variant="secondary" onClick={() => window.print()} className="no-print flex-shrink-0">
          <Icons.Print className="w-4 h-4" /> הדפס
        </Button>
      </div>

      {/* Meta strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-7">
        {[
          { label:'כמות סופית', value:`${targetKg} ק"ג` },
          { label:'סך חומרים',  value:fmt(totalGrams)   },
          ...(recipe.restTime > 0 ? [{ label:'זמן מנוחה', value:`${recipe.restTime} דק׳` }] : []),
          { label:'חיי מדף',    value:`${recipe.shelfLife} שע'` },
        ].map((m,i) => (
          <div key={i} className="bg-linen dark:bg-espresso-800 rounded-xl p-3 text-right">
            <p className="section-eyebrow mb-1">{m.label}</p>
            <p className="font-serif font-bold text-xl text-espresso-800 dark:text-espresso-50">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

        {/* Ingredients table */}
        <section>
          <p className="section-eyebrow">מרכיבים</p>
          <div className="rounded-xl border border-silk dark:border-espresso-600 overflow-hidden">
            <table className="w-full text-sm font-sans">
              <thead>
                <tr className="bg-linen dark:bg-espresso-800">
                  <th className="text-right px-4 py-2.5 font-medium text-xs text-espresso-400">מרכיב</th>
                  <th className="text-left  px-4 py-2.5 font-medium text-xs text-espresso-400">כמות</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing, idx) => (
                  <tr key={idx}
                      className={`border-t border-silk dark:border-espresso-700 ${
                        idx % 2 === 0 ? 'bg-white dark:bg-espresso-700' : 'bg-linen/40 dark:bg-espresso-800/40'
                      }`}>
                    <td className="px-4 py-2.5 text-espresso-700 dark:text-espresso-100">{ing.name}</td>
                    <td className="px-4 py-2.5 text-left font-mono font-semibold text-terra-600 dark:text-terra-300">
                      {fmt(ing.computed)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Instructions */}
        <section>
          <p className="section-eyebrow">אופן הכנה</p>
          <ol className="space-y-3">
            {recipe.instructions.map((step, idx) => (
              <li key={idx} className="flex gap-3 text-sm font-sans">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-terra-100 dark:bg-terra-900/40 text-terra-700 dark:text-terra-300 text-xs font-bold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span className="text-espresso-700 dark:text-espresso-100 leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  )
}
