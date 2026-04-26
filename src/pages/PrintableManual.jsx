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

      {/* Action bar */}
      <div className="card no-print">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif font-semibold text-lg mb-1">ספר המתכונים והנהלים</h2>
            <p className="text-sm text-espresso-500 dark:text-espresso-200 font-sans">
              לחץ "הדפס" כדי לייצר PDF מלא של כל התפעול — מתכונים, צ'קליסטים, מדריך הגשה ומלאי.
            </p>
          </div>
          <Button variant="primary" onClick={() => window.print()}>
            <Icons.Print className="w-4 h-4" />
            הדפס / שמור כ-PDF
          </Button>
        </div>
      </div>

      {/* Cover */}
      <div className="card avoid-break">
        <div className="text-center py-12 border-b border-silk dark:border-espresso-700">
          <div className="w-20 h-20 rounded-full bg-terra-400 text-white mb-6 flex items-center justify-center mx-auto"
               style={{boxShadow:'0 3px 14px rgba(255,92,107,0.40)'}}>
            <Icons.IceCream className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-2">Sweet Station Pro</h1>
          <p className="text-lg text-espresso-400 dark:text-espresso-300 font-serif italic mb-4">ספר מתכונים ונהלי תפעול</p>
          <p className="text-sm text-espresso-400 dark:text-espresso-300 font-sans">הודפס ב-{formatDate(new Date())}</p>
        </div>
        <div className="py-8">
          <h2 className="section-eyebrow mb-4">תוכן העניינים</h2>
          <ol className="space-y-2 text-sm font-sans">
            {['נהלי פתיחה וסגירה','מתכוני ייצור','מדריך הגשת מנות','רשימת מלאי'].map((item,i)=>(
              <li key={i} className="flex justify-between border-b border-dotted border-silk dark:border-espresso-700 pb-2">
                <span>{i+1}. {item}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="page-break"/>

      {/* 1. Checklists */}
      <section className="avoid-break">
        <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-terra-400">1. נהלי פתיחה וסגירה</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(checklistTemplates).map(([key, template]) => (
            <div key={key} className="card avoid-break">
              <h3 className="font-serif font-semibold text-lg mb-1">{template.title}</h3>
              <p className="text-sm text-espresso-400 dark:text-espresso-300 font-sans mb-4">{template.subtitle}</p>
              <ol className="space-y-2">
                {template.items.map((item, idx) => (
                  <li key={item.id} className="flex gap-3 text-sm font-sans">
                    <span className="text-espresso-400 font-mono flex-shrink-0">{String(idx+1).padStart(2,'0')}.</span>
                    <span className="flex-1">
                      {item.text}
                      {item.critical && <span className="mr-1 text-rose-500 font-bold"> ★</span>}
                    </span>
                    <span className="w-5 h-5 border border-silk dark:border-espresso-500 rounded flex-shrink-0"/>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <div className="page-break"/>

      {/* 2. Recipes */}
      <section>
        <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-terra-400">2. מתכוני ייצור</h2>
        <p className="text-sm text-espresso-400 dark:text-espresso-300 font-sans mb-6">כמויות ל-batch אחד. השתמש במחשבון המתכונים לכל כמות.</p>
        <div className="space-y-6">
          {recipes.map((recipe) => {
            const ingredients = calculateRecipe(recipe, 1)
            return (
              <div key={recipe.id} className="card avoid-break">
                <div className="mb-4 pb-4 border-b border-silk dark:border-espresso-700">
                  <h3 className="font-serif font-bold text-xl mb-0.5">{recipe.name}</h3>
                  <p className="text-sm text-espresso-400 font-sans">{recipe.subtitle} · {recipe.yieldUnits} מנות</p>
                  <p className="text-sm font-sans mt-1.5">{recipe.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="section-eyebrow mb-3">מרכיבים (batch)</h4>
                    <table className="w-full text-sm font-sans">
                      <tbody>
                        {ingredients.map((ing, idx) => (
                          <tr key={idx} className="border-b border-silk/50 dark:border-espresso-700/50 last:border-0">
                            <td className="py-1.5">{ing.name}</td>
                            <td className="py-1.5 text-left font-mono font-medium text-terra-600 dark:text-terra-300">
                              {ing.computed} {ing.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="section-eyebrow mb-3">אופן ההכנה</h4>
                    <ol className="space-y-1.5 text-sm font-sans">
                      {recipe.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-espresso-400 font-mono flex-shrink-0">{idx+1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                    {recipe.restTime > 0 && (
                      <p className="text-xs text-espresso-400 font-sans mt-3">
                        מנוחה: {recipe.restTime} דק׳ · חיי מדף: {recipe.shelfLife} שע'
                      </p>
                    )}
                    {recipe.notes && (
                      <p className="text-xs text-amber-700 dark:text-amber-300 font-sans mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        💡 {recipe.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="page-break"/>

      {/* 3. Plating */}
      <section>
        <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-terra-400">3. מדריך הגשת מנות</h2>
        <div className="space-y-6">
          {dishes.map((dish) => (
            <div key={dish.id} className="card avoid-break">
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-silk dark:border-espresso-700">
                <div>
                  <h3 className="font-serif font-bold text-xl">{dish.name}</h3>
                  <p className="text-sm text-espresso-400 font-sans">{dish.subtitle}</p>
                  <p className="text-sm font-sans mt-1.5">{dish.description}</p>
                </div>
                <div className="text-left flex-shrink-0">
                  <p className="font-serif font-bold text-xl">₪{dish.price}</p>
                  <p className="text-xs text-espresso-400 font-sans">{dish.prepTime} דק׳</p>
                </div>
              </div>
              <h4 className="section-eyebrow mb-3">סדר ההגשה</h4>
              <ol className="space-y-2 mb-4">
                {dish.layers.map((layer) => (
                  <li key={layer.order} className="flex gap-3 text-sm font-sans">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-terra-100 dark:bg-terra-900/30 text-terra-700 dark:text-terra-300 text-xs font-bold flex items-center justify-center">{layer.order}</span>
                    <div>
                      <span className="font-medium">{layer.title}</span>
                      <span className="text-espresso-400 dark:text-espresso-300"> — {layer.detail}</span>
                    </div>
                  </li>
                ))}
              </ol>
              {dish.tips?.length > 0 && (
                <>
                  <h4 className="section-eyebrow mb-2">טיפים</h4>
                  <ul className="text-sm space-y-1 font-sans">
                    {dish.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-terra-500 font-bold flex-shrink-0">✓</span>
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

      <div className="page-break"/>

      {/* 4. Inventory */}
      <section className="avoid-break">
        <h2 className="text-2xl font-serif font-bold mb-4 pb-2 border-b-2 border-terra-400">4. רשימת מלאי</h2>
        <div className="card">
          {Object.entries(inventoryCategories).map(([catKey, cat]) => {
            const items = inventory.filter((i) => i.category === catKey)
            if (items.length === 0) return null
            return (
              <div key={catKey} className="mb-6 last:mb-0">
                <h3 className="text-sm font-semibold font-sans mb-3 text-terra-600 dark:text-terra-300 flex items-center gap-1.5">
                  <span>{cat.emoji}</span> {cat.label}
                </h3>
                <table className="w-full text-sm font-sans">
                  <thead>
                    <tr className="border-b border-silk dark:border-espresso-700 text-xs text-espresso-400">
                      <th className="text-right py-1.5 font-medium">פריט</th>
                      <th className="text-center py-1.5 font-medium">נוכחי</th>
                      <th className="text-center py-1.5 font-medium">סף פתיחה</th>
                      <th className="text-center py-1.5 font-medium">להזמנה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => {
                      const isLow = item.current < item.opening
                      return (
                        <tr key={item.id}
                          className={`border-b border-silk/50 dark:border-espresso-700/50 last:border-0 ${isLow?'bg-terra-50/50 dark:bg-terra-900/10':''}`}>
                          <td className="py-1.5 font-medium">
                            {isLow && <span className="text-terra-500 ml-1 text-xs">⚠</span>}
                            {item.name}
                          </td>
                          <td className={`py-1.5 text-center font-mono ${isLow?'text-terra-600 dark:text-terra-300 font-bold':''}`}>
                            {item.current} {item.unit}
                          </td>
                          <td className="py-1.5 text-center font-mono text-espresso-400">{item.opening} {item.unit}</td>
                          <td className="py-1.5 text-center font-mono text-espresso-400">{item.orderQty} {item.unit}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        </div>
      </section>

      <footer className="text-center py-8 border-t border-silk dark:border-espresso-700 print-only">
        <p className="font-serif font-medium text-espresso-600 dark:text-espresso-200">bs-simple.com</p>
        <p className="text-sm text-espresso-400 font-sans">בועז סעדה — פתרונות יצירתיים</p>
      </footer>
    </div>
  )
}
