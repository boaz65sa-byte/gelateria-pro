import { recipes, calculateRecipe } from '../data/recipes.js'
import { checklistTemplates } from '../data/checklistData.js'
import { dishes } from '../data/dishesData.js'
import { defaultInventory, inventoryCategories } from '../data/inventoryData.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { formatDate } from '../utils/dateFormat.js'
import { Button } from '../components/ui/Button.jsx'
import { Icons } from '../components/ui/Icons.jsx'

export function PrintableManual() {
  const [inventory] = useLocalStorage('gelateria-inventory', defaultInventory)

  return (
    <div className="space-y-8 max-w-[800px] mx-auto">
      <div className="card bg-gold-50/30 dark:bg-gold-800/10 border border-gold-100 dark:border-gold-800/30 no-print">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif font-semibold text-lg mb-1">ספר המתכונים והנהלים</h2>
            <p className="text-sm text-charcoal-500 dark:text-charcoal-200">
              לחץ "הדפס" כדי לייצר PDF מלא של כל התפעול — מתכונים, צ'קליסטים, מדריך הגשה ומלאי.
            </p>
          </div>
          <Button variant="primary" onClick={() => window.print()}>
            <Icons.Print className="w-4 h-4" />
            הדפס / שמור כ-PDF
          </Button>
        </div>
      </div>

      <div className="card avoid-break">
        <div className="text-center py-12 border-b border-charcoal-100 dark:border-charcoal-700">
          <div className="inline-block w-20 h-20 rounded-full bg-gold-400 text-charcoal-900 mb-6 flex items-center justify-center mx-auto">
            <Icons.IceCream className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">Gelateria Pro</h1>
          <p className="text-lg text-charcoal-500 dark:text-charcoal-200 font-serif italic mb-6">
            ספר מתכונים ונהלי תפעול
          </p>
          <p className="text-sm text-charcoal-500 dark:text-charcoal-200">
            הודפס ב-{formatDate(new Date())}
          </p>
        </div>

        <div className="py-8">
          <h2 className="text-sm uppercase tracking-wider font-sans font-semibold text-charcoal-500 mb-4">
            תוכן העניינים
          </h2>
          <ol className="space-y-2 text-sm">
            <li className="flex justify-between border-b border-dotted border-charcoal-100 dark:border-charcoal-700 pb-1">
              <span>1. נהלי פתיחה וסגירה</span>
            </li>
            <li className="flex justify-between border-b border-dotted border-charcoal-100 dark:border-charcoal-700 pb-1">
              <span>2. מתכוני בצקים</span>
            </li>
            <li className="flex justify-between border-b border-dotted border-charcoal-100 dark:border-charcoal-700 pb-1">
              <span>3. מדריך הגשת מנות</span>
            </li>
            <li className="flex justify-between border-b border-dotted border-charcoal-100 dark:border-charcoal-700 pb-1">
              <span>4. רשימת מלאי</span>
            </li>
          </ol>
        </div>
      </div>

      <div className="page-break" />

      <section className="avoid-break">
        <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-gold-400">
          1. נהלי פתיחה וסגירה
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(checklistTemplates).map(([key, template]) => (
            <div key={key} className="card avoid-break">
              <h3 className="font-serif font-semibold text-lg mb-1">{template.title}</h3>
              <p className="text-sm text-charcoal-500 dark:text-charcoal-200 mb-4">
                {template.subtitle}
              </p>
              <ol className="space-y-2">
                {template.items.map((item, idx) => (
                  <li key={item.id} className="flex gap-3 text-sm">
                    <span className="text-charcoal-500 dark:text-charcoal-200 font-mono">
                      {String(idx + 1).padStart(2, '0')}.
                    </span>
                    <span className="flex-1">
                      {item.text}
                      {item.critical && (
                        <span className="mr-1 text-red-600 font-bold" title="משימה קריטית">
                          ★
                        </span>
                      )}
                    </span>
                    <span className="w-5 h-5 border border-charcoal-200 dark:border-charcoal-500 rounded flex-shrink-0" />
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <div className="page-break" />

      <section>
        <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-gold-400">
          2. מתכוני בצקים
        </h2>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-200 mb-6">
          כל הכמויות להלן מחושבות ל-1 ק"ג בצק. השתמש במחשבון המתכונים לחישוב אוטומטי לכל כמות.
        </p>
        <div className="space-y-6">
          {recipes.map((recipe) => {
            const ingredients = calculateRecipe(recipe, 1)
            return (
              <div key={recipe.id} className="card avoid-break">
                <div className="mb-4 pb-4 border-b border-charcoal-50 dark:border-charcoal-700">
                  <h3 className="font-serif font-bold text-xl mb-1">{recipe.name}</h3>
                  <p className="text-sm text-charcoal-500 dark:text-charcoal-200">{recipe.subtitle}</p>
                  <p className="text-sm mt-2">{recipe.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-500 mb-2">
                      מרכיבים (ל-1 ק"ג)
                    </h4>
                    <table className="w-full text-sm">
                      <tbody>
                        {ingredients.map((ing, idx) => (
                          <tr key={idx} className="border-b border-charcoal-50 dark:border-charcoal-700 last:border-0">
                            <td className="py-1.5">{ing.name}</td>
                            <td className="py-1.5 text-left font-mono font-medium">
                              {ing.computed} g
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-500 mb-2">
                      אופן ההכנה
                    </h4>
                    <ol className="space-y-1.5 text-sm">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-charcoal-500 font-mono">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    <p className="text-xs text-charcoal-500 dark:text-charcoal-200 mt-3">
                      זמן מנוחה: {recipe.restTime} דק׳ · חיי מדף: {recipe.shelfLife} שעות
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="page-break" />

      <section>
        <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-gold-400">
          3. מדריך הגשת מנות
        </h2>
        <div className="space-y-6">
          {dishes.map((dish) => (
            <div key={dish.id} className="card avoid-break">
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-charcoal-50 dark:border-charcoal-700">
                <div>
                  <h3 className="font-serif font-bold text-xl">{dish.name}</h3>
                  <p className="text-sm text-charcoal-500 dark:text-charcoal-200">{dish.subtitle}</p>
                  <p className="text-sm mt-2">{dish.description}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="font-serif font-bold text-xl">₪{dish.price}</p>
                  <p className="text-xs text-charcoal-500 dark:text-charcoal-200">{dish.prepTime} דק׳</p>
                </div>
              </div>

              <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-500 mb-2">
                סדר ההגשה
              </h4>
              <ol className="space-y-2 mb-4">
                {dish.layers.map((layer) => (
                  <li key={layer.order} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-100 text-gold-700 text-xs font-bold flex items-center justify-center">
                      {layer.order}
                    </span>
                    <div>
                      <span className="font-medium">{layer.title}</span>
                      <span className="text-charcoal-500 dark:text-charcoal-200"> — {layer.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>

              {dish.tips?.length > 0 && (
                <>
                  <h4 className="text-xs uppercase tracking-wider font-semibold text-charcoal-500 mb-2">
                    טיפים
                  </h4>
                  <ul className="text-sm space-y-1">
                    {dish.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-gold-700 font-bold">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="page-break" />

      <section className="avoid-break">
        <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-gold-400">
          4. רשימת מלאי
        </h2>
        <div className="card">
          {Object.entries(inventoryCategories).map(([catKey, cat]) => {
            const items = inventory.filter((i) => i.category === catKey)
            if (items.length === 0) return null
            return (
              <div key={catKey} className="mb-5 last:mb-0">
                <h3 className="text-sm font-semibold mb-2 text-gold-700 dark:text-gold-200">
                  {cat.label}
                </h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-charcoal-100 dark:border-charcoal-700 text-xs text-charcoal-500">
                      <th className="text-right py-1.5 font-normal">פריט</th>
                      <th className="text-center py-1.5 font-normal">במלאי</th>
                      <th className="text-center py-1.5 font-normal">סף</th>
                      <th className="text-right py-1.5 font-normal">ספק</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-charcoal-50 dark:border-charcoal-700 last:border-0">
                        <td className="py-1.5">{item.name}</td>
                        <td className="py-1.5 text-center font-mono">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="py-1.5 text-center font-mono text-charcoal-500">
                          {item.threshold}
                        </td>
                        <td className="py-1.5 text-xs text-charcoal-500 dark:text-charcoal-200">
                          {item.supplier}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="text-center py-8 border-t border-charcoal-50 dark:border-charcoal-700">
        <p className="font-serif font-medium">bs-simple.com</p>
        <p className="text-sm text-charcoal-500 dark:text-charcoal-200">
          בועז סעדה — פתרונות יצירתיים
        </p>
      </footer>
    </div>
  )
}
